import { actionHelper } from "$lib/server/actionHelper.js";
import { prisma } from "$lib/server/prisma.js";
import { verifyUser } from "$lib/server/verifyUser.js";
import { fail, redirect } from "@sveltejs/kit";
import { z } from "zod";


export const load = async ({parent, params}) => {
	const parentData = await parent();
	if(!parentData.user.permissionGroup?.admin && !parentData.user.permissionGroup?.manageGroups) {
		return redirect(303, "/app")
	}

	const groupInfo = await prisma.permissionGroup.findUnique({
		where: {
			id: parseInt(params.id)
		}
	})

	if(!groupInfo) {
		throw redirect(303, "/app/groups")
	}

	return {
		groupInfo
	}

}

export const actions = {
	editName: actionHelper(z.object({
		name: z.string()
	}), async ({name}, {cookies, params}) => {

		const user = await verifyUser(cookies.get("session"))
		if(!user) {
			throw redirect(303, "/login")
		}

		if(!params.id) {
			return fail(400, {
				message: "No group id"
			})
		}


		const editingGroup = await prisma.permissionGroup.findFirst({
			where: {
				id: parseInt(params.id)
			}
		})

		if(!editingGroup) {
			return fail(400, {
				message: "No editing group"
			})
		}

		if(!user.permissionGroup?.admin && !user.permissionGroup?.manageGroups) {
			return fail(400, {
				message: "No permissions"
			})
		}

		if(editingGroup.priority < user.permissionGroup?.priority) {
			return fail(400, {
				message: "Group not high enough"
			})
		}

		await prisma.permissionGroup.update({
			where: {
				id: editingGroup.id
			},
			data: {
				name: name
			}
		})

		return {
			success: true,
			message: "Group updated"
		}

	})
}