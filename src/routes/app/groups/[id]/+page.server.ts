import { actionHelper } from '$lib/server/actionHelper.js';
import { prisma } from '$lib/server/prisma.js';
import { verifyUser } from '$lib/server/verifyUser.js';
import { fail, redirect, type Cookies } from '@sveltejs/kit';
import { z } from 'zod';
import type { RouteParams } from './$types.js';

const validatePermissions = async (cookies: Cookies, params: RouteParams) => {
	const user = await verifyUser(cookies.get('session'));
	if (!user) {
		throw redirect(303, '/auth');
	}

	if (!params.id) {
		throw fail(400, {
			message: 'No group id'
		});
	}

	const editingGroup = await prisma.permissionGroup.findFirst({
		where: {
			id: parseInt(params.id)
		}
	});

	if (!editingGroup) {
		throw fail(400, {
			message: 'No editing group'
		});
	}

	if (!user.permissionGroup) {
		throw fail(400, {
			message: 'No permissions'
		});
	}

	if (!user.permissionGroup?.admin && !user.permissionGroup?.manageGroups) {
		throw fail(400, {
			message: 'No permissions'
		});
	}

	return {
		editingGroup,
		user
	};
};

export const load = async ({ parent, params }) => {
	const parentData = await parent();
	if (!parentData.user.permissionGroup?.admin && !parentData.user.permissionGroup?.manageGroups) {
		return redirect(303, '/app');
	}

	const groupInfo = await prisma.permissionGroup.findUnique({
		where: {
			id: parseInt(params.id)
		}
	});

	if (!groupInfo) {
		throw redirect(303, '/app/groups');
	}

	return {
		groupInfo
	};
};

export const actions = {
	editName: actionHelper(
		z.object({
			name: z.string()
		}),
		async ({ name }, { cookies, params }) => {
			const { editingGroup, user } = await validatePermissions(cookies, params as RouteParams);

			// TODO: Remove when ts updates
			if (!user.permissionGroup) {
				throw fail(400, {
					message: 'No perms'
				});
			}

			if (editingGroup.priority < user.permissionGroup?.priority) {
				return fail(400, {
					message: 'Group not high enough'
				});
			}

			await prisma.permissionGroup.update({
				where: {
					id: editingGroup.id
				},
				data: {
					name: name
				}
			});

			return {
				success: true,
				message: 'Group updated'
			};
		}
	),
	deleteGroup: async ({ cookies, params }) => {
		const { editingGroup, user } = await validatePermissions(cookies, params);

		if (!user.permissionGroup?.priority) {
			return fail(400, {
				message: 'No permissions'
			});
		}

		if (!(editingGroup.priority > user.permissionGroup?.priority)) {
			return fail(400, {
				message: 'Group not high enough'
			});
		}

		await prisma.permissionGroup.delete({
			where: {
				id: editingGroup.id
			}
		});

		throw redirect(303, '/app/groups?toastTinker=true');
	},
	updatePermissions: actionHelper(
		z.object({
			admin: z.coerce.boolean(),
			manageMembers: z.coerce.boolean(),
			manageGroups: z.coerce.boolean(),
			manageCertifications: z.coerce.boolean()
		}),
		async ({ admin, manageMembers, manageGroups, manageCertifications }, { cookies, params }) => {
			const { editingGroup, user } = await validatePermissions(cookies, params as RouteParams);

			// TODO: Remove when ts updates
			if (!user.permissionGroup) {
				throw fail(400, {
					message: 'No perms'
				});
			}

			if (!(editingGroup.priority > user.permissionGroup?.priority)) {
				return fail(400, {
					message: 'Group not high enough'
				});
			}

			await prisma.permissionGroup.update({
				where: {
					id: editingGroup.id
				},
				data: {
					admin,
					manageMembers,
					manageCertifications,
					manageGroups
				}
			});

			return {
				success: true,
				message: 'Group updated'
			};
		}
	)
};
