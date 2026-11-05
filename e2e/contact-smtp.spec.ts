import net from 'node:net';
import { expect, test } from '@playwright/test';
import { POST } from '../src/app/api/contact/route';

/*
 * Drives the contact route's SMTP path against a tiny in-process SMTP server, so the real
 * nodemailer conversation (greeting, sign-in, envelope, message) is exercised without sending mail.
 */
function fakeSmtp(authReply: string) {
  const mail = { data: '', from: '', to: '' };
  const server = net.createServer((s) => {
    let inData = false;
    let buf = '';
    s.write('220 fake ESMTP\r\n');
    s.on('data', (chunk) => {
      buf += chunk.toString();
      let i;
      while ((i = buf.indexOf('\r\n')) >= 0) {
        const line = buf.slice(0, i);
        buf = buf.slice(i + 2);
        if (inData) {
          if (line === '.') {
            inData = false;
            s.write('250 queued\r\n');
          } else mail.data += line + '\n';
        } else if (/^(EHLO|HELO)/i.test(line)) s.write('250-fake\r\n250 AUTH PLAIN LOGIN\r\n');
        else if (/^AUTH/i.test(line)) s.write(authReply);
        else if (/^MAIL FROM/i.test(line)) {
          mail.from = line;
          s.write('250 ok\r\n');
        } else if (/^RCPT TO/i.test(line)) {
          mail.to = line;
          s.write('250 ok\r\n');
        } else if (/^DATA/i.test(line)) {
          inData = true;
          s.write('354 go\r\n');
        } else if (/^QUIT/i.test(line)) s.end('221 bye\r\n');
        else s.write('250 ok\r\n');
      }
    });
  });
  return new Promise<{ port: number; mail: typeof mail; close: () => void }>((resolve) =>
    server.listen(0, '127.0.0.1', () =>
      resolve({
        port: (server.address() as net.AddressInfo).port,
        mail,
        close: () => server.close(),
      }),
    ),
  );
}

const enquiry = {
  name: 'Asha Rao',
  email: 'asha@example.org',
  company: 'Acme Realty',
  service: 'Mobile app',
  brief: 'An owner app for our township.',
  source: 'Pitch page (Acme Realty)',
  startedAt: Date.now() - 10_000,
};
const post = () =>
  POST(
    new Request('http://x/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(enquiry),
    }),
  );

test.describe('contact route over SMTP', () => {
  test.skip(({ isMobile }) => isMobile, 'server-only; one project is enough');
  const saved = { ...process.env };
  test.afterEach(() => {
    process.env = { ...saved };
  });

  test('sends the enquiry from our mailbox with reply-to set to the visitor', async () => {
    const smtp = await fakeSmtp('235 ok\r\n');
    Object.assign(process.env, {
      SMTP_HOST: '127.0.0.1',
      SMTP_PORT: String(smtp.port),
      SMTP_USER: 'contact@example.org',
      SMTP_PASS: 'test-only',
      CONTACT_TO: 'inbox@example.org',
    });
    delete process.env.CONTACT_DELIVERY;
    const res = await post();
    smtp.close();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(smtp.mail.from).toContain('contact@example.org');
    expect(smtp.mail.to).toContain('inbox@example.org');
    expect(smtp.mail.data).toMatch(/^Reply-To: asha@example\.org/m);
    expect(smtp.mail.data).toMatch(/^Subject: Project enquiry: Mobile app \(Asha Rao\)/m);
    expect(smtp.mail.data).toContain('Source: Pitch page (Acme Realty)');
    expect(smtp.mail.data).toContain('An owner app for our township.');
  });

  test('a refused sign-in reports failure, never a false success, and logs no personal data', async () => {
    const smtp = await fakeSmtp('535 bad credentials\r\n');
    Object.assign(process.env, {
      SMTP_HOST: '127.0.0.1',
      SMTP_PORT: String(smtp.port),
      SMTP_USER: 'contact@example.org',
      SMTP_PASS: 'pw-marker-7731',
    });
    delete process.env.CONTACT_DELIVERY;
    const logged: string[] = [];
    const orig = console.error;
    console.error = (...a: unknown[]) => logged.push(a.join(' '));
    try {
      const res = await post();
      expect(res.status).toBe(502);
    } finally {
      console.error = orig;
      smtp.close();
    }
    expect(logged.join('\n')).toContain('contact: send failed');
    expect(logged.join('\n')).not.toContain('asha@example.org');
    expect(logged.join('\n')).not.toContain('pw-marker-7731');
  });
  test('half-configured SMTP says so instead of quietly using the relay', async () => {
    Object.assign(process.env, { SMTP_HOST: '127.0.0.1', SMTP_USER: 'contact@example.org' });
    delete process.env.SMTP_PASS;
    delete process.env.CONTACT_DELIVERY;
    const logged: string[] = [];
    const orig = console.error;
    console.error = (...a: unknown[]) => logged.push(a.join(' '));
    try {
      const res = await post();
      expect(res.status).toBe(503);
      expect(await res.json()).toEqual({ error: 'smtp-incomplete' });
    } finally {
      console.error = orig;
    }
    expect(logged.join(' ')).toContain('missing SMTP_PASS');
  });

  test('with no server sender, the browser is handed the Web3Forms key', async () => {
    for (const k of ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'RESEND_API_KEY', 'CONTACT_DELIVERY'])
      delete process.env[k];
    process.env.WEB3FORMS_KEY = '11111111-2222-3333-4444-555555555555';
    const res = await post();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      relay: 'web3forms',
      key: '11111111-2222-3333-4444-555555555555',
    });
  });
});
