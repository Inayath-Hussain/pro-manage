import { User } from "../models/user"

class UserService {

    async getUserByEmail(email: string) {
        if (!email) throw Error("email is required in getUserByEmail")
        return await User.findOne({ email })
    }

}


export const userService = new UserService()