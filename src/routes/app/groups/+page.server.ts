import { prisma } from '$lib/server/prisma.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({parent}) => {
	
	const parentData = await parent();
	if(!parentData.user.permissionGroup?.admin && !parentData.user.permissionGroup?.manageGroups) {
		return redirect(303, "/app")
	}

	const groups = await prisma.permissionGroup.findMany({
		orderBy: {
			priority: "desc"
		}
	})
	return {
		groups
	}


}