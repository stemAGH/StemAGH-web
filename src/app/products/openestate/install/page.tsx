import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/container';
import { JsonLd } from '@/components/json-ld';
import { ButtonLink, TextLink } from '@/components/links';
import { ProductAccent } from '@/components/product-accent';
import { ProjectBrief } from '@/components/project-brief';
import { Section, SectionHeading } from '@/components/section';
import { getProduct } from '@/content/products';
import { openGraph } from '@/content/seo';

/*
 * Written from docs/docs/installation.md in the OpenEstate repository (v0.8.4). The repository is
 * the source of truth: re-check this page whenever products.ts `reviewedOn` is bumped (docs/launch.md).
 */

const title = 'Install OpenEstate on Ubuntu: Step-by-Step Guide';
const description =
  'Install the OpenEstate real-estate CRM on your own Ubuntu server: requirements, prerequisites, the installer, first login, HTTPS, upgrades, backups and troubleshooting.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: openGraph(`${title} | StemAGH`, description, '/products/openestate/install'),
};

const product = getProduct('openestate')!;
const version = product.version ?? 'v0.8.4';
const { links } = product;

const prerequisites = `sudo apt-get update

# Base tools first: the Node.js step pipes through curl, and git fetches the source.
sudo apt-get install -y git curl openssl build-essential python3

# Node.js 20 (NodeSource; Ubuntu's own repository ships an older version)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL: use the line that matches your Ubuntu release
sudo apt-get install -y postgresql-16 postgresql-client-16   # Ubuntu 22.04 / 24.04
# sudo apt-get install -y postgresql postgresql-client       # Ubuntu 25.04 and later
sudo systemctl enable --now postgresql

# Redis
sudo apt-get install -y redis-server
sudo systemctl enable --now redis-server

# nginx
sudo apt-get install -y nginx`;

const installer = `git clone https://github.com/stemAGH/openestate.git /opt/openestate-src
cd /opt/openestate-src/deploy/native
sudo ./install-native.sh --server-name crm.yourcompany.com`;

const tls = `sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d crm.yourcompany.com`;

const firewall = `sudo ufw allow 22,80,443/tcp
sudo ufw enable`;

const operate = [
  {
    id: 'upgrade',
    title: 'Upgrade to a new version',
    body: [
      'The script takes a backup first, builds the new release next to the running one, runs the database migrations, switches over and checks health. If the health check fails it rolls the code back automatically. It does not undo database migrations, which only move forward.',
      'Always pass a release tag such as the one below, never a branch name like master. A tag has no stale local copy, so the script cannot quietly install old code. Read the release notes for the version before you upgrade, and make sure the server clock is synchronised (timedatectl shows "System clock synchronized: yes").',
    ],
    code: `cd /opt/openestate-src/deploy/native\nsudo ./upgrade-native.sh --ref ${version}`,
    label: 'Upgrade command',
  },
  {
    id: 'backup',
    title: 'Back up and restore',
    body: [
      'One command bundles the database, the uploaded files and the environment file into a timestamped folder under /var/backups/openestate. The environment file is not optional: the encryption keys for PAN numbers, two-factor secrets and plugin secrets live only there, and encrypted data cannot be read without them. Copy bundles off the server and treat them as secrets.',
      'Restore drops and recreates the database, so it asks you to confirm. Practise a restore on a second server before you need it.',
    ],
    code: `cd /opt/openestate-src/deploy/native\nsudo ./backup-native.sh\n\n# Disaster recovery (destructive, asks for confirmation)\nsudo ./restore-native.sh --force /var/backups/openestate/<backup-folder>`,
    label: 'Backup and restore commands',
  },
  {
    id: 'recover',
    title: 'Recover a lost admin password or 2FA',
    body: [
      'This needs shell access to the server, by design: nobody can reset your password remotely. It prints a new random password once. The script keeps two-factor authentication on unless you add --clear-2fa.',
    ],
    code: `cd /opt/openestate-src/deploy/native\nsudo ./reset-admin-password.sh --email admin@demo-realty.com\n\n# Also clear two-factor authentication:\nsudo ./reset-admin-password.sh --email admin@demo-realty.com --clear-2fa`,
    label: 'Admin password reset commands',
  },
  {
    id: 'uninstall',
    title: 'Uninstall',
    body: [
      'Neither form touches PostgreSQL, Redis or the data in them. Take a final backup first if you might want the data again.',
    ],
    code: `cd /opt/openestate-src/deploy/native\nsudo ./uninstall.sh            # stops the service, removes the nginx site, keeps your data\nsudo ./uninstall.sh --purge    # also deletes /opt/openestate, /etc/openestate, /var/log/openestate and /var/lib/openestate`,
    label: 'Uninstall commands',
  },
];

const troubleshooting = [
  [
    'The installer stops at a prerequisite check',
    'A required package is missing or the wrong version. The error lists everything missing in one pass, with a ready-to-paste command for your Ubuntu version.',
  ],
  [
    'systemctl status openestate-api shows "failed"',
    'Usually a bad value in /etc/openestate/openestate.env, or PostgreSQL or Redis is not reachable. Run journalctl -u openestate-api -n 100: the startup error names the exact variable.',
  ],
  [
    'nginx returns 502 on /api/',
    'The API is not listening on 127.0.0.1:3000. Check the service status, and that PORT in the environment file matches the nginx site config.',
  ],
  [
    'nginx returns 404 under /portal/',
    'The portal build folder is missing, or the site config is older than the last build. Re-run install-native.sh or upgrade-native.sh.',
  ],
  [
    'The build runs out of memory',
    'The server is below the 4 GB minimum or under load. Build on a bigger machine, or add swap temporarily.',
  ],
  [
    'You cannot sign in after a password reset',
    'The browser holds a stale session cookie. Clear cookies for the domain or use a private window.',
  ],
  [
    'Customers and brokers get no SMS or email',
    'Notifications are only written to the log in this release (journalctl -u openestate-api). Everything else works. Sending real messages needs a provider to be built and wired in.',
  ],
  [
    'An upgrade fails during a migration',
    'The previous release stays running. Restore the backup taken at the start if you suspect the migration, then open an issue with the error output.',
  ],
] as const;

const steps = [
  { id: 'before', label: 'Before you start' },
  { id: 'prerequisites', label: '1. Prerequisites' },
  { id: 'install', label: '2. Run the installer' },
  { id: 'first-login', label: '3. First login' },
  { id: 'https', label: '4. HTTPS and firewall' },
  { id: 'operate', label: 'Upgrade, backup, recover' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'help', label: 'Get help' },
];

function Code({ label, children }: { label: string; children: string }) {
  return (
    <figure className="min-w-0 overflow-hidden rounded-card border border-line-strong">
      <pre
        tabIndex={0}
        aria-label={label}
        className="overflow-x-auto bg-ink p-4 font-mono text-sm leading-relaxed text-canvas"
      >
        <code>{children}</code>
      </pre>
    </figure>
  );
}

export default function InstallPage() {
  const reviewed = new Date(product.reviewedOn).toLocaleDateString('en-GB', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <ProductAccent accent={product.accent}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: 'Install OpenEstate on an Ubuntu server',
          description,
          totalTime: 'PT15M',
          step: [
            {
              '@type': 'HowToStep',
              name: 'Install the prerequisites',
              text: 'Install git, curl, build tools, Node.js 20, PostgreSQL, Redis and nginx with apt.',
            },
            {
              '@type': 'HowToStep',
              name: 'Run the installer',
              text: 'Clone the repository to /opt/openestate-src and run deploy/native/install-native.sh with your server name.',
            },
            {
              '@type': 'HowToStep',
              name: 'Sign in and secure the admin account',
              text: 'Sign in with the seeded admin login and the one-time printed password, change it when prompted, then enable two-factor authentication.',
            },
            {
              '@type': 'HowToStep',
              name: 'Add HTTPS and a firewall',
              text: 'Point a domain at the server, run certbot for nginx, and allow only ports 22, 80 and 443.',
            },
          ],
        }}
      />

      <section aria-labelledby="install-title" className="border-b border-line bg-surface">
        <Container className="py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href="/products"
                  className="underline-offset-4 hover:text-ink hover:underline"
                >
                  Products
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href="/products/openestate"
                  className="underline-offset-4 hover:text-ink hover:underline"
                >
                  OpenEstate
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page">Install</li>
            </ol>
          </nav>
          <h1
            id="install-title"
            className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
          >
            Install OpenEstate on your own server
          </h1>
          <p className="mt-5 max-w-3xl text-xl text-pretty text-ink">
            A native install on Ubuntu: one systemd service, your own PostgreSQL and Redis, and
            nginx in front. No Docker, no hosted dependency.
          </p>
          <p className="mt-4 max-w-3xl text-pretty text-ink-muted">
            You need to be comfortable in a terminal, not to write code. Plan on 5 to 15 minutes,
            most of it the first build.
          </p>
          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line lg:grid-cols-4">
            {[
              ['Release', version],
              ['Time', '5 to 15 minutes'],
              ['Server', 'Ubuntu, 2 vCPU, 4 GB RAM'],
              ['Licence', product.license ?? ''],
            ].map(([k, v]) => (
              <div key={k} className="bg-canvas p-4">
                <dt className="text-sm text-ink-muted">{k}</dt>
                <dd className="mt-1 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <nav aria-label="On this page" className="mt-8">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {steps.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-accent underline underline-offset-4 hover:text-accent-hover"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </section>

      <Section id="before" labelledBy="before-title">
        <SectionHeading id="before-title" eyebrow="Requirements" title="Before you start" />
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <ul className="space-y-3 text-pretty">
            {[
              'An Ubuntu server with root or sudo access, x86_64 (amd64). ARM is not officially supported.',
              'At least 2 vCPU, 4 GB RAM and 40 GB disk. For a real company, 4 vCPU, 8 GB RAM and 80 GB or more, because documents and receipts add up.',
              'Ports 80 and 443 open if you use a domain with HTTPS.',
              'A domain name pointed at the server, for anything beyond a trial.',
              'Optional: an SMTP account and an SMS provider, for later.',
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-product" />
                {t}
              </li>
            ))}
          </ul>
          <div className="rounded-card border border-accent/40 bg-accent-soft/50 p-6">
            <h3 className="text-lg font-semibold">What has been tested</h3>
            <p className="mt-3 text-pretty">
              Ubuntu 25.10 with PostgreSQL 17 is the platform verified end to end on a real server:
              install, login, upgrade, rollback, backup, restore and uninstall. Ubuntu 22.04 and
              24.04 LTS with PostgreSQL 16 are the documented targets but have not been
              independently re-verified. Other distributions are untested.
            </p>
            <p className="mt-3 text-sm text-ink-muted">
              You install PostgreSQL, Redis and nginx yourself, and the installer checks for them
              but never installs them. They are your infrastructure, with your own backups and
              patching.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="muted" id="prerequisites" labelledBy="prerequisites-title">
        <SectionHeading
          id="prerequisites-title"
          eyebrow="Step 1"
          title="Install the prerequisites"
          intro="Run these in order. A fresh Ubuntu image has none of them, not even git or curl. If you skip one, the installer lists everything missing in a single pass."
        />
        <div className="mt-8 max-w-4xl">
          <Code label="Prerequisite commands">{prerequisites}</Code>
        </div>
      </Section>

      <Section id="install" labelledBy="install-step-title">
        <SectionHeading
          id="install-step-title"
          eyebrow="Step 2"
          title="Run the installer"
          intro="Clone the source and run the installer from inside it. Leave out --server-name for an IP-only install."
        />
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <Code label="Installer commands">{installer}</Code>
            <p className="text-pretty text-ink-muted">
              It generates your secrets (database passwords, signing keys, encryption keys), builds
              the application into a versioned release, runs migrations, starts the service and
              configures nginx. When it finishes it prints a random initial admin password.{' '}
              <strong className="text-ink">That password is shown once. Copy it now.</strong>
            </p>
          </div>
          <ol className="space-y-3 text-pretty text-ink-muted">
            {[
              'Creates the openestate system user and the standard directories.',
              'Writes /etc/openestate/openestate.env with random secrets. An existing file is left alone.',
              'Creates the database and the two Postgres roles the app uses.',
              'Builds a new release under /opt/openestate/releases and links it as current.',
              'Runs migrations and seeds the Indian tax defaults, standard roles and sample charge types.',
              'Installs and starts the openestate-api service and the nginx site.',
            ].map((t, i) => (
              <li key={t} className="flex gap-3 border-b border-line pb-3 last:border-0">
                <span aria-hidden className="font-mono text-sm text-product">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {t}
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="muted" id="first-login" labelledBy="first-login-title">
        <SectionHeading
          id="first-login-title"
          eyebrow="Step 3"
          title="First login and setup"
          intro="Open your server name or IP in a browser and sign in as admin@demo-realty.com with the printed password."
        />
        <ol className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            ['Change the password', 'You are forced to, immediately. It is not optional.'],
            [
              'Turn on two-factor authentication',
              'Profile, Security, Enable 2FA. Scan the QR code with an authenticator app and keep the recovery codes in a password manager.',
            ],
            [
              'Enter your company details',
              'Legal name, GSTIN, GST state code, RERA details, logo and brand colour. A missing GST state code stops bookings, so set it first.',
            ],
            [
              'Review the seeded masters',
              'Check GST rates and TDS thresholds against current law before your first real transaction. They do not update themselves.',
            ],
            [
              'Create roles and users',
              'Add your sales managers, executives and accounts team, using the seeded roles or your own.',
            ],
            [
              'Do a dry run',
              'Create a project, book a test unit, record a receipt and download the PDF before inviting any customer. Then delete the test data.',
            ],
          ].map(([t, b], i) => (
            <li key={t} className="rounded-card border border-line bg-surface p-5">
              <span aria-hidden className="font-mono text-sm text-product">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-1 font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-pretty text-ink-muted">{b}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="https" labelledBy="https-title">
        <SectionHeading
          id="https-title"
          eyebrow="Step 4"
          title="Add HTTPS and a firewall"
          intro="The installer does not set up TLS. For a real deployment, point your domain at the server, then add a certificate and close everything except SSH, HTTP and HTTPS."
        />
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h3 className="mb-3 font-semibold">Certificate with certbot</h3>
            <Code label="HTTPS commands">{tls}</Code>
          </div>
          <div>
            <h3 className="mb-3 font-semibold">Firewall</h3>
            <Code label="Firewall commands">{firewall}</Code>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-pretty text-ink-muted">
          From v0.8.4 the API listens on 127.0.0.1:3000, so only nginx on the same machine can reach
          it. If your reverse proxy runs on another machine, set API_HOST in the environment file
          and firewall port 3000 so only that proxy can connect.
        </p>
      </Section>

      <Section tone="muted" id="operate" labelledBy="operate-title">
        <SectionHeading
          id="operate-title"
          eyebrow="Running it"
          title="Upgrade, back up and recover"
        />
        <div className="mt-10 space-y-10">
          {operate.map((o) => (
            <div
              key={o.id}
              id={o.id}
              className="grid grid-cols-1 gap-6 border-t border-line pt-8 lg:grid-cols-2 lg:gap-16"
            >
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{o.title}</h3>
                <div className="mt-3 space-y-3 text-pretty text-ink-muted">
                  {o.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
              <div className="self-start">
                <Code label={o.label}>{o.code}</Code>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-card border border-line bg-surface p-5">
          <h3 className="font-semibold">Everyday commands</h3>
          <div className="mt-3">
            <Code label="Service commands">{`systemctl status openestate-api       # is it running?
systemctl restart openestate-api      # after a config change
journalctl -u openestate-api -f       # follow the logs live`}</Code>
          </div>
        </div>
      </Section>

      <Section id="troubleshooting" labelledBy="troubleshooting-title">
        <SectionHeading
          id="troubleshooting-title"
          eyebrow="Troubleshooting"
          title="When something does not work"
        />
        <dl className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {troubleshooting.map(([symptom, fix]) => (
            <div key={symptom} className="rounded-card border border-line bg-surface p-5">
              <dt className="font-semibold">{symptom}</dt>
              <dd className="mt-2 text-sm text-pretty text-ink-muted">{fix}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section tone="muted" id="help" labelledBy="help-title">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <SectionHeading
              id="help-title"
              eyebrow="Get help"
              title="Need a hand installing it?"
              intro="Describe your server and what you are trying to do. We reply with next steps."
            />
            <ul className="mt-6 space-y-2 text-sm">
              {links.install && (
                <li>
                  <TextLink href={links.installSource ?? links.install}>
                    Full guide on GitHub
                  </TextLink>
                </li>
              )}
              {links.newIssue && (
                <li>
                  <TextLink href={links.newIssue}>Ask in the public issue tracker</TextLink>
                </li>
              )}
              {links.changelog && (
                <li>
                  <TextLink href={links.changelog}>Release notes and changelog</TextLink>
                </li>
              )}
              {links.securityReport && (
                <li>
                  <TextLink href={links.securityReport}>Report a vulnerability privately</TextLink>
                </li>
              )}
            </ul>
            <p className="mt-6 text-sm text-ink-muted">
              Checked against the OpenEstate repository on {reviewed}. The repository is the source
              of truth if this page has fallen behind.
            </p>
            <div className="mt-6">
              <ButtonLink href="/products/openestate" variant="secondary">
                Back to OpenEstate
              </ButtonLink>
            </div>
          </div>
          <div className="studio-wrap">
            <ProjectBrief source="Install page" />
          </div>
        </div>
      </Section>
    </ProductAccent>
  );
}
