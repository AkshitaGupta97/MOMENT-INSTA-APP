import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique:true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique:true},
    profilePicture:{type:String, default:""},
    bio: {type: String, default:""},
    gender: {type: String, enum:['male', 'female']},
    following: [{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
    followers: [{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
    posts: [{type:mongoose.Schema.Types.ObjectId, ref:"Post"}],
    bookmarks:[{type:mongoose.Schema.Types.ObjectId, ref:"Post"}],
}, {timestamps: true}); // by default create time of [createdAt, updatedAt]

export const User = mongoose.model('User', userSchema);
