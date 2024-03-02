import { createRequest, createResponse } from "node-mocks-http"
import { validateUpdateDoneBody } from "./updateDone"

describe("validateUpdateDoneBody middleware", () => {
    test("should return 422 response when required fields are missing", async () => {
        const req = createRequest()
        const res = createResponse()
        const next = jest.fn()

        const errorObj = { message: "Invalid body", errors: { taskId: "taskId is required", checkListId: "checkListId is required", done: "done is required" } }

        await validateUpdateDoneBody(req, res, next);

        expect(res._getStatusCode()).toBe(422)
        expect(res._getJSONData()).toEqual(errorObj)
    })


    test("should return 422 response when checkListId is not of type string", async () => {
        const req = createRequest({ body: { taskId: "eoifnoew", checkListId: 9343954368435, done: false } })
        const res = createResponse()
        const next = jest.fn();

        const errorObj = { message: "Invalid body", errors: { checkListId: "checkListId should be of type 'string'" } }

        await validateUpdateDoneBody(req, res, next)

        expect(res._getStatusCode()).toBe(422)
        expect(res._getJSONData()).toEqual(errorObj)
    })


    test("should return 422 response when done is not of type boolean", async () => {
        const req = createRequest({ body: { taskId: "eoifnoew", checkListId: "sefowenbowr", done: "false" } })
        const res = createResponse()
        const next = jest.fn();

        const errorObj = { message: "Invalid body", errors: { done: "done should be of type 'boolean'" } }

        await validateUpdateDoneBody(req, res, next)

        expect(res._getStatusCode()).toBe(422)
        expect(res._getJSONData()).toEqual(errorObj)
    })


})