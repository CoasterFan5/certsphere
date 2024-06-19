import { actionHelper } from '$lib/server/actionHelper.js';
import { createHash } from '$lib/server/createHash.js';
import { prisma } from '$lib/server/prisma.js';
import { createSession } from '$lib/server/sessionHelper.js';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';

export const actions = {
	login: actionHelper(
		z.object({
			email: z.string(),
			password: z.string()
		}),
		async ({ email, password }, { cookies }) => {
			const formattedEmail = email.toLowerCase();
			const user = await prisma.user.findUnique({
				where: {
					email: formattedEmail
				}
			});

			if (!user) {
				return fail(400, {
					message: 'Invalid email or password'
				});
			}

			const { hash } = await createHash(password, user?.salt);

			if (hash != user.hash) {
				return fail(400, {
					message: 'Invalid email or password'
				});
			}

			const session = await createSession(user.id);

			cookies.set('session', session.token, {
				secure: true,
				sameSite: 'strict',
				path: '/'
			});

			throw redirect(303, '/app');
		}
	)
};
