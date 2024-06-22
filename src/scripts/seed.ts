import { createHash } from '$lib/server/createHash';
import { prisma } from '$lib/server/prisma';
import { faker } from '@faker-js/faker';


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

	for(let i = 0; i < 100; i++) {
		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName()
		await prisma.user.create({
			data: {
				email: `${firstName}.${lastName}@fake.dev`,
				firstName,
				lastName,
				hash: adminPassword.hash,
				salt: adminPassword.salt,
			}
		})
	}

	console.info('Seed finished');
};

await main();
