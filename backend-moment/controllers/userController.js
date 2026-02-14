import { User } from "../model/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from "../config/dataURI.js";
import cloudinary from "../config/cloudinary.js";
import { Post } from "../model/post.model.js";

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
            success: true
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
        // create token
        const token = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        );

        // populate each post id in the post array, when user login then give their each post
        const populatedPost = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if (post.author.equals(user._id)) {
                    return post;
                }
                return null;
            })
        );

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            following: user.following,
            followers: user.followers,
            posts: populatedPost
        }

        // Set cookie for auth token. For local development we allow cross-site
        // requests by using sameSite: 'none'. Some browsers require Secure when
        // sameSite is 'none' in production; we keep `secure: false` for localhost.
        // set cookie first
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
        });

        // then send response
        return res.status(200).json({
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
        res.cookie("token", "", {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: "/",
            expires: new Date(0),
        });

        return res.status(200).json({
            message: "😊Logged out successfully...",
            success: true,
        });

    } catch (error) {
        console.log("Logout Error", error);
    }
};


// controller for getProfile
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path: 'posts', createdAt:-1}).populate('bookmarks');
        console.log("User from backend getProfile", user);
        
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log('getProfile Error', error);
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.id;
        let user = await User.findById(userId).select('-password');
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log('getCurrentUser Error', error);
    }
}

// controller editProfile 
export const editProfile = async (req, res) => {
    try {
        const userId = req.id; // from isAuthenticated middleware
        const { bio, gender } = req.body;
        const profilePicture = req.file; // ✅ correct = images, video are file so we get it from req.file

        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture); // expects file
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: '❌ User not found'
            });
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (cloudResponse) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            success: true,
            message: '😊 Profile updated successfully',
            user
        });

    } catch (error) {
        console.error('editProfile Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


// function to get suggested user
export const getSuggestedUser = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select('-password'); // $ne -> not equal, we want suggested user which is not equal to userId, and select them on basis of removing their password.

        if (suggestedUsers.length === 0) {
            return res.status(200).json({
                success: true,
                users: [],
                message: 'No suggested users available'
            });
        }

        return res.status(200).json({
            success: true,
            users: suggestedUsers
        });

    } catch (error) {
        console.error('getSuggestedUser Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


// funtion to follow and unfollow
export const followUnfollow = async (req, res) => {
    try {
        const followKarneWala = req.id; // my id
        const whomToFollow = req.params.id; // other id

        if (followKarneWala.toString() === whomToFollow.toString()) {  // req.id is usually a string , user.following contains ObjectIds
            return res.status(401).json({
                message: '❌You cannot follow/unfollow to yourself...',
                success: false
            });
        }

        const user = await User.findById(followKarneWala);
        const targetUser = await User.findById(whomToFollow);

        if (!user || !targetUser) {
            return res.status(401).json({
                message: '❌User not found...',
                success: false
            });
        }
        // check whether to follow or unfollow
        const isFollowing = user.following.includes(whomToFollow); //if i follow someone then it must be added to my 'following'
        if (isFollowing) {  // it means i have already followed them. if this is,  then give logic to unfollow, not follow
            await Promise.all([
                User.updateOne({ _id: followKarneWala }, { $pull: { following: whomToFollow } }),
                User.updateOne({ _id: whomToFollow }, { $pull: { followers: followKarneWala } })
            ]);
            return res.status(201).json({
                message: "😥Unfollowed successfully...",
                status: true
            });
        }
        else {  // if we didnot follow them then give follow logic
            await Promise.all([
                User.updateOne({ _id: followKarneWala }, { $push: { following: whomToFollow } }),
                User.updateOne({ _id: whomToFollow }, { $push: { followers: followKarneWala } })
            ]);
            return res.status(201).json({
                message: "😊Followed successfully...",
                success: true
            });
        }


    } catch (error) {
        console.log('followUnfollow Error', error);
    }
}
