import { InferSchemaType, Schema, model } from "mongoose";
import { priorityEnum, statusEnum } from "@pro-manage/common-interfaces";

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
    priority: { type: String, required: true, enum: priorityEnum },
    status: { type: String, required: true, enum: statusEnum, default: "to-do" },
    checklist: [checkListSchema],
    createdAt: { type: Date, required: false, default: new Date() }
})


export type ITask = InferSchemaType<typeof taskSchema>

export const Task = model("task", taskSchema)
