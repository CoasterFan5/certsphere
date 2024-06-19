import crypto from "crypto"
import {promisify} from "util"

const asyncPassword = promisify(crypto.pbkdf2)

export const createHash = async (password: string, salt?: string) => {

	if(!salt) {
		salt = crypto.randomBytes(32).toString("hex")
	}

	const hash = (await asyncPassword(password, salt, 1000, 128, "sha512")).toString("hex")

	return {
		hash, salt
	};

}

