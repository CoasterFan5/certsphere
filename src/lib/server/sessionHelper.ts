import { prisma } from './prisma';
import crypto from 'crypto';
export const createSession = async (userId: number) => {
	const newSession = await prisma.session.create({
		data: {
			userId: userId,
			token: crypto.randomBytes(32).toString('hex')
		}
	});

	return newSession;
};
