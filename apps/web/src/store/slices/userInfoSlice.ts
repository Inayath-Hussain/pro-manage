import { UserInfo } from "@pro-manage/common-interfaces"

import { GenericAbortSignal } from "axios"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getUserInfoService } from "@web/services/api/user/getUserInfoService"
import { RootState } from "../index"


interface Ivalues extends UserInfo {
    status: "idle" | "loading" | "success" | "error"
}

const initialState: Ivalues = { ...new UserInfo({ email: "", name: "" }), status: "idle" }

/**
 * used to make api call to retrieve user info and store it in redux
 */
export const getUserInfo = createAsyncThunk("getUserInfo", async (signal: GenericAbortSignal, thunkAPI) => {
    try {
        const data = await getUserInfoService(signal)

        return thunkAPI.fulfillWithValue(data)
    }
    catch (ex) {
        if (ex === false) return thunkAPI.rejectWithValue(401)

        return thunkAPI.rejectWithValue(500)
    }

})


const userInfoSlice = createSlice({
    initialState: initialState,
    name: "userInfo",
    reducers: {
        clear: () => {
            return initialState
        },

        updateName: (state, action) => {
            state.name = action.payload.name
        }
    },
    extraReducers: (builder) => {

        builder.addCase(getUserInfo.pending, (state) => {
            state.status = "loading"
        }),

            builder.addCase(getUserInfo.fulfilled, (state, action) => {
                state.status = "success"
                state.email = action.payload.email
                state.name = action.payload.name
            }),

            builder.addCase(getUserInfo.rejected, (state) => {
                state.status = "error"
            })
    }
})




export const { clear, updateName } = userInfoSlice.actions

export const userInfoSelector = (state: RootState) => state.userInfo

export const userInfo = {
    name: userInfoSlice.name,
    reducer: userInfoSlice.reducer
}