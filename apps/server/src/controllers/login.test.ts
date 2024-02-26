import { genSalt, hash } from "bcrypt"
import { createRequest, createResponse } from "node-mocks-http"
import { loginController } from "./login"
import { userService } from "../services/user"
import { IUser, User } from "../models/user"
import { Ierror } from "../utilities/requestHandlers/errorHandler"
import { verifyAccessToken } from "../utilities/tokens/accessToken"
import { verifyRefreshToken } from "../utilities/tokens/refreshToken"


const mockedGetUserByEmail = jest.spyOn(userService, "getUserByEmail")

describe("login controller", () => {
    test("should call next with 400 response when email isn't registered.", async () => {
        const mockedReq = createRequest({ body: { email: "test@domain.com", password: "Example@1" } })
        const mockedRes = createResponse()
        const next = jest.fn();

        const errorObj: Ierror = { statusCode: 400, message: "email isn't registered" }

        mockedGetUserByEmail.mockResolvedValue(null)

        await loginController(mockedReq, mockedRes, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)

    })


    test("should call next with 400 response when password doesn't match", async () => {
        const mockedReq = createRequest({ body: { email: "test@domain.com", password: "Example@1" } })
        const mockedRes = createResponse()
        const next = jest.fn();

        // expected result
        const errorObj: Ierror = { statusCode: 400, message: "email and password donot match" }

        // user details
        const userObj: IUser = { email: "test@domain.com", name: "test1", password: "Example@1" }

        // mongodb doc of user
        const userDoc = new User(userObj)

        // mocking service
        mockedGetUserByEmail.mockResolvedValue(userDoc)

        // calling the controller
        await loginController(mockedReq, mockedRes, next)

        // assertions
        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)

    })


    test("should send access and refresh tokens with 200 status when email and password are valid", async () => {
        const mockedReq = createRequest({ body: { email: "test@domain.com", password: "Example@1" } })
        const mockedRes = createResponse()
        const next = jest.fn();


        // user details
        const userObj: IUser = { email: "test@domain.com", name: "test1", password: "Example@1" }

        // hash password
        const salt = await genSalt(10);
        const hashedPassword = await hash(userObj.password, salt)

        // replace plain password with hashed one
        userObj.password = hashedPassword

        // mongodb doc of user
        const userDoc = new User(userObj)

        // mocking service
        mockedGetUserByEmail.mockResolvedValue(userDoc)

        // calling controller
        await loginController(mockedReq, mockedRes, next)

        // extract cookies set in response
        const { accessToken, refreshToken } = mockedRes.cookies

        // verify auth cookies
        const accessResult = await verifyAccessToken(accessToken.value)
        const refreshResult = await verifyRefreshToken(refreshToken.value)

        // assert auth cookies
        expect(accessResult.valid).toBe(true)
        expect(refreshResult.valid).toBe(true)

        if (accessResult.valid) expect(accessResult.payload.email).toBe(userObj.email)
        if (refreshResult.valid) expect(refreshResult.payload.email).toBe(userObj.email)

    })

})