import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../index";

interface IChecklist {
    description: string
    done: boolean
}

export interface ITask {
    _id: string
    title: string
    priority: string
    status: string
    checklist: IChecklist[]
    createdAt: string,
    dueDate?: string
}

const initialState: ITask[] = []


const taskSlice = createSlice({
    initialState,
    name: "tasks",
    reducers: {
        // @ts-ignore
        renewTask: (state, action) => {
            return action.payload
        }
    }
})


export const { renewTask } = taskSlice.actions

export const taskSelector = (state: RootState) => state.tasks

export const tasks = {
    name: taskSlice.name,
    reducer: taskSlice.reducer
}