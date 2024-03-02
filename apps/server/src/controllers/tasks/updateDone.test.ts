import { createRequest, createResponse } from "node-mocks-http"
import { updateDoneController } from "./updateDone";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";
import { userService } from "../../services/user";
import { taskService } from "../../services/task";
import { User } from "../../models/user";
import { Task } from "../../models/task";
import { IUpdateDoneBody } from "@pro-manage/common-interfaces";


const mockedGetUserByEmail = jest.spyOn(userService, "getUserByEmail");
const mockedGetTaskByID = jest.spyOn(taskService, "getTasksByID");

describe("updateDone controller", () => {
    test("should call next with 401 response when email is not in db", async () => {
        const req = createRequest();
        req.email = "test@domain.com"
        const res = createResponse();
        const next = jest.fn();

        const errorObj: Ierror = { statusCode: 401, message: "email doesn't exist" }

        mockedGetUserByEmail.mockResolvedValue(null)

        await updateDoneController(req, res, next);

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)
    })


    test("should call next with 404 response when task with provided id doesn't exist in db", async () => {
        const req = createRequest({ body: { taskId: "enviuwenv" } });
        req.email = "test@domain.com"
        const res = createResponse();
        const next = jest.fn();

        const errorObj: Ierror = { statusCode: 404, message: "task doesn't exist" }

        const user = new User({
            email: "test@domain.com",
            name: "test",
            password: "aeoufneog"
        })

        mockedGetUserByEmail.mockResolvedValue(user)
        mockedGetTaskByID.mockResolvedValue(null)

        await updateDoneController(req, res, next);

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)
    })


    test("should call next with 404 response when checkList item with provided id doesn't exist", async () => {
        const req = createRequest({ body: { taskId: "enviuwenv", checkListId: "oenonrwegorener", done: false } as IUpdateDoneBody });
        req.email = "test@domain.com"
        const res = createResponse();
        const next = jest.fn();

        const errorObj: Ierror = { statusCode: 404, message: "checkList item doesn't exist" }

        const userDoc = new User({
            email: "test@domain.com",
            name: "test",
            password: "aeoufneog"
        })

        mockedGetUserByEmail.mockResolvedValue(userDoc)

        const taskDoc = new Task({
            user: userDoc._id,
            title: "Title",
            createdAt: new Date(),
            checklist: [{ description: "item1", done: false }],
            priority: "high",
            status: "to-do"
        })

        mockedGetTaskByID.mockResolvedValue(taskDoc)

        await updateDoneController(req, res, next);

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(errorObj)
    })
})