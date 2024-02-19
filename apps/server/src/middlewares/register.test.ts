import { createRequest } from "node-mocks-http"
import { validateRequest } from "./middleware.test.helper"
import { validateRegisterBody } from "./register"
import { Ierror } from "../utilities/requestHandlers/errorHandler"

describe("register middleware", () => {
    const res = {}
    const next = jest.fn()


    test("should call next with 400 response when body is empty", async () => {
        const mockedReq = createRequest({ body: {} })

        const errorObj: Ierror = { statusCode: 400, message: "name is required" }

        const finalNext = await validateRequest(validateRegisterBody, mockedReq, res, next)

        expect(finalNext).toHaveBeenCalledTimes(1)
        expect(finalNext).toHaveBeenCalledWith(errorObj)
    })


    test("should call next with 400 response when name contains only numbers", async () => {
        const mockedReq = createRequest({ body: { name: "123" } })

        const errorObj: Ierror = { statusCode: 400, message: "name should contain letters" }

        const finalNext = await validateRequest(validateRegisterBody, mockedReq, res, next)

        expect(finalNext).toHaveBeenCalledTimes(1)
        expect(finalNext).toHaveBeenCalledWith(errorObj)

    })


    test("should call next with 400 response if email is in invalid format", async () => {
        const mockedReq = createRequest({ body: { name: "test1", email: "testdomain.com" } })

        const errorObj: Ierror = { statusCode: 400, message: "email is invalid" }

        const finalNext = await validateRequest(validateRegisterBody, mockedReq, res, next)

        expect(finalNext).toHaveBeenCalledTimes(1)
        expect(finalNext).toHaveBeenCalledWith(errorObj)

    })


    test("should call next with 400 response if password doesn't meet requirements", async () => {

        const mockedReq1 = createRequest({ body: { name: "test1", email: "test@domain.com", password: "Example" } })
        const mockedReq2 = createRequest({ body: { name: "test1", email: "test@domain.com", password: "Example1" } })
        const mockedReq3 = createRequest({ body: { name: "test1", email: "test@domain.com", password: "Example@" } })
        const mockedReq4 = createRequest({ body: { name: "test1", email: "test@domain.com", password: "1@" } })


        const errorObj: Ierror = { statusCode: 400, message: "password should be 8 letters long and contain atleast one number, one Uppercase letter and one special symbol" }

        const finalNext1 = await validateRequest(validateRegisterBody, mockedReq1, res, next)

        expect(finalNext1).toHaveBeenCalledTimes(1)
        expect(finalNext1).toHaveBeenCalledWith(errorObj)


        const finalNext2 = await validateRequest(validateRegisterBody, mockedReq2, res, next)

        expect(finalNext2).toHaveBeenCalledTimes(1)
        expect(finalNext2).toHaveBeenCalledWith(errorObj)


        const finalNext3 = await validateRequest(validateRegisterBody, mockedReq3, res, next)

        expect(finalNext3).toHaveBeenCalledTimes(1)
        expect(finalNext3).toHaveBeenCalledWith(errorObj)


        const finalNext4 = await validateRequest(validateRegisterBody, mockedReq4, res, next)

        expect(finalNext4).toHaveBeenCalledTimes(1)
        expect(finalNext4).toHaveBeenCalledWith(errorObj)
    })


    test("should call next with 400 response when body contains any additional fields", async () => {
        const mockedReq = createRequest({ body: { name: "test", email: "test@domain.com", password: "Example@1", hello: "world" } })

        const errorObj: Ierror = { statusCode: 400, message: "Invalid body. should contain only name, email and password." }

        const finalNext = await validateRequest(validateRegisterBody, mockedReq, res, next)
        expect(finalNext).toHaveBeenCalledTimes(1)
        expect(finalNext).toHaveBeenCalledWith(errorObj)
    })
})