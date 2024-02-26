import { IRegisterBody } from "@pro-manage/common-interfaces"
import { createRequest, createResponse } from "node-mocks-http"
import { registerController } from "./register"
import { userService } from "../../services/user"
import { Ierror } from "../../utilities/requestHandlers/errorHandler"
import { IUser, User } from "../../models/user"
import { verifyAccessToken } from "../../utilities/tokens/accessToken"
import { verifyRefreshToken } from "../../utilities/tokens/refreshToken"

const mockedGetUserByEmail = jest.spyOn(userService, "getUserByEmail")
const mockedCreateUser = jest.spyOn(userService, "createUser")

describe("register controller", () => {
    const mockedReq = createRequest({ body: { email: "test@domain.com", name: "test1", password: "Example@1" } as IRegisterBody })
    const userObj: IUser = { email: "test@domain.com", name: "test1", password: "Example@1" }

    test("should call next with 409 response when email is already registered", async () => {
        const mockedRes = createResponse();
        const next = jest.fn();

        const errorObj: Ierror = { statusCode: 409, message: "email is already registered" }


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
        const accessResult = await verifyAccessToken(accessToken.value)
        const refreshResult = await verifyRefreshToken(refreshToken.value)


        // assert auth cookies
        expect(accessResult.valid).toBe(true)
        expect(refreshResult.valid).toBe(true)

        if (accessResult.valid) expect(accessResult.payload.email).toBe(userObj.email)
        if (refreshResult.valid) expect(refreshResult.payload.email).toBe(userObj.email)
    })
})