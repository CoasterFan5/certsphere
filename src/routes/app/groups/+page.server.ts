import { actionHelper } from '$lib/server/actionHelper.js';
import { prisma } from '$lib/server/prisma.js';
import { verifyUser } from '$lib/server/verifyUser.js';
import { fail, redirect } from '@sveltejs/kit';
import z from 'zod';
export const load = async ({ parent }) => {
	const parentData = await parent();
	if (!parentData.user.permissionGroup?.admin && !parentData.user.permissionGroup?.manageGroups) {
		return redirect(303, '/app');
	}

	const groups = await prisma.permissionGroup.findMany({
		orderBy: {
			priority: 'asc'
		}
	});
	return {
		groups
	};
};

export const actions = {
	createGroup: actionHelper(
		z.object({
			name: z.string()
		}),
		async ({ name }, { cookies }) => {
			const user = await verifyUser(cookies.get('session'));
			if (!user) {
				throw redirect(303, '/auth');
			}

			if (!user.permissionGroup?.admin && !user.permissionGroup?.manageGroups) {
				return fail(400, {
					message: 'No permissions'
				});
			}

			const group = await prisma.permissionGroup.findFirst({
				orderBy: {
					priority: 'desc'
				}
			});

			const largestPriority = group?.priority || 0;

			await prisma.permissionGroup.create({
				data: {
					name,
					color: '000000',
					priority: largestPriority + 1,
					admin: false,
					manageCertifications: false,
					manageGroups: false,
					manageMembers: false
				}
			});

			return {
				success: true,
				message: 'Group Created'
			};
		}
	),
	changePosition: actionHelper(
		z.object({
			itemId: z.coerce.number(),
			newItemIndex: z.coerce.number()
		}),
		async ({ itemId, newItemIndex }, { cookies }) => {
			const user = await verifyUser(cookies.get('session'));
			if (!user) {
				throw redirect(303, '/auth');
			}

			console.log(itemId, newItemIndex);

			if (!user.permissionGroup?.admin && !user.permissionGroup?.manageGroups) {
				return fail(400, {
					message: 'No permissions'
				});
			}

			const movingGroup = await prisma.permissionGroup.findFirst({
				where: {
					id: itemId
				}
			});

			if (!movingGroup) {
				return fail(400, {
					message: 'Failed db lookup for group'
				});
			}

			if (newItemIndex + 1 == 1) {
				return fail(400, {
					message: 'Group 0 is reserved for admin group'
				});
			}

			await prisma.permissionGroup.updateMany({
				where: {
					priority: {
						gt: newItemIndex
					}
				},
				data: {
					priority: {
						increment: 1
					}
				}
			});

			await prisma.permissionGroup.update({
				where: {
					id: movingGroup.id
				},
				data: {
					priority: newItemIndex + 1
				}
			});

			return {
				success: true,
				message: 'Order Updated'
			};
		}
	)
};
