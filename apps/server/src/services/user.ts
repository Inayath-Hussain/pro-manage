import { Document } from "mongoose";
import { genSalt, hash } from "bcrypt";
import { IUser, User } from "../models/user";

type IUserDocument = IUser & Document

class UserService {

    /**
     * find user document by email
     */
    async getUserByEmail(email: string) {
        if (!email) throw Error("email is required in getUserByEmail")
        return await User.findOne({ email })
    }

    /**
     * creates new user and returns document
     */
    async createUser(userDetails: IUser) {
        const user = new User(userDetails)

        return await user.save()
    }

    /**
     * update's user name and/or password
     * @param userDoc user document
     */
    async updateUser(userDoc: IUserDocument, name?: IUser["name"], newPassword?: IUser["password"]) {
        if (name) userDoc.name = name
        if (newPassword) {
            const salt = await genSalt(10);
            const hashedPassword = await hash(newPassword, salt)

            userDoc.password = hashedPassword
        }

        return await userDoc.save();
    }
}


export const userService = new UserService()