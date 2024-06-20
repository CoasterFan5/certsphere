import { prisma } from '$lib/server/prisma.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
	if (!cookies.get('session')) {
		return redirect(303, '/auth');
	}

	const sessionCheck = await prisma.session.findUnique({
		where: {
			token: cookies.get('session')
		},
		select: {
			user: {
				select: {
					firstName: true,
					lastName: true,
					email: true,
					permissionGroup: true
				}
			}
		}
	});

	if (!sessionCheck?.user) {
		return redirect(303, '/auth');
	}

	return {
		user: sessionCheck.user
	};
};
