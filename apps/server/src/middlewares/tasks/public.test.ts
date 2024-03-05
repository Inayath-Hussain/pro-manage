import { createRequest, createResponse } from "node-mocks-http"
import { validatePublicTaskId } from "./public";

describe("validatePublicTaskId middleware", () => {
    test("should return 422 response when taskId param is missing", async () => {
        const req = createRequest({ params: {} });
        const res = createResponse();
        const next = jest.fn();

        await validatePublicTaskId(req, res, next)

        expect(res._getStatusCode()).toBe(422);
        expect(res._getJSONData()).toEqual({ message: "Invalid body", errors: { taskId: "taskId is required" } })
    })
})