import { createHash } from "$lib/server/createHash"
import {prisma} from "$lib/server/prisma"



const main = async () => {
	console.info("Seeding started")
	const adminPassword = await createHash("password")
	await prisma.user.upsert({
		where: {
			email: "admin@fake.dev",
		},
		update: {},
		create: {
			email: "admin@fake.dev",
			firstName: "brick",
			lastName: "man",
			hash: adminPassword.hash,
			salt: adminPassword.salt
		}
	})
	console.info("Seed finished")
}

await main()