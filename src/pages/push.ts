import { type APIRoute } from "astro";
import { db, Email } from "astro:db";
import { RESEND_API_KEY, TOKEN } from "astro:env/server";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";

import { Resend } from "resend";
import { text } from "stream/consumers";

export const prerender = false;

const EMAIL_PATH = join(homedir(), ".email");

const resend = new Resend(RESEND_API_KEY);

if (!existsSync(EMAIL_PATH)) {
  mkdirSync(EMAIL_PATH);
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

  const address_path = join(EMAIL_PATH, to);

  if (!existsSync(address_path)) {
    mkdirSync(address_path);
    mkdirSync(join(address_path, "inbox"));
    mkdirSync(join(address_path, "outbox"));
  }

  if (email.error) {
    return new Response(email.error.message, { status: 500 });
  }

  const entry = {
    id: email.data.id,
    from: email.data.from,
    to,
    timestamp: email.data.created_at,
    read: false,
    html: false,
    text: false,
  };

  if (email.data.text) {
    entry.text = true;
    writeFileSync(
      join(EMAIL_PATH, to, "inbox", `${email.data.id}.txt`),
      email.data.text,
    );
  }

  if (email.data.html) {
    entry.html = true;
    writeFileSync(
      join(EMAIL_PATH, to, "inbox", `${email.data.id}.html`),
      email.data.html,
    );
  }

  db.insert(Email).values(entry);

  return new Response("THANKS FOR THE MAIL");
};
