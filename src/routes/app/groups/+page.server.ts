import { actionHelper } from '$lib/server/actionHelper.js';
import { prisma } from '$lib/server/prisma.js';
import { verifyUser } from '$lib/server/verifyUser.js';
import { fail, redirect } from '@sveltejs/kit';
import z from "zod"
export const load = async ({parent}) => {
	
	const parentData = await parent();
	if(!parentData.user.permissionGroup?.admin && !parentData.user.permissionGroup?.manageGroups) {
		return redirect(303, "/app")
	}

	const groups = await prisma.permissionGroup.findMany({
		orderBy: {
			priority: "asc"
		}
	})
	return {
		groups
	}


}

export const actions = {
	createGroup: actionHelper(z.object({
		name: z.string()
	}), async({name}, {cookies}) => {
		const user = await verifyUser(cookies.get("session"))
		if(!user) {
			throw redirect(303, "/auth")
		}

		if(!user.permissionGroup?.admin && !user.permissionGroup?.manageGroups) {
			return fail(400, {
				message: "No permissions"
			})
		}

		const group = await prisma.permissionGroup.findFirst({
			orderBy: {
				priority: "asc"
			}
		})

		const largestPriority = group?.priority || 0

		await prisma.permissionGroup.create({
			data: {
				name,
				color: "000000",
				priority: largestPriority + 1,
				admin: false,
				manageCertifications: false,
				manageGroups: false,
				manageMembers: false
			}
		})

		return {
			success: true,
			message: "Group Created"
		}
	})
}