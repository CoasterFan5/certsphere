import { prisma } from '$lib/server/prisma';
import type { Prisma } from '@prisma/client';

export const load = async ({ url }) => {
	const sortingModeMap = ['ascending', 'descending'] as const;
	type SortingMode = (typeof sortingModeMap)[number];

	const sortables: Record<string, Record<SortingMode, Prisma.userOrderByWithRelationInput>> = {
		email: {
			ascending: {
				email: 'asc'
			},
			descending: {
				email: 'desc'
			}
		},
		firstName: {
			ascending: {
				firstName: 'asc'
			},
			descending: {
				firstName: 'desc'
			}
		},
		lastName: {
			ascending: {
				lastName: 'asc'
			},
			descending: {
				lastName: 'desc'
			}
		},
		group: {
			ascending: {
				permissionGroup: {
					name: 'asc'
				}
			},
			descending: {
				permissionGroup: {
					name: 'desc'
				}
			}
		}
	};

	let customOrderBy: Prisma.userOrderByWithRelationInput | undefined = undefined;

	const orderByString = url.searchParams.get('orderBy');
	const sortModeString = url.searchParams.get('sortingMode') as SortingMode;

	if (orderByString && sortables[orderByString]) {
		if (
			sortModeString &&
			sortingModeMap.includes(sortModeString) &&
			sortables[orderByString][sortModeString]
		) {
			customOrderBy = (
				sortables[orderByString] as { [key: string]: Prisma.userOrderByWithRelationInput }
			)[sortModeString];
		}
	}

	console.log(customOrderBy);

	const users = await prisma.user.findMany({
		select: {
			firstName: true,
			lastName: true,
			email: true,
			permissionGroup: {
				select: {
					name: true
				}
			}
		},
		orderBy: { ...customOrderBy }
	});

	return {
		users
	};
};
