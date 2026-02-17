import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name: 'socketio',
    initialState:{
        socket: null
    },
    reducers: {
        setSocketIo: (state, action) => {
            state.socket = action.payload
        }
    }
});

export const {setSocketIo} = socketSlice.actions;
export default socketSlice.reducer;