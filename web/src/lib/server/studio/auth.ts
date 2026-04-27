import { env } from '$env/dynamic/private';
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Cookies } from '@sveltejs/kit';

const COOKIE_NAME = 'voac_studio';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

function password() {
	return env.ADMIN_PASSWORD ?? '';
}

function sign(value: string) {
	return createHmac('sha256', password()).update(value).digest('hex');
}

function safeEqual(a: string, b: string) {
	const left = Buffer.from(a);
	const right = Buffer.from(b);
	return left.length === right.length && timingSafeEqual(left, right);
}

export function studioAuthConfigured() {
	return password().length >= 12;
}

export function verifyStudioPassword(candidate: string) {
	const configured = password();
	return configured.length >= 12 && safeEqual(candidate, configured);
}

export function createStudioSession(cookies: Cookies) {
	const issuedAt = String(Date.now());
	cookies.set(COOKIE_NAME, `${issuedAt}.${sign(issuedAt)}`, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: true,
		maxAge: MAX_AGE_SECONDS
	});
}

export function clearStudioSession(cookies: Cookies) {
	cookies.delete(COOKIE_NAME, { path: '/' });
}

export function hasStudioSession(cookies: Cookies) {
	if (!studioAuthConfigured()) return false;

	const value = cookies.get(COOKIE_NAME);
	if (!value) return false;

	const [issuedAt, signature] = value.split('.');
	if (!issuedAt || !signature || !safeEqual(signature, sign(issuedAt))) return false;

	const age = Date.now() - Number(issuedAt);
	return Number.isFinite(age) && age >= 0 && age < MAX_AGE_SECONDS * 1000;
}

