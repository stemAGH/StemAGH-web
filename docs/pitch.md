# Pitch page for cold emails

`/hello` is a short introduction page for outreach. It is not linked from the site, not in the
sitemap and marked `noindex`.

## Personalise the link

```
https://www.stemagh.com/hello?name=Ravi&company=Acme%20Realty
```

- `name`: first name for the greeting ("Hi Ravi,"). Optional, up to 40 characters.
- `company`: shown in the heading and pre-filled in the form. Optional, up to 60 characters.
- Encode spaces as `%20` (or `+`). Angle brackets and control characters are stripped.
- With no parameters the page reads "Here's what we could build for your business."

Enquiries sent from this page arrive with a `Source: Pitch page (Company)` line, so replies to
outreach are easy to tell apart from other enquiries.

## Example email

> Subject: An app idea for Acme Realty
>
> Hi Ravi,
>
> We build websites and phone apps for property developers. I put together a two-minute page
> for Acme Realty, including an owner app you can try on your phone:
>
> https://www.stemagh.com/hello?name=Ravi&company=Acme%20Realty
>
> If something there is useful, reply here and we'll set up a short call.
