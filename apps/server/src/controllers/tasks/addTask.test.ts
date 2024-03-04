import { createRequest, createResponse } from "node-mocks-http"
import { addTaskController } from "./addTask";
import { userService } from "../../services/user";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";

const mockedGetUserByEmail = jest.spyOn(userService, "getUserByEmail")

describe("addTask controller", () => {
    test("should call next with 401 response when email doesn't exist in db", async () => {
        const email = "test@domain.com"
        const req = createRequest();
        req.email = email;
        const res = createResponse();
        const next = jest.fn();

        const errorObj = { statusCode: 401, message: "email doesn't exist" } as Ierror

        mockedGetUserByEmail.mockResolvedValue(null)


        await addTaskController(req, res, next);


        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)
    })

})