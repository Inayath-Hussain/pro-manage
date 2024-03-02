import { IUpdateDoneBody, priorityEnum, statusEnum } from "@pro-manage/common-interfaces";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../index";

interface IChecklist {
    description: string
    done: boolean
    _id: string
}

export interface ITask {
    _id: string
    title: string
    priority: typeof priorityEnum[number]
    status: typeof statusEnum[number]
    checklist: IChecklist[]
    createdAt: string,
    dueDate?: string
}

interface IUpdateTaskStatusPayload {
    status: ITask["status"]
    _id: string
}


const initialState: ITask[] = []


const taskSlice = createSlice({
    initialState,
    name: "tasks",
    reducers: {
        renewTask: (state, action) => {
            state = [...action.payload]

            return state
        },

        updateTaskStatus: (state, action: PayloadAction<IUpdateTaskStatusPayload>) => {
            const index = state.findIndex(s => s._id === action.payload._id)

            state[index].status = action.payload.status
        },

        updateDone: (state, action: PayloadAction<IUpdateDoneBody>) => {
            const taskIndex = state.findIndex(s => s._id === action.payload.taskId)
            const itemIndex = state[taskIndex].checklist.findIndex(c => c._id === action.payload.checkListId)

            state[taskIndex].checklist[itemIndex].done = action.payload.done
        },

        removeTask: (state, action: PayloadAction<{ _id: string }>) => {
            state = state.filter(s => s._id !== action.payload._id)
        },

        removeCheckListItem: (state, action: PayloadAction<{ taskId: string, itemID: string }>) => {
            const index = state.findIndex(s => s._id === action.payload.taskId)

            state[index].checklist = state[index].checklist.filter(c => c._id !== action.payload.itemID)
        }
    }
})


export const { renewTask, updateTaskStatus, updateDone, removeTask, removeCheckListItem } = taskSlice.actions

export const taskSelector = (state: RootState) => state.tasks

export const tasks = {
    name: taskSlice.name,
    reducer: taskSlice.reducer
}