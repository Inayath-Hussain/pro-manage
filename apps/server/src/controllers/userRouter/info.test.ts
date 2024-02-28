import { createRequest, createResponse } from "node-mocks-http"
import { userService } from "../../services/user";
import { userInfoController } from "./info";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";
import { IUser, User } from "../../models/user";


const mockedGetUserByEmail = jest.spyOn(userService, "getUserByEmail")

describe("userInfo controller", () => {
    test("should call next with 401 response when email doesn't exist in db", async () => {
        const email = "test@domain.com"
        const req = createRequest()
        req.email = email

        const res = createResponse();
        const next = jest.fn();

        const errorObj: Ierror = { statusCode: 401, message: "Email doesn't exist" }

        mockedGetUserByEmail.mockResolvedValue(null)
        await userInfoController(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)
    })


    test("should return 200 response with user's name and email when email exists in db", async () => {
        const userInfo: IUser = { email: "test@domain.com", name: "test", password: "ehgvowiowrg" }
        const req = createRequest()
        req.email = userInfo.email

        const res = createResponse();
        const next = jest.fn();

        const userDoc = new User(userInfo)

        mockedGetUserByEmail.mockResolvedValue(userDoc)
        await userInfoController(req, res, next)

        expect(res._getStatusCode()).toBe(200)
        expect(res._getJSONData()).toEqual({ name: userInfo.name, email: userInfo.email })
    })
})