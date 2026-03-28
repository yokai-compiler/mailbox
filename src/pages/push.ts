import { type APIRoute } from "astro";
import { RESEND_API_KEY, TOKEN } from "astro:env/server";
import { readdirSync, existsSync, mkdirSync, writeFileSync } from "fs";

import { Resend } from "resend";

export const prerender = false;

const resend = new Resend(RESEND_API_KEY);

if (!existsSync("./emails")) {
  mkdirSync("./emails");
}

export const GET: APIRoute = async function (ctx) {
  const id = ctx.url.searchParams.get("id");
  const to = ctx.url.searchParams.get("to");
  const pass = ctx.url.searchParams.get("pass");

  if (pass !== TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!id) {
    return new Response("No id provided", { status: 400 });
  }

  if (!to) {
    return new Response("No to provided", { status: 400 });
  }

  const email = await resend.emails.receiving.get(id);

  if (!existsSync(`./emails/${to}`)) {
    mkdirSync(`./emails/${to}`);
    mkdirSync(`./emails/${to}/inbox`);
    mkdirSync(`./emails/${to}/outbox`);
  }

  if (email.error) {
    return new Response(email.error.message, { status: 500 });
  }

  if (email.data.text) {
    writeFileSync(
      `./emails/${to}/inbox/${encodeURIComponent(email.data.from)}${encodeURIComponent(email.data.subject)}.txt`,
      email.data.text,
    );
  }

  if (email.data.html) {
    writeFileSync(
      `./emails/${to}/inbox/${encodeURIComponent(email.data.from)}-${encodeURIComponent(email.data.subject)}.html`,
      email.data.html,
    );
  }

  return new Response("THANKS FOR THE MAIL");
};
