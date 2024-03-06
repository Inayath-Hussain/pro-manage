import { createRequest, createResponse } from "node-mocks-http"
import { validateRegisterBody } from "./register"

describe("register middleware", () => {
    const next = jest.fn()


    test("should send 422 response when body is empty", async () => {
        const res = createResponse()
        const mockedReq = createRequest({ body: {} })

        const errorObj = { message: "Invalid body", errors: { name: "name is required", email: "email is required", password: "password is required" } }

        await validateRegisterBody(mockedReq, res, next)

        expect(res._getStatusCode()).toBe(422)
        expect(res._getJSONData()).toEqual(errorObj)
    })


    test("should send 422 response when name contains only numbers", async () => {
        const res = createResponse()
        const mockedReq = createRequest({ body: { name: "123", email: "test@domain.com", password: 'Example@1' } })

        const errorObj = { message: "Invalid body", errors: { name: "name should contain letters" } }

        await validateRegisterBody(mockedReq, res, next)

        expect(res._getStatusCode()).toBe(422)
        expect(res._getJSONData()).toEqual(errorObj)

    })


    test("should send 422 response when email is in invalid format", async () => {
        const res = createResponse()
        const mockedReq = createRequest({ body: { name: "test1", email: "testdomain.com", password: "Example@1" } })


        const errorObj = { message: "Invalid body", errors: { email: "email is invalid" } }

        await validateRegisterBody(mockedReq, res, next)

        expect(res._getStatusCode()).toBe(422)
        expect(res._getJSONData()).toEqual(errorObj)

    })


    test("should send 422 response if password doesn't meet requirements", async () => {

        const mockedReq1 = createRequest({ body: { name: "test1", email: "test@domain.com", password: "Example" } })
        const mockedReq2 = createRequest({ body: { name: "test1", email: "test@domain.com", password: "Exampleee1" } })
        const mockedReq3 = createRequest({ body: { name: "test1", email: "test@domain.com", password: "Example@reerterger" } })
        const mockedReq4 = createRequest({ body: { name: "test1", email: "test@domain.com", password: "12345678@" } })
        const mockedReq5 = createRequest({ body: { name: "test1", email: "test@domain.com", password: "1123456889" } })


        const lengthErrorObj = { message: "Invalid body", errors: { password: "password must be 8 letters long" } }
        const constraintErrorObj = { message: "Invalid body", errors: { password: "must contain atleast 1 number, 1 letter and 1 special symbol" } }

        const response1 = createResponse()
        await validateRegisterBody(mockedReq1, response1, next)
        expect(response1._getStatusCode()).toBe(422)
        expect(response1._getJSONData()).toEqual(lengthErrorObj)


        const response2 = createResponse()
        await validateRegisterBody(mockedReq2, response2, next)
        expect(response2._getStatusCode()).toBe(422)
        expect(response2._getJSONData()).toEqual(constraintErrorObj)


        const response3 = createResponse()
        await validateRegisterBody(mockedReq3, response3, next)
        expect(response3._getStatusCode()).toBe(422)
        expect(response3._getJSONData()).toEqual(constraintErrorObj)


        const response4 = createResponse()
        await validateRegisterBody(mockedReq4, response4, next)
        expect(response4._getStatusCode()).toBe(422)
        expect(response4._getJSONData()).toEqual(constraintErrorObj)


        const response5 = createResponse()
        await validateRegisterBody(mockedReq5, response5, next)
        expect(response5._getStatusCode()).toBe(422)
        expect(response5._getJSONData()).toEqual(constraintErrorObj)

    })

})