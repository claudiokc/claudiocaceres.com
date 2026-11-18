// Alerts for new contact messages. Each channel is on only when its secrets are set,
// so adding a channel later (ntfy, Discord, ...) is one more entry in `channels`.
// Alerts never block or fail the visitor's request: the message is already saved.

import type { StoredMessage } from '../src/lib/contact';
import type { Env } from './http';

const SITE = 'https://claudiocaceres.com';
const TELEGRAM_MAX = 4096;

interface Channel {
  name: string;
  enabled(env: Env): boolean;
  send(env: Env, message: StoredMessage): Promise<void>;
}

/** Plain text (no Markdown/HTML parse mode), so visitor text can't inject formatting or links. */
export function telegramText(message: StoredMessage): string {
  const header = `New message on claudiocaceres.com\nFrom: ${message.name} <${message.email}>\n\n`;
  const footer = `\n\nInbox: ${SITE}/admin`;
  const room = TELEGRAM_MAX - header.length - footer.length;
  const body = message.message.length > room ? `${message.message.slice(0, room - 1)}…` : message.message;
  return header + body + footer;
}

const telegram: Channel = {
  name: 'telegram',
  enabled: (env) => Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID),
  async send(env, message) {
    const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: telegramText(message),
        link_preview_options: { is_disabled: true },
      }),
      signal: AbortSignal.timeout(10_000),
    });
    // Log the status only: the URL contains the bot token.
    if (!response.ok) throw new Error(`Telegram responded ${response.status}`);
  },
};

const channels: Channel[] = [telegram];

export async function notifyNewMessage(env: Env, message: StoredMessage): Promise<void> {
  await Promise.all(
    channels
      .filter((channel) => channel.enabled(env))
      .map((channel) =>
        channel.send(env, message).catch((error: unknown) => {
          console.error(`Contact alert via ${channel.name} failed: ${(error as Error).message}`);
        }),
      ),
  );
}
