import { createRequest, createResponse } from "node-mocks-http"
import { userService } from "../../services/user"
import { getAnalyticsController } from "./analytics"
import { Ierror } from "../../utilities/requestHandlers/errorHandler"

const mockedGetUserByEmail = jest.spyOn(userService, "getUserByEmail")

describe("getAnalytics controller", () => {
    test("should call next with 401 response when email doesn't exist in db", async () => {
        const req = createRequest()
        req.email = "test@domain.com"
        const res = createResponse()
        const next = jest.fn();

        const errorObj = { statusCode: 401, message: "Email doesn't exist" } as Ierror

        mockedGetUserByEmail.mockResolvedValue(null)

        await getAnalyticsController(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)
    })
})