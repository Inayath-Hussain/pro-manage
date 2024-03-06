import { createRequest, createResponse } from "node-mocks-http"
import { validateLoginBody } from "./login"


describe("login middleware", () => {
    test("should return 422 response when body is empty", async () => {
        const mockedReq = createRequest({ body: { email: "" } })
        const res = createResponse()
        const next = jest.fn()

        const errorObj = { message: "Invalid body", errors: { email: "email is required", password: "password is required" } }

        await validateLoginBody(mockedReq, res, next)


        // assert error response
        expect(res._getStatusCode()).toBe(422)
        expect(res._getJSONData()).toEqual(errorObj)

    })


    test("should send 422 response when email is in invalid format", async () => {
        const mockedReq = createRequest({ body: { email: "testdomain.com" } })
        const res = createResponse()
        const next = jest.fn()

        const errorObj = { message: "Invalid body", errors: { email: "email is invalid", password: "password is required" } }

        await validateLoginBody(mockedReq, res, next)

        expect(res._getStatusCode()).toBe(422)
        expect(res._getJSONData()).toEqual(errorObj)

    })


    test("should send 422 response when password doesn't meet requirement", async () => {
        const next = jest.fn()

        const errorObj = { message: "Invalid body", errors: { password: "password is required" } }



        const mockedReq1 = createRequest({ body: { email: "test@domain.com" } })
        const response1 = createResponse()

        await validateLoginBody(mockedReq1, response1, next)

        expect(response1._getStatusCode()).toBe(422)
        expect(response1._getJSONData()).toEqual(errorObj)



        const mockedReq2 = createRequest({ body: { email: "test@domain.com", password: "" } })
        const response2 = createResponse()

        await validateLoginBody(mockedReq2, response2, next)

        expect(response2._getJSONData()).toEqual(errorObj)



        const mockedReq3 = createRequest({ body: { email: "test@domain.com", password: null } })
        const response3 = createResponse()

        await validateLoginBody(mockedReq3, response3, next)

        expect(response3._getJSONData()).toEqual(errorObj)


    })


    test("should call next without any params when email and password are valid", async () => {
        const mockedReq = createRequest({ body: { email: "test@domain.com", password: "Example@1" } })
        const res = createResponse()
        const next = jest.fn()

        await validateLoginBody(mockedReq, res, next)
        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith()
    })
})