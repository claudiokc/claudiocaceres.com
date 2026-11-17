import { afterEach, describe, expect, it, vi } from 'vitest';
import { notifyNewMessage, telegramText } from './notify';
import type { Env } from './http';

const message = {
  id: '8205042379582-c5b73fee',
  receivedAt: '2026-11-17T23:20:20.417Z',
  name: 'Ana',
  email: 'ana@example.com',
  message: 'Hello *there* <b>',
};
const env: Env = { TELEGRAM_BOT_TOKEN: 'test-token', TELEGRAM_CHAT_ID: '42' };

afterEach(() => vi.unstubAllGlobals());

describe('telegramText', () => {
  it('includes sender, message and inbox link as plain text', () => {
    const text = telegramText(message);
    expect(text).toContain('From: Ana <ana@example.com>');
    expect(text).toContain('Hello *there* <b>');
    expect(text).toContain('https://claudiocaceres.com/admin');
  });

  it('stays within Telegram’s 4096-character limit', () => {
    expect(telegramText({ ...message, message: 'x'.repeat(5000) }).length).toBeLessThanOrEqual(4096);
  });
});

describe('notifyNewMessage', () => {
  it('posts to Telegram when both secrets are set', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    await notifyNewMessage(env, message);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.telegram.org/bottest-token/sendMessage');
    expect(JSON.parse(init.body)).toMatchObject({ chat_id: '42' });
    expect(JSON.parse(init.body)).not.toHaveProperty('parse_mode');
  });

  it('does nothing without secrets', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await notifyNewMessage({}, message);
    await notifyNewMessage({ TELEGRAM_BOT_TOKEN: 'only-token' }, message);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('never throws when Telegram fails, and does not log the token', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 401 })));
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await expect(notifyNewMessage(env, message)).resolves.toBeUndefined();
    expect(log.mock.calls.flat().join(' ')).not.toContain('test-token');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
    await expect(notifyNewMessage(env, message)).resolves.toBeUndefined();
    log.mockRestore();
  });
});
