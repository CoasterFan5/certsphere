import { prisma } from "./prisma"

export const verifyUser = async (session: string | undefined) => {

    if(!session) {
        return false
    }

    const sessionCheck = await prisma.session.findFirst({
        where: {
            token: session
        },
        select: {
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    permissionGroup: true
                }
            }
        }
    })

    if(!sessionCheck?.user) {
        return false
    }

    return sessionCheck.user

}