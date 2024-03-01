import { createRequest, createResponse } from "node-mocks-http"
import { validateUpdateTaskStatusBody } from "./updateTaskStatus";

describe("validateUpdateTaskStatus middleware", () => {
    test("should return 422 response when taskId and status are missing", async () => {
        const req = createRequest();
        const res = createResponse();
        const next = jest.fn();

        const errorObj = { message: "Invalid body", errors: { taskId: "taskId is required", status: "status is required" } }

        await validateUpdateTaskStatusBody(req, res, next)

        expect(res._getStatusCode()).toBe(422)
        expect(res._getJSONData()).toEqual(errorObj)
    })


    test("should return 422 response when status isn't one of the acceptable values", async () => {
        const req = createRequest({ body: { taskId: "aeewfewfe", status: "hello" } })
        const res = createResponse()
        const next = jest.fn();

        const errorObj = { message: "Invalid body", errors: { status: "status value should be one of 'backlog, in-progress, to-do, done'" } }

        await validateUpdateTaskStatusBody(req, res, next)

        expect(res._getStatusCode()).toBe(422)
        expect(res._getJSONData()).toEqual(errorObj)
    })
})