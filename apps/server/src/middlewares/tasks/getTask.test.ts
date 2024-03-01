import { createRequest, createResponse } from "node-mocks-http"
import { validateGetTaskQuery } from "./getTask";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";

describe("getTask middleware", () => {
    test("should call next with 400 response when filter query doesn't exist in request", async () => {
        const req = createRequest();
        const res = createResponse();
        const next = jest.fn();

        const errorObj = { statusCode: 401, message: "filter query must be provided" } as Ierror

        await validateGetTaskQuery(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)
    })


    test("should call next with 400 response when filter query value isn't one of the acceptable values", async () => {
        const req = createRequest({ query: { filter: "hello" } })
        const res = createResponse();
        const next = jest.fn();

        const errorObj = { statusCode: 400, message: "filter query should be one of the values 'day, week, month'" } as Ierror

        await validateGetTaskQuery(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)
    })
})