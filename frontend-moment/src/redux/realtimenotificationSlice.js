import {createSlice} from '@reduxjs/toolkit';

const realtimenotificationSlice = createSlice({
    name: 'realTimeNotification',
    initialState: {
        likeNotification: [], // [1, 2, 3] userid
    },
    reducers: {
        setLikeNotification: (state, action) => {
            console.log("Incoming Notification:", action.payload);

            if(action.payload.type === 'like'){
                state.likeNotification.push(action.payload);
            }
            else if(action.payload.type === 'dislike'){
                state.likeNotification = state.likeNotification.filter((item) => item.userId !== action.payload.userId); // it means the user who did not like/ dislike the post don't show them
            }
        }
    }
});

export const {setLikeNotification} = realtimenotificationSlice.actions;
export default realtimenotificationSlice.reducer;
