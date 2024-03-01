import { createRequest, createResponse } from "node-mocks-http"

import { getTaskController } from "./getTask"
import { userService } from "../../services/user"
import { Ierror } from "../../utilities/requestHandlers/errorHandler"

const mockedGetUserByEmail = jest.spyOn(userService, "getUserByEmail")

describe("getTask controller", () => {
    test("should call next with 401 response when email doesn't exist in db", async () => {
        const req = createRequest({ query: { filter: "day" } })
        req.email = "test@domain.com"
        const res = createResponse();
        const next = jest.fn();

        const errorObj = { statusCode: 401, message: "email doesn't exist" } as Ierror

        mockedGetUserByEmail.mockResolvedValue(null)

        // @ts-ignore
        await getTaskController(req, res, next);

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)
    })
})