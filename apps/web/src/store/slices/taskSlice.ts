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
        renewTaskAction: (state, action) => {
            state = [...action.payload]

            return state
        },

        addTaskAction: (state, action: PayloadAction<ITask>) => {
            state = [...state, action.payload]
        },

        updateTaskStatusAction: (state, action: PayloadAction<IUpdateTaskStatusPayload>) => {
            const index = state.findIndex(s => s._id === action.payload._id)

            state[index].status = action.payload.status
        },

        updateDoneAction: (state, action: PayloadAction<IUpdateDoneBody>) => {
            const taskIndex = state.findIndex(s => s._id === action.payload.taskId)
            const itemIndex = state[taskIndex].checklist.findIndex(c => c._id === action.payload.checkListId)

            state[taskIndex].checklist[itemIndex].done = action.payload.done
        },

        removeTaskAction: (state, action: PayloadAction<{ _id: string }>) => {
            state = state.filter(s => s._id !== action.payload._id)
            return state
        },

        removeCheckListItemAction: (state, action: PayloadAction<{ taskId: string, itemID: string }>) => {
            const index = state.findIndex(s => s._id === action.payload.taskId)

            state[index].checklist = state[index].checklist.filter(c => c._id !== action.payload.itemID)
        }
    }
})


export const { renewTaskAction, addTaskAction, updateTaskStatusAction, updateDoneAction, removeTaskAction, removeCheckListItemAction } = taskSlice.actions

export const taskSelector = (state: RootState) => state.tasks

export const tasks = {
    name: taskSlice.name,
    reducer: taskSlice.reducer
}