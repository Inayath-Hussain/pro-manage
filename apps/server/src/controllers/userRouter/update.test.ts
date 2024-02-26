import bcrypt from "bcrypt"
import { createRequest, createResponse } from "node-mocks-http"
import { userService } from "../../services/user"
import { userUpdateController } from "./update"
import { Ierror } from "../../utilities/requestHandlers/errorHandler"
import { IUpdateBody } from "@pro-manage/common-interfaces"
import { User } from "../../models/user"


const mockedGetUserByEmail = jest.spyOn(userService, "getUserByEmail")

describe("update controller", () => {
    test("should call next with 401 response when email doesn't exist in db", async () => {
        const email = "test1@domain.com"
        const req = createRequest({ body: { name: "test1" } })
        req.email = email
        const res = createResponse()
        const next = jest.fn();

        const errorObj: Ierror = { statusCode: 401, message: "Email doesn't exist" }

        mockedGetUserByEmail.mockResolvedValue(null)

        await userUpdateController(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)

    })

    test("should call next with 400 response if oldPassword doesn't match", async () => {
        const email = "test1@domain.com"
        const req = createRequest({ body: { name: "test1", oldPassword: "Heelo" } as IUpdateBody })
        req.email = email
        const res = createResponse()
        const next = jest.fn();

        const errorObj: Ierror = { statusCode: 400, message: "Incorrect password" }

        mockedGetUserByEmail.mockResolvedValue(new User({ email, name: "test1" }))
        const mockedCompare = jest.fn().mockResolvedValue(false);

        (bcrypt.compare as jest.Mock) = mockedCompare

        await userUpdateController(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)

    })

})