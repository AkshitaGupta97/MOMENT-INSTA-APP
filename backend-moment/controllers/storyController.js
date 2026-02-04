import sharp from 'sharp';
import cloudinary from '../config/cloudinary.js';
import { Story } from '../model/story.model.js';
import { User } from '../model/user.model.js';
//import getDataUri from '../config/dataURI.js';

export const addStory = async (req, res) => {
    try {
        const image = req.file;
        const authorId = req.id;

        if (!image) {
            return res.status(401).json({
                message: '❌Image is required...',
                success: false
            });
        }

        // image upload => we are using "Sharp" which helps to optimize image quality
        const optimizeImageBuffer = await sharp(image.buffer)
        .resize({ width: 800, height: 800, fit: 'inside' })
        .toFormat('jpeg', { quality: 80} )
        .toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizeImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        const story = await Story.create({
            image: cloudResponse.secure_url,
            author: authorId
        });

        // push story to user model
        const user = await User.findById(authorId);
        if(user){
            user.stories.push(story._id);
            await user.save();
        }

        return res.status(200).json({
            success: true,
            message: '😊 Story added successfully...',
            story
        });

    } catch (error) {
        console.log('addStory Error', error);
        return res.status(500).json({
            message: '❌ Internal server error',
            success: false
        });
    }
};

export const getStories = async (req, res) => {
    try {
        const userId = req.id;

        // Get users that current user follows
        const user = await User.findById(userId).select('following');
        const followingIds = user.following || [];

        // Include current user's own stories
        followingIds.push(userId);

        // Get stories from following users that haven't expired
        const stories = await Story.find({
            author: { $in: followingIds },
            expiresAt: { $gt: new Date() }
        })
        .populate({path: 'author', select: 'username, profilePicture'})
        .populate({path: 'viewers', select: 'username'})
        .sort({createdAt: -1});

        return res.status(200).json({
            success: true,
            stories
        });

    } catch (error) {
        console.log('getStories Error', error);
        return res.status(500).json({
            message: '❌ Internal server error',
            success: false
        });
    }
};

export const viewStory = async (req, res) => {
    try {
        const storyId = req.params.id;
        const userId = req.id;

        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({
                message: '❌ Story not found',
                success: false
            });
        }

        // Check if user already viewed the story
        if (!story.viewers.includes(userId)) {
            story.viewers.push(userId);
            await story.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Story viewed successfully'
        });

    } catch (error) {
        console.log('viewStory Error', error);
        return res.status(500).json({
            message: '❌ Internal server error',
            success: false
        });
    }
};

export const deleteStory = async (req, res) => {
    try {
        const storyId = req.params.id;
        const userId = req.id;

        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({
                message: '❌ Story not found',
                success: false
            });
        }

        if (story.author.toString() !== userId) {
            return res.status(403).json({
                message: '❌ You can only delete your own stories',
                success: false
            });
        }

        // Remove story from user's stories array
        await User.findByIdAndUpdate(userId, { $pull: { stories: storyId } });

        // Delete the story
        await Story.findByIdAndDelete(storyId);

        return res.status(200).json({
            success: true,
            message: 'Story deleted successfully'
        });

    } catch (error) {
        console.log('deleteStory Error', error);
        return res.status(500).json({
            message: '❌ Internal server error',
            success: false
        });
    }
};