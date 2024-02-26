import { createRequest, createResponse } from "node-mocks-http"
import { authMiddleware } from "./auth";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";
import { createAccessToken, verifyAccessToken } from "../../utilities/tokens/accessToken";
import { createRefreshToken } from "../../utilities/tokens/refreshToken";

describe("auth middleware", () => {
    test("should call next 401 reponse when auth tokens are missing", async () => {
        const req = createRequest({ signedCookies: {} });
        const res = createResponse();
        const next = jest.fn();

        const errorObj: Ierror = { message: "Authentication tokens required", statusCode: 401 }

        await authMiddleware(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)
    })

    test("should call next with 401 response when only access token is present and is invalid", async () => {
        const req = createRequest({ signedCookies: { accessToken: "Hefnognveruobvnwrmiueronboer" } });
        const res = createResponse();
        const next = jest.fn();

        const errorObj: Ierror = { message: "Invalid authentication tokens", statusCode: 401 }

        await authMiddleware(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)
    })


    test("should call next with no arguments when only access token is present and is valid", async () => {
        const email = "test@domain.com"
        const accessToken = await createAccessToken({ email })

        const req = createRequest({ signedCookies: { accessToken } });
        const res = createResponse();
        const next = jest.fn();


        await authMiddleware(req, res, next)

        expect(req.email).toBe(email)
        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith()
    })


    test("should call next with 401 response when only refresh token is present and is invalid", async () => {
        const req = createRequest({ signedCookies: { refreshToken: "Hefnognveruobvnwrmiueronboer" } });
        const res = createResponse();
        const next = jest.fn();

        const errorObj: Ierror = { message: "Invalid authentication tokens", statusCode: 401 }

        await authMiddleware(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)
    })


    test("should call next with no arguments and response contain auth cookies when only refresh token is present and is valid", async () => {
        const email = "test@domain.com"
        const refreshToken = await createRefreshToken({ email })

        const req = createRequest({ signedCookies: { refreshToken } });
        const res = createResponse();
        const next = jest.fn();

        await authMiddleware(req, res, next)

        expect(req.email).toBe(email)
        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith()

        // assert res cookies
        const { accessToken } = res.cookies

        const result = await verifyAccessToken(accessToken.value)

        expect(result.valid).toBe(true)
        if (result.valid) expect(result.payload.email).toBe(email)
    })


    test("should call next with 401 response when access token is invalid and refresh token is valid", async () => {
        const email = "test@domain.com"
        const refreshToken = await createRefreshToken({ email })

        const req = createRequest({ signedCookies: { refreshToken, accessToken: "soignvoigernvnerov" } });
        const res = createResponse();
        const next = jest.fn();

        const errorObj: Ierror = { message: "Invalid authentication tokens", statusCode: 401 }

        await authMiddleware(req, res, next)



        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)
    })


    test("should call next with 401 response when access token is valid and refresh token is invalid", async () => {
        const email = "test@domain.com"
        const accessToken = await createAccessToken({ email })

        const req = createRequest({ signedCookies: { refreshToken: "soignvoigernvnerov", accessToken } });
        const res = createResponse();
        const next = jest.fn();

        const errorObj: Ierror = { message: "Invalid authentication tokens", statusCode: 401 }

        await authMiddleware(req, res, next)


        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)
    })


    test("should call next with 401 error when both access and refresh tokens are invalid", async () => {
        const req = createRequest({ signedCookies: { refreshToken: "eifbogoroni", accessToken: "soegnroigroin" } });
        const res = createResponse();
        const next = jest.fn();

        const errorObj: Ierror = { message: "Invalid authentication tokens", statusCode: 401 }

        await authMiddleware(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)
    })


    test("should call next with no arguments when access and refresh tokens are present and are valid", async () => {
        const email = "test@domain.com"
        const accessToken = await createAccessToken({ email })
        const refreshToken = await createRefreshToken({ email })

        const req = createRequest({ signedCookies: { refreshToken, accessToken } });
        const res = createResponse();
        const next = jest.fn();

        await authMiddleware(req, res, next)

        expect(req.email).toBe(email)
        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith()
    })
})