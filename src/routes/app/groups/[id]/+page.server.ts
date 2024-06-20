import { prisma } from "$lib/server/prisma.js";
import { redirect } from "@sveltejs/kit";


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