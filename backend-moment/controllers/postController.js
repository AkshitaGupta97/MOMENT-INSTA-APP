import sharp from 'sharp';
import cloudinary from '../config/cloudinary.js';
import { Post } from '../model/post.model.js';
import { User } from '../model/user.model.js';

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;  // image gets in buffer form
        const authorId = req.id;

        if (!image) {  // as for posting any thing we need image
            return res.status(401).json({
                message: '❌Image is required...',
                success: false
            });
        }

        // image upload => we are using "Sharp" which helps to optimize image quality
        const optimizeImageBuffer = await sharp(image.buffer)
        .resize({ width: 800, height: 800, fit: inside })
        .toFormat('jpeg', { quality: 80} )
        .toBuffer();
        console.log('check addnewPost-> optimizeImage', optimizeImageBuffer);
        
        const fileUri = `data:image/jpeg;base64,${optimizeImageBuffer.toString('base64')}`; // optimized image in converted into uri
        console.log('check addnewPost-> fileUri', fileUri);
        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });

        // push post to user model
        const user = await User.findById(authorId);
        if(user){
            user.posts.push(post._id); // push post value in user "posts"
            await user.save();
        }

        // get details of post as : their name, email and more
        await post.populate({path: 'author', select:'-password'}); // get author in Post value as we have ref of user. by this we get details of user but not password

        return res.status(200).json({
            success: true,
            message: '😊 New post added...',
            post
        });

    } catch (error) {
        console.log('addNewPost Error', error);
    }
}

// get all post
export const getAllPost = async(req, res) => {
    try {
        // fetch post as the recent post is at top. as "stack concept" -> sort({createdAt:-1})
        const post = await Post.find().sort({createdAt:-1})
        .populate({path:'author', select:'username, profilePicture' }) // by using 'populate' we get 'username, profilePicture' of post, and comments in the each post
        .populate({   // in comments get author name and details, as who made comment
            path:'comments', 
            sort:{createdAt:-1},
            populate:{   // get name and psaaword of user who made comments
                path:'author',
                select: 'username, profilePicture'
            }
        });
        return res.status(200).json({
            success: true,
            post
        });

    } catch (error) {
        console.log('getAllPost Error', error);
    }
};

// get number of posts you made
export const getUserPost = async(req, res) => { // find({author: authorId}) only get posts you made
    try {
        const authorId = req.id;
        const posts = await Post.find({author: authorId}).sort({createdAt:-1}).populate({   // in posts get author name and details, as who made comment
            path:'author',  // option-> commnets
            sort:{createdAt:-1},
            populate:{   // get name and psaaword of user who made comments
                path:'author',
                select: 'username, profilePicture'
            }
        });
        return res.status(200).json({
            success: true,
            posts
        });
        
    } catch (error) {
        console.log('getUserPost Error', error);
    }
};

// to like  posts
export const likePost = async(req, res) => {
    try {
        const likeKarneWalaUser = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if(!post){
            return res.status(401).json({
                message: "😥Sorry Post not found...",
                status: false
            });
        }

        // like logic. ==  $addToSet -> by this you can store unique value, not duplicated, only once value is stored
        await post.updateOne({$addToSet: {likes: likeKarneWalaUser} }); // it means in 'likes' of post go and update the likes and give id who liked the post.
        await post.save();

        // implement socket io for real time notification


        return res.status(200).json({
            success: true,
            message: '😊 Post Liked...',
        });

    } catch (error) {
        console.log('likePost Error', error);
    }
}

// dislike post
export const dislikePost = async(req, res) => {
    try {
        const dislikeKarneWalaUser = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if(!post){
            return res.status(401).json({
                message: "😥Sorry Post not found...",
                status: false
            });
        }

        // dislike logic. ==  $pull -> by this you can remove value or pull it
        await post.updateOne({$pull: {likes: dislikeKarneWalaUser} }); 
        await post.save();

        return res.status(200).json({
            success: true,
            message: '😥Post disliked...',
        });


    } catch (error) {
        console.log('dislikePost Error', error);
    }
}

