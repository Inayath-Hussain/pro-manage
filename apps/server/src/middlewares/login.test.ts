// mock req, res and next params
// import and call login middleware
// expect next to be called with known parameters



import { createRequest } from "node-mocks-http"
import { validateLoginBody } from "./login"
import { Ierror } from "../utilities/requestHandlers/errorHandler"
import { validateRequest } from "./middleware.test.helper"




describe("login middleware", () => {
    test("should return 400 response when body is empty", async () => {
        const mockedReq = createRequest({ body: { email: "" } })
        const res: Partial<Response> = {}
        const next = jest.fn()

        const finalNext = await validateRequest(validateLoginBody, mockedReq, res, next)

        // assert error response
        expect(finalNext).toHaveBeenCalledWith({ statusCode: 400, message: "email field is undefined, null or missing" } as Ierror)

    })


    test("should call next with 400 response when email is in invalid format", async () => {
        const mockedReq = createRequest({ body: { email: "testdomain.com" } })
        const res = {}
        const next = jest.fn()

        const finalNext = await validateRequest(validateLoginBody, mockedReq, res, next)

        expect(finalNext).toHaveBeenCalledWith({ statusCode: 400, message: "Invalid email" } as Ierror)
    })


    test("should call next with 400 response when password doesn't meet requirement", async () => {
        const mockedReq1 = createRequest({ body: { email: "test@domain.com", password: "Example" } })
        const mockedReq2 = createRequest({ body: { email: "test@domain.com", password: "Example1" } })
        const mockedReq3 = createRequest({ body: { email: "test@domain.com", password: "Example@" } })
        const mockedReq4 = createRequest({ body: { email: "test@domain.com", password: "1@" } })

        const res = {}
        const next = jest.fn()

        const errorObj: Ierror = { statusCode: 400, message: "password should contain atleast one number, one letter and one special symbol" }

        const finalNext1 = await validateRequest(validateLoginBody, mockedReq1, res, next)

        expect(finalNext1).toHaveBeenCalledTimes(1)
        expect(finalNext1).toHaveBeenCalledWith(errorObj)


        const finalNext2 = await validateRequest(validateLoginBody, mockedReq2, res, next)

        expect(finalNext2).toHaveBeenCalledTimes(1)
        expect(finalNext2).toHaveBeenCalledWith(errorObj)


        const finalNext3 = await validateRequest(validateLoginBody, mockedReq3, res, next)

        expect(finalNext3).toHaveBeenCalledTimes(1)
        expect(finalNext3).toHaveBeenCalledWith(errorObj)


        const finalNext4 = await validateRequest(validateLoginBody, mockedReq4, res, next)

        expect(finalNext4).toHaveBeenCalledTimes(1)
        expect(finalNext4).toHaveBeenCalledWith(errorObj)
    })


    test("should return 400 response when additional fields are present in request body", async () => {
        const mockedReq = createRequest({ body: { email: "test@domain.com", password: "Example@1", hello: "world" } })

        const res = {}
        const next = jest.fn()

        const errorObj: Ierror = { statusCode: 400, message: "Invalid body. should contain only email and password." }

        const finalNext = await validateRequest(validateLoginBody, mockedReq, res, next)
        expect(finalNext).toHaveBeenCalledTimes(1)
        expect(finalNext).toHaveBeenCalledWith(errorObj)
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