import { ILoginMiddlewareError } from "@pro-manage/common-interfaces"

import { createRequest, createResponse } from "node-mocks-http"
import { validateLoginBody } from "./login"
import { validateRequest } from "./middleware.test.helper"




describe("login middleware", () => {
    test("should return 400 response when body is empty", async () => {
        const mockedReq = createRequest({ body: { email: "" } })
        const res = createResponse()
        const next = jest.fn()

        const errorObj: ILoginMiddlewareError = { message: "Invalid body", errors: { email: "email is required", password: "password is required" } }

        await validateRequest(validateLoginBody, mockedReq, res, next)


        // assert error response
        expect(res._getStatusCode()).toBe(400)
        expect(res._getJSONData()).toEqual(errorObj)

    })


    test("should call next with 400 response when email is in invalid format", async () => {
        const mockedReq = createRequest({ body: { email: "testdomain.com" } })
        const res = createResponse()
        const next = jest.fn()

        const errorObj: ILoginMiddlewareError = { message: "Invalid body", errors: { email: "Invalid email", password: "password is required" } }

        await validateRequest(validateLoginBody, mockedReq, res, next)

        expect(res._getStatusCode()).toBe(400)
        expect(res._getJSONData()).toEqual(errorObj)

    })


    test("should call next with 400 response when password doesn't meet requirement", async () => {
        const next = jest.fn()

        const errorObj: ILoginMiddlewareError = { message: "Invalid body", errors: { password: "password should be 8 letters long and contain atleast one number, one Uppercase letter and one special symbol" } }



        const mockedReq1 = createRequest({ body: { email: "test@domain.com", password: "Example" } })
        const response1 = createResponse()

        await validateRequest(validateLoginBody, mockedReq1, response1, next)

        expect(response1._getStatusCode()).toBe(400)
        expect(response1._getJSONData()).toEqual(errorObj)



        const mockedReq2 = createRequest({ body: { email: "test@domain.com", password: "Example1" } })
        const response2 = createResponse()

        await validateRequest(validateLoginBody, mockedReq2, response2, next)

        expect(response2._getJSONData()).toEqual(errorObj)



        const mockedReq3 = createRequest({ body: { email: "test@domain.com", password: "Example@" } })
        const response3 = createResponse()

        await validateRequest(validateLoginBody, mockedReq3, response3, next)

        expect(response3._getJSONData()).toEqual(errorObj)




        const mockedReq4 = createRequest({ body: { email: "test@domain.com", password: "1@" } })
        const response4 = createResponse()

        await validateRequest(validateLoginBody, mockedReq4, response4, next)

        expect(response4._getJSONData()).toEqual(errorObj)
    })


    test("should return 400 response when additional fields are present in request body", async () => {
        const mockedReq = createRequest({ body: { email: "test@domain.com", password: "Example@1", hello: "world" } })
        const res = createResponse()
        const next = jest.fn()

        const errorObj: ILoginMiddlewareError = { message: "Invalid body. should contain only email and password.", errors: {} }


        await validateRequest(validateLoginBody, mockedReq, res, next)

        expect(res._getJSONData()).toEqual(errorObj)
    })


    test("should call next without any params when email and password are valid", async () => {
        const mockedReq = createRequest({ body: { email: "test@domain.com", password: "Example@1" } })
        const res = {}
        const next = jest.fn()

        const finalNext = await validateRequest(validateLoginBody, mockedReq, res, next)
        expect(finalNext).toHaveBeenCalledTimes(1)
        expect(finalNext).toHaveBeenCalledWith()
    })
})