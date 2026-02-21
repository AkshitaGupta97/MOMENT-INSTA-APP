import { createSlice } from '@reduxjs/toolkit';

const realtimenotificationSlice = createSlice({
  name: 'realTimeNotification',
  initialState: {
    likeNotification: [],
  },
  reducers: {

    // When user likes post
    setLikeNotification: (state, action) => {
      console.log("Incoming Notification:", action.payload);

      // Prevent duplicate notifications => "Does any notification already exist with same post AND same sender?"
      const exists = state.likeNotification.some(
        (item) =>
          item.post === action.payload.post &&
          item.sender === action.payload.sender
      );

      if (!exists) {
        state.likeNotification.unshift(action.payload);  //unshift() adds to beginning of array. So newest notifications appear first 👌
      }
    },

    // When user unlikes post
    removeLikeNotification: (state, action) => {
      state.likeNotification = state.likeNotification.filter(
        (item) =>
          !(
            item.post === action.payload.postId &&
            item.sender === action.payload.sender
          )
      );
    }

  }
});

export const {
  setLikeNotification,
  removeLikeNotification
} = realtimenotificationSlice.actions;

export default realtimenotificationSlice.reducer;

/*
User A likes post P:
likeNotification = [
  { post: "P", sender: "A" }
]
User A likes again (bug or double click):
→ .some() returns true
→ It won’t add duplicate
→ Clean state ✅



*/