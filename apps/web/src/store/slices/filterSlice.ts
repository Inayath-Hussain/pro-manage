import { IGetTaskQuery } from "@pro-manage/common-interfaces"
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../index";

const initialState: IGetTaskQuery["filter"] = "week"

const filterSlice = createSlice({
    initialState: initialState as IGetTaskQuery["filter"],
    name: "filter",
    reducers: {
        updateFilter: (state, action: PayloadAction<IGetTaskQuery["filter"]>) => {
            state = action.payload
            return state
        }
    }
})


export const { updateFilter } = filterSlice.actions

export const filterSelector = (state: RootState) => state.filter

export const filter = {
    name: filterSlice.name,
    reducer: filterSlice.reducer
}