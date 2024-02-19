import { IUser, User } from "../models/user"

class UserService {

    async getUserByEmail(email: string) {
        if (!email) throw Error("email is required in getUserByEmail")
        return await User.findOne({ email })
    }

    async createUser(userDetails: IUser) {
        const user = new User(userDetails)

        return await user.save()
    }
}


export const userService = new UserService()