import { createRequest, createResponse } from "node-mocks-http"
import { validateUpdateBody } from "./update";
import { IUpdateBody, IUpdateMiddlewareError } from "@pro-manage/common-interfaces";

describe("update middleware", () => {

    test("should return 422 response when no required fields are present in request body", async () => {
        // mocks
        const req = createRequest();
        const res = createResponse();
        const next = jest.fn();

        const errorObj = { message: "Atleast name or old and new passwords should be provided to update." }

        validateUpdateBody(req, res, next)

        // assertions
        expect(res._getStatusCode()).toBe(400)
        expect(res._getJSONData()).toEqual(errorObj)
    })


    test("should call next with no arguments when only name field is sent in request body", async () => {
        const req = createRequest({ body: { name: "test1" } })
        const res = createResponse()
        const next = jest.fn()

        // await updateBodyValidation(req, res, next)
        // await validateUpdateBody(req, res, next)

        validateUpdateBody(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenLastCalledWith()
    })


    test("should send 422 response when only one of the password is present in request", async () => {
        const req1 = createRequest({ body: { oldPassword: "Example@1" } as IUpdateBody })
        const res = createResponse()
        const next = jest.fn()

        const errorObj: IUpdateMiddlewareError = { message: "Invalid body", errors: { newPassword: "newPassword is required" } }

        // await updateBodyValidation(req1, res, next)
        await validateUpdateBody(req1, res, next)
        // await validateUpdateBody(req1, res, next)

        expect(res._getStatusCode()).toBe(422)
        expect(res._getJSONData()).toEqual(errorObj)
    })

})