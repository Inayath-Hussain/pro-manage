import { createRequest, createResponse } from "node-mocks-http"
import { taskService } from "../../services/task"
import { publicTaskController } from "./public"
import { InvalidTaskId } from "@pro-manage/common-interfaces"

const mockedGetPublicTask = jest.spyOn(taskService, "getPublicTask")

describe("public task controller", () => {
    test("should return 404 response when task doesn't exist in db", async () => {
        const req = createRequest({ params: { taskId: "eofnoigvr" } })
        const res = createResponse();
        const next = jest.fn();

        mockedGetPublicTask.mockResolvedValue(null)

        const errorObj = new InvalidTaskId();

        await publicTaskController(req, res, next);

        expect(res._getStatusCode()).toBe(404)
        expect(res._getJSONData()).toEqual(errorObj)
    })
})