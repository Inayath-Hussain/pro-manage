import { createRequest, createResponse } from "node-mocks-http"
import { logoutController } from "./logout";

describe("/logout controller", () => {

    test("should send 204 reponse with empty access and refresh tokens when request contains token cookies", async () => {
        const req = createRequest({ cookies: { accessToken: "abc", refreshToken: "def" } })
        const res = createResponse();
        const next = jest.fn();

        await logoutController(req, res, next)

        const { accessToken, refreshToken } = res.cookies

        expect(accessToken.value).toBe("")
        expect(accessToken.options.expires?.getTime()).toBeLessThanOrEqual(new Date().getTime())

        expect(refreshToken.value).toBe("")
        expect(refreshToken.options.expires?.getTime()).toBeLessThanOrEqual(new Date().getTime())

    })


    test("should send 204 reponse with empty access and refresh tokens when request doesn't contain token cookies", async () => {
        const req = createRequest()
        const res = createResponse();
        const next = jest.fn();

        await logoutController(req, res, next)

        const { accessToken, refreshToken } = res.cookies

        expect(accessToken.value).toBe("")
        expect(accessToken.options.expires?.getTime()).toBeLessThanOrEqual(new Date().getTime())

        expect(refreshToken.value).toBe("")
        expect(refreshToken.options.expires?.getTime()).toBeLessThanOrEqual(new Date().getTime())

    })
})