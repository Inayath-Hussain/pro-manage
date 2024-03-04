import { createRequest, createResponse } from "node-mocks-http"
import { addTaskController } from "./addTask";
import { userService } from "../../services/user";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";
import { taskService } from "../../services/task";
import { User } from "../../models/user";
import { Task } from "../../models/task";

const mockedGetUserByEmail = jest.spyOn(userService, "getUserByEmail")
const mockedAddTask = jest.spyOn(taskService, "addTask");

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


    test("should return 201 response when request is valid", async () => {
        const email = "test@domain.com"
        const user = new User({ email, name: "test", password: "efnnvgrg" })
        const req = createRequest();
        req.email = email;
        const res = createResponse();
        const next = jest.fn();

        mockedGetUserByEmail.mockResolvedValue(user)

        const task = new Task({
            title: "toign",
            user: user._id, createdAt: new Date(), dueDate: "2024",
            checklist: [{ description: "seff", done: false }], status: "done", priority: "low"
        })

        mockedAddTask.mockResolvedValue(task)

        await addTaskController(req, res, next);


        expect(res._getStatusCode()).toBe(201)
        expect(res._getJSONData()).toEqual({ message: "success", taskId: task._id.toString() })

    })
})