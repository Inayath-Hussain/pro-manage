import { createRequest, createResponse } from "node-mocks-http"
import { userService } from "../../services/user"
import { Ierror } from "../../utilities/requestHandlers/errorHandler"
import { updateTaskController } from "./updateTask"
import { User } from "../../models/user"
import { taskService } from "../../services/task"

const mockedGetUserByEmail = jest.spyOn(userService, "getUserByEmail")
const mockedGetTaskById = jest.spyOn(taskService, "getTasksByID")

describe("updateTask controller", () => {
    test("should call next with 401 response when email doesn't exist in db", async () => {
        const req = createRequest({ query: { filter: "day" } })
        req.email = "test@domain.com"
        const res = createResponse();
        const next = jest.fn();

        const errorObj = { statusCode: 401, message: "email doesn't exist" } as Ierror

        mockedGetUserByEmail.mockResolvedValue(null)


        await updateTaskController(req, res, next);

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)
    })


    test("should call next with 404 response when task doesn't exist", async () => {
        const req = createRequest({ query: { filter: "day" } })
        req.email = "test@domain.com"
        const res = createResponse();
        const next = jest.fn();

        const errorObj = { statusCode: 404, message: "task doesn't exist" } as Ierror

        const userDoc = new User({ name: "test1", email: "test@domain.com", password: "oaefnovnonbr" })

        mockedGetUserByEmail.mockResolvedValue(userDoc)
        mockedGetTaskById.mockResolvedValue(null)

        await updateTaskController(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)

    })
})