import { createRequest, createResponse } from "node-mocks-http"
import { deleteTaskController } from "./deleteTask";
import { userService } from "../../services/user";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";
import { taskService } from "../../services/task";
import { User } from "../../models/user";
import { InvalidTaskId } from "@pro-manage/common-interfaces";

const mockedGetUserByEmail = jest.spyOn(userService, "getUserByEmail")

const mockedGetTaskByID = jest.spyOn(taskService, "getTasksByID");

describe("deleteTask controller", () => {
    test("should call next with 401 response when email doesn't exist in db", async () => {
        const req = createRequest()
        req.email = "test@domain.com";
        const res = createResponse();
        const next = jest.fn();

        const errorObj = { statusCode: 401, message: "email doesn't exist" } as Ierror

        mockedGetUserByEmail.mockResolvedValue(null)

        await deleteTaskController(req, res, next);

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)
    })


    test("should call next with 404 response when task doesn't exist", async () => {
        const req = createRequest({ params: { id: "65e136a99e3f0215abdf1743" } })
        req.email = "test@domain.com";
        const res = createResponse();
        const next = jest.fn();

        const errorObj = new InvalidTaskId();

        const userDoc = new User({ name: "test", email: "test@domain.com", password: "oefuesnou" })

        mockedGetUserByEmail.mockResolvedValue(userDoc)
        mockedGetTaskByID.mockResolvedValue(null)

        await deleteTaskController(req, res, next);

        expect(res._getStatusCode()).toBe(404)
        expect(res._getJSONData()).toEqual(errorObj)
    })
})