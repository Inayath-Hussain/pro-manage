import { priorityEnum, statusEnum } from "@pro-manage/common-interfaces";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../index";

interface IChecklist {
    description: string
    done: boolean
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
        }
    }
})


export const { renewTask, updateTaskStatus } = taskSlice.actions

export const taskSelector = (state: RootState) => state.tasks

export const tasks = {
    name: taskSlice.name,
    reducer: taskSlice.reducer
}