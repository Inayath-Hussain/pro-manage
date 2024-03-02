import { createRequest, createResponse } from "node-mocks-http";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";
import { updateTaskStatusController } from "./updateTaskStatus";
import { User } from "../../models/user";
import { userService } from "../../services/user";
import { taskService } from "../../services/task";
import { InvalidTaskId } from "@pro-manage/common-interfaces";

const mockedGetUserByEmail = jest.spyOn(userService, "getUserByEmail")
const mockedGetTaskById = jest.spyOn(taskService, "getTasksByID")


describe("updateTaskStatus controller", () => {
    test("should call next with 401 response when email doesn't exist in db", async () => {
        const req = createRequest({ query: { filter: "day" } })
        req.email = "test@domain.com"
        const res = createResponse();
        const next = jest.fn();

        const errorObj = { statusCode: 401, message: "email doesn't exist" } as Ierror

        mockedGetUserByEmail.mockResolvedValue(null)


        await updateTaskStatusController(req, res, next);

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)
    })


    test("should call next with 404 response when task doesn't exist", async () => {
        const req = createRequest({ query: { filter: "day" } })
        req.email = "test@domain.com"
        const res = createResponse();
        const next = jest.fn();

        const errorObj = new InvalidTaskId()

        const userDoc = new User({ name: "test1", email: "test@domain.com", password: "oaefnovnonbr" })

        mockedGetUserByEmail.mockResolvedValue(userDoc)
        mockedGetTaskById.mockResolvedValue(null)

        await updateTaskStatusController(req, res, next)

        expect(res._getStatusCode()).toBe(404)
        expect(res._getJSONData()).toEqual(errorObj)

    })
})