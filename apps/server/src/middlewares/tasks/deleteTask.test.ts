import { createRequest, createResponse } from "node-mocks-http"
import { validateDeleteTaskParam } from "./deleteTask";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";

describe("validateDeleteTask middleware", () => {
    test("should call next with 400 response when parameter is missing", async () => {
        const req = createRequest();
        const res = createResponse();
        const next = jest.fn();

        const errorObj = { statusCode: 400, message: "request must contain task id as parameter" } as Ierror

        await validateDeleteTaskParam(req, res, next);

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)
    })
})