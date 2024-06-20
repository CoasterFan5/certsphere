import { createHash } from '$lib/server/createHash';
import { prisma } from '$lib/server/prisma';

const main = async () => {
	console.info('Seeding started');

	await prisma.permissionGroup.upsert({
		where: {
			id: 1
		},
		update: {},
		create: {
			name: 'Admin Group',
			color: 'ff0000',
			priority: 1,
			admin: true,
			manageGroups: true,
			manageCertifications: true,
			manageMembers: true
		}
	});

	const adminPassword = await createHash('password');
	await prisma.user.upsert({
		where: {
			email: 'admin@fake.dev'
		},
		update: {},
		create: {
			email: 'admin@fake.dev',
			firstName: 'brick',
			lastName: 'man',
			hash: adminPassword.hash,
			salt: adminPassword.salt,
			permissionGroupId: 1
		}
	});

	console.info('Seed finished');
};

await main();
