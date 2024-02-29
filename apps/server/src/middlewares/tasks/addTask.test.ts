import { createRequest, createResponse } from "node-mocks-http"
import { validateAddTaskBody } from "./addTask";

describe("addTask middleware", () => {
    test("should return 422 response when required fields are missing in request body", async () => {
        const req = createRequest();
        const res = createResponse();
        const next = jest.fn();

        const errorObj = { message: "Invalid body", errors: { title: "title is required", priority: "priority is required", checkList: "checkList is required" } }

        await validateAddTaskBody(req, res, next)

        expect(res._getStatusCode()).toBe(422)
        expect(res._getJSONData()).toEqual(errorObj)

    })


    test("should return 422 response when title, priority and checkList are missing", async () => {

        const req = createRequest({ body: { title: 12344, priority: 3245435, checkList: 32432523 } });
        const res = createResponse();
        const next = jest.fn();

        const errorObj = { message: "Invalid body", errors: { title: "title should be type 'string'", priority: "priority should be type 'string'", checkList: "checkList should be type 'Array'" } }

        await validateAddTaskBody(req, res, next)

        expect(res._getStatusCode()).toBe(422)
        expect(res._getJSONData()).toEqual(errorObj)

    })


    test("should send 422 response when title is not of type 'string'", async () => {
        const req = createRequest({ body: { title: 12344, priority: "high", checkList: [{ description: "he", done: false }] } })
        const res = createResponse()
        const next = jest.fn();

        const errorObj = { message: "Invalid body", errors: { title: "title should be type 'string'" } }

        await validateAddTaskBody(req, res, next)

        expect(res._getStatusCode()).toBe(422)
        expect(res._getJSONData()).toEqual(errorObj)
    })


    test("should send 422 response when priority is not of type string", async () => {
        const req = createRequest({ body: { title: "hello", priority: 1234432, checkList: [{ description: "he", done: false }] } })
        const res = createResponse()
        const next = jest.fn();

        const errorObj = { message: "Invalid body", errors: { priority: "priority should be type 'string'" } }

        await validateAddTaskBody(req, res, next)


        expect(res._getStatusCode()).toBe(422)
        expect(res._getJSONData()).toEqual(errorObj)
    })


    test("should send 422 response when priority value isn't one of the acceptable values", async () => {
        const req = createRequest({ body: { title: "helo", priority: "hello", checkList: [{ description: "hello", done: false }], dueDate: new Date() } })
        const res = createResponse()
        const next = jest.fn();

        const errorObj = { message: "Invalid body", errors: { priority: "priority value should be one of 'high, moderate, low'" } }

        await validateAddTaskBody(req, res, next)

        expect(res._getStatusCode()).toBe(422)
        expect(res._getJSONData()).toEqual(errorObj)
    })


    test("should send 422 response when checkList is not an array", async () => {
        const req = createRequest({ body: { title: "helo", priority: "high", checkList: [] } })
        const res = createResponse()
        const next = jest.fn();

        const errorObj = { message: "Invalid body", errors: { checkList: "checkList array cannot be empty" } }

        await validateAddTaskBody(req, res, next)

        expect(res._getStatusCode()).toBe(422)
        expect(res._getJSONData()).toEqual(errorObj)
    })


    test("should send 422 response when checkList array doesnot contain objects", async () => {
        const req = createRequest({ body: { title: "helo", priority: "high", checkList: ["description", "rs"] } })
        const res = createResponse()
        const next = jest.fn();

        const errorObj = { message: "Invalid body", errors: { checkList: "should contain array of objects with properties 'description' of type string and 'done' of type boolean" } }

        await validateAddTaskBody(req, res, next)

        expect(res._getStatusCode()).toBe(422)
        expect(res._getJSONData()).toEqual(errorObj)
    })


    test("should send 422 response when checkList elements contain invalid property", async () => {
        const req = createRequest({ body: { title: "helo", priority: "high", checkList: [{ description: "rs", drone: false }] } })
        const res = createResponse()
        const next = jest.fn();

        const errorObj = { message: "Invalid body", errors: { checkList: "should contain array of objects with properties 'description' of type string and 'done' of type boolean" } }

        await validateAddTaskBody(req, res, next)

        expect(res._getStatusCode()).toBe(422)
        expect(res._getJSONData()).toEqual(errorObj)

    })


    test("should send 422 response when checkList elements contain additional property", async () => {
        const req = createRequest({ body: { title: "helo", priority: "low", checkList: [{ description: "rs", done: false, hello: "world" }] } })
        const res = createResponse()
        const next = jest.fn();

        const errorObj = { message: "Invalid body", errors: { checkList: "should contain array of objects with properties 'description' of type string and 'done' of type boolean" } }

        await validateAddTaskBody(req, res, next)

        expect(res._getStatusCode()).toBe(422)
        expect(res._getJSONData()).toEqual(errorObj)
    })


    test("should send 422 response when checkList elements has description with empty value", async () => {
        const req = createRequest({ body: { title: "helo", priority: "moderate", checkList: [{ description: " ", done: false }] } })
        const res = createResponse()
        const next = jest.fn();

        const errorObj = { message: "Invalid body", errors: { checkList: "description and done are required" } }

        await validateAddTaskBody(req, res, next)

        expect(res._getStatusCode()).toBe(422)
        expect(res._getJSONData()).toEqual(errorObj)
    })

    test("should call next with no arguments when all fields are valid without dueDate", async () => {
        const req = createRequest({ body: { title: "helo", priority: "high", checkList: [{ description: "hello", done: false }] } })
        const res = createResponse()
        const next = jest.fn();

        await validateAddTaskBody(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith()
    })


    test("should return 422 response when dueDate field has data type other than Date", async () => {
        const date = "hello"
        const req = createRequest({ body: { title: "helo", priority: "low", checkList: [{ description: "hello", done: false }], dueDate: date } })
        const res = createResponse()
        const next = jest.fn();

        const errorObj = { message: "Invalid body", errors: { dueDate: "Invalid date" } }

        await validateAddTaskBody(req, res, next)

        expect(res._getStatusCode()).toBe(422)
        expect(res._getJSONData()).toEqual(errorObj)
    })


    test("should call next with no arguments when all fields are valid including dueDate", async () => {
        const req = createRequest({ body: { title: "helo", priority: "high", checkList: [{ description: "hello", done: false }], dueDate: new Date() } })
        const res = createResponse()
        const next = jest.fn();

        await validateAddTaskBody(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith()
    })
})