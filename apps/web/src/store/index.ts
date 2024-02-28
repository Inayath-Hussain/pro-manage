import { configureStore } from "@reduxjs/toolkit";
import { userInfo } from "./slices/userInfoSlice";


export const store = configureStore({
    reducer: {
        [userInfo.name]: userInfo.reducer
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch