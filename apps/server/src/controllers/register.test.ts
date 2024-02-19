import { IRegisterBody } from "@pro-manage/common-interfaces"
import { createRequest, createResponse } from "node-mocks-http"
import { registerController } from "./register"
import { userService } from "../services/user"
import { Ierror } from "../utilities/requestHandlers/errorHandler"
import { IUser, User } from "../models/user"
import { verifyAccessToken } from "../utilities/tokens/accessToken"
import { verifyRefreshTOken } from "../utilities/tokens/refreshToken"

const mockedGetUserByEmail = jest.spyOn(userService, "getUserByEmail")
const mockedCreateUser = jest.spyOn(userService, "createUser")

describe("register controller", () => {
    const mockedReq = createRequest({ body: { email: "test@domain.com", name: "test1", password: "Example@1" } as IRegisterBody })
    const userObj: IUser = { email: "test@domain.com", name: "test1", password: "Example@1" }

    test("should call next with 400 response when email is already registered", async () => {
        const mockedRes = createResponse();
        const next = jest.fn();

        const errorObj: Ierror = { statusCode: 400, message: "email is already registered" }


        const userDoc = new User(userObj);

        // mock service
        mockedGetUserByEmail.mockResolvedValue(userDoc)

        // run controller function
        await registerController(mockedReq, mockedRes, next)


        // assert
        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)

    })


    test("should send response of 201 along with access and refresh token when request is valid", async () => {
        const mockedRes = createResponse();
        const next = jest.fn()

        const userDoc = new User(userObj)

        // mock getUserByEmail service
        mockedGetUserByEmail.mockResolvedValue(null)

        // mock createUser service
        mockedCreateUser.mockResolvedValue(userDoc)

        await registerController(mockedReq, mockedRes, next)

        // assert response status
        expect(mockedRes._getStatusCode()).toBe(201)


        // extract cookies set in response
        const { accessToken, refreshToken } = mockedRes.cookies

        // assert auth cookies
        expect(accessToken).toBeDefined()
        expect(refreshToken).toBeDefined()


        // verify auth cookies
        const accessPayload = await verifyAccessToken(accessToken.value)
        const refreshPayload = await verifyRefreshTOken(refreshToken.value)


        // assert auth cookies
        expect(accessPayload.payload.email).toBe(userObj.email)
        expect(refreshPayload.payload.email).toBe(userObj.email)
    })
})