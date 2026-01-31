import { User } from "../model/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from "../config/dataURI.js";
import cloudinary from "../config/cloudinary.js";

// controller for register
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: '❌Please fill all details...',
                success: false
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: '❌Try differnt email...',
                success: false
            });
        }
        // use safe password
        const hashedPassword = await bcrypt.hash(password, 8);
        await User.create({
            username,
            email,
            password: hashedPassword
        })
        return res.status(201).json({
            message: "😊Account created successfully...",
            status: true
        });
    } catch (error) {
        console.log('Register Error', error);
    }
}

// controller for login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: '❌Please fill all details...',
                success: false
            });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: '❌Invalid details...',
                success: false
            });
        }
        // check whether password is same
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.status(401).json({
                message: '❌Invalid password...',
                success: false
            });
        }
        user = {
            _id: user_id,
            username: username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            following: user.following,
            followers: user.followers,
            posts: user.posts
        }
        // create token
        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KET, { expiresIn: '1d' });

        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `😊Welcome back ${user.username}`,
            success: true,
            user
        });

    } catch (error) {
        console.log('Login Error', error);
    }
}

// controller for logout
export const logout = async (_, res) => {
    try {
        return res.cookie('token', "", { maxAge: 0 }).json({
            message: "😊Logged out successfully...",
            success: true
        })
    } catch (error) {
        console.log('Logout Error', error);
    }
}

// controller for getProfile
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById({ userId });
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log('getProfile Error', error);
    }
}

// controller editProfile 
export const editProfile = async (req, res) => {
    try {
        const userId = req.id; // comes from middleware
        const {bio, gender} = req.body;
        const{profilePicture} = req.file;  // images, video are file so we get it from req.file

        let cloudResponse;

        if(profilePicture){
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById({userId});
        if(!user){
            return res.status(401).json({
                message: '❌User not found...',
                success: false
            });
        }

        if(bio) urer.bio = bio;
        if(gender) user.gender = gender;
        if(profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(201).json({
            message: "😊Profile Updated...",
            status: true
        });

    } catch (error) {
        console.log('editProfile Error', error);
    }
}

// function to get suggested user
export const getSuggestedUser = async(req, res) => {
    try {
        const suggestedUser = await User.find({_id:{$ne:req.id}}).select("-passsword");  // $ne -> not equal, we want suggested user which is not equal to userId, and select them on basis of removing their password.
        if(!suggestedUser){
            return res.status(401).json({
                message: '❌Currently do not have any user...',
                success: false
            });
        }
        return res.status(201).json({
            users:suggestedUser,
            status: true
        });
    } catch (error) {
        console.log('getSuggestedUser Error', error);
    }
}

// funtion to follow and unfollow
export const followUnfollow = async(req, res) => {
    try {
        const followKarneWala = req.id; // my id
        const whomToFollow = req.params.id; // other id
        if(followKarneWala === whomToFollow){
            return res.status(401).json({
                message: '❌You cannot follow/unfollow to yourself...',
                success: false
            });
        }
        
        const user = await User.findById({followKarneWala});
        const targetUser = await User.findById({whomToFollow});

        if(!user || !targetUser){
            return res.status(401).json({
                message: '❌User not found...',
                success: false
            });
        }
        // check whether to follow or unfollow
        const isFollowing = user.following.includes(whomToFollow); //if i follow someone then it must be added to my 'following'
        if(isFollowing){  // it means i have already followed them. if this is,  then give logic to unfollow, not follow
            await Promise.all([
                User.updateOne({_id:followKarneWala}, {$pull: {following: whomToFollow}}),
                User.updateOne({_id:whomToFollow}, {$pull: {followers: followKarneWala}})
            ]);
            return res.status(201).json({
                message: "😥Unfollowed successfully...",
                status: true
            });
        }
        else {  // if we didnot follow them then give follow logic
            await Promise.all([
                User.updateOne({_id:followKarneWala}, {$push: {following: whomToFollow}}),
                User.updateOne({_id:whomToFollow}, {$push: {followers: followKarneWala}})
            ]);
            return res.status(201).json({
                message: "😊Followed successfully...",
                status: true
            });
        }


    } catch (error) {
        console.log('followUnfollow Error', error);
    }
}
