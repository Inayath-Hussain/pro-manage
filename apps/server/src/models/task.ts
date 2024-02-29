import { InferSchemaType, Schema, model } from "mongoose";


// title - string
// due date - optional
// priority - "low" | "moderate" | "high"
// status - "backlog" | "progress" | "to-do" | "done"

// checklist - array - description - string, done - boolean

const checkListSchema = new Schema({
    description: { type: String, required: true },
    done: { type: Boolean, required: true, default: false }
})


const taskSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    title: { type: String, required: true },
    dueDate: { type: Date, required: false },
    priority: { type: String, required: true, enum: ["high", "moderate", "low"] },
    status: { type: String, required: true, enum: ["backlog", "in-progress", "to-do", "done"], default: "to-do" },
    checklist: [checkListSchema]
})


export type ITask = InferSchemaType<typeof taskSchema>

export const Task = model("task", taskSchema)

// @ts-ignore
// extract priority enumValues defined in schema. Had to use ts-ignore because enumValues is not defined in mongoose types 
export const priorityEnum = Task.schema.path("priority").enumValues as string[]