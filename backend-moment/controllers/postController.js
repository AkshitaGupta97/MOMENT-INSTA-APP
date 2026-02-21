import sharp from 'sharp';
import cloudinary from '../config/cloudinary.js';
import { Post } from '../model/post.model.js';
import { User } from '../model/user.model.js';
import { Comment } from '../model/Comment.model.js';
import { io } from "../socket/socketIo.js";
import { getReciverSocketId } from "../socket/socketIo.js";
import { Notification } from '../model/notification.model.js';

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
        .resize({ width: 800, height: 800, fit: 'inside' })
        .toFormat('jpeg', { quality: 80} )
        .toBuffer();
       // console.log('check addnewPost-> optimizeImage', optimizeImageBuffer);
        
        const fileUri = `data:image/jpeg;base64,${optimizeImageBuffer.toString('base64')}`; // optimized image in converted into uri
       // console.log('check addnewPost-> fileUri', fileUri);
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
        .populate({path:'author', select:'username profilePicture' }) // by using 'populate' we get 'username profilePicture' of post, and comments in the each post
        .populate({   // in comments get author name and details, as who made comment
            path:'comments', 
            sort:{createdAt:-1},
            populate:{   // get name and psaaword of user who made comments
                path:'author',
                select: 'username profilePicture'
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
        /*const posts = await Post.find({author: authorId}).sort({createdAt:-1}).populate({   // in posts get author name and details, as who made comment
            path:'author',  // option-> Comments
            sort:{createdAt:-1},
            populate:{   // get name and password of user who made comments
                path:'author',
                select: 'username, profilePicture'
            }
        });*/
        const posts = await Post.find({author: authorId}).sort({createdAt:-1})
            .populate({path:'author', select:'username profilePicture' }) // by using 'populate' we get 'username profilePicture' of post, and comments in the each post;
            .populate({   // in comments get author name and details, as who made comment
                path:'comments',
                populate:{
                    path:'author',
                    select: 'username profilePicture'
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
/*export const likePost = async(req, res) => {
    try {
        const userWhoLikeThePost = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if(!post){
            return res.status(401).json({
                message: "😥Sorry Post not found...",
                success: false
            });
        }

        // like logic. ==  $addToSet -> by this you can store unique value, not duplicated, only once value is stored
        await post.updateOne({$addToSet: {likes: userWhoLikeThePost} }); // it means in 'likes' of post go and update the likes and give id who liked the post.
        await post.save();

        // implement socket io for real time notification
        const user = await User.findById(userWhoLikeThePost).select('username profilePicture');
        const postOwnerId = post.author.toString(); //as if user like its own post then don't show message
        if(postOwnerId !== userWhoLikeThePost){
            // show notification who liked the post
            const notification = {
                type: 'like',
                userId: userWhoLikeThePost,
                userDetails: user,
                postId, 
                message: "Your Post was liked"
            }
            // send notification to owner of post
            const postOwnerSocketId = getReciverSocketId(postOwnerId);
            console.log("Post Owner Socket ID:", postOwnerSocketId);
            console.log("postOwnerId:", postOwnerId);
           
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({
            success: true,
            message: '😊 Post Liked...',
        });

    } catch (error) {
        console.log('likePost Error', error);
    }
}*/

export const likePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Add like, addToSet helps to prevent duplication
    await post.updateOne({ $addToSet: { likes: userId } });
     await post.save();
    const postOwnerId = post.author.toString();

    if (postOwnerId !== userId) {  // it means post is not liked by the user itself

      // Prevent duplicate notification
      const existing = await Notification.findOne({
        receiver: postOwnerId,
        sender: userId,
        post: postId,
        type: "like"
      });

      if (!existing) { //“Only create a notification if one does NOT already exist.”
        const newNotification = await Notification.create({
          receiver: postOwnerId,
          sender: userId,
          type: "like",
          post: postId,
        });

        const socketId = getReciverSocketId(postOwnerId);

        if (socketId) {
          io.to(socketId).emit("notification", newNotification);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Post liked",
    });

  } catch (error) {
    console.log("likePost error:", error);
  }
};
/*
existing means:
“Does a like notification already exist in the database for this exact action?”
It searches MongoDB for a document that matches:
👤 receiver → post owner
👤 sender → user who liked
📄 post → specific post
❤️ type → "like"
*/

// dislike post
/*export const dislikePost = async(req, res) => {
    try {
        const userWhoDislikeThePost = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if(!post){
            return res.status(401).json({
                message: "😥Sorry Post not found...",
                success: false
            });
        }

        // dislike logic. ==  $pull -> by this you can remove value or pull it
        await post.updateOne({$pull: {likes: userWhoDislikeThePost} }); 
        await post.save();

        // implement socket io for real time notification
        const user = await User.findById(userWhoDislikeThePost).select('username profilePicture');
        const postOwnerId = post.author.toString(); //as if user like its own post then don't show message
        if(postOwnerId !== userWhoDislikeThePost){
            // show notification who liked the post
            const notification = {
                type: 'dislike',
                userId: userWhoDislikeThePost,
                userDetails: user,
                postId, 
                message: "Your Post was disliked"
            }
            // send notification to owner of post
            const postOwnerSocketId = getReciverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({
            success: true,
            message: '😥Post disliked...',
        });

    } catch (error) {
        console.log('dislikePost Error', error);
    }
};*/

export const dislikePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "😥 Sorry Post not found...",
        success: false,
      });
    }

    // 1️⃣ Remove like from post
    await post.updateOne({
      $pull: { likes: userId }
    });

    const postOwnerId = post.author.toString();

    // 2️⃣ If not self action
    if (postOwnerId !== userId) {

      // 3️⃣ Delete existing like notification
      const deletedNotification = await Notification.findOneAndDelete({
        receiver: postOwnerId,
        sender: userId,
        post: postId,
        type: "like",
      });

      // 4️⃣ If post owner is online → emit removal
      const postOwnerSocketId = getReciverSocketId(postOwnerId);

      if (postOwnerSocketId && deletedNotification) {
        io.to(postOwnerSocketId).emit("removeNotification", {
          postId,
          sender: userId,
          type: "like",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "😥 Post unliked...",
    });

  } catch (error) {
    console.log("dislikePost Error", error);
  }
};
/*
Only send real-time remove notification if:
The post owner is online
A like notification was actually deleted from the database”
*/

// function to add Comments on post
export const addComment = async(req, res) => {
    try {
        const postId = req.params.id;
        const personWhoMadeComment = req.id;

        const {textMsg} = req.body;

        const post = await Post.findById(postId);
        if(!textMsg){
            return res.status(400).json({
                success: false,
                message: '❌Text is required...',
            });
        }

        const comment = await Comment.create({
            text: textMsg,
            author: personWhoMadeComment,
            post: postId
        });
        await comment.populate({
            path: 'author',
            select: 'username profilePicture',
        });
        // push comment to post model
        post.comments.push(comment._id);  // push comment id in post comments
        await post.save();

        return res.status(200).json({
            success: true,
            message: '😊 Comment added...',
            comment
        });

    } catch (error) {
        console.log('addComment Error', error);
    }
};

// logic for each post with different Comments -> get comments of each post
export const getCommentsOfPost = async(req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({post: postId}).populate('author', 'username profilePicture').sort({createdAt: -1});
        if(comments.length === 0){
            return res.status(400).json({
                success: false,
                message: '❌Sorry! No comments found in this post...',
            });
        }
        
        return res.status(200).json({success:true, comments});
        
    } catch (error) {
        console.log('getCommentsOfPost Error', error);
    }
}

// to delete the post
export const deletePost = async(req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                success: false,
                message: '❌Sorry! Post not found...',
            });
        }
        // check if logged-in user is owner of post
        if(post.author.toString() !== authorId){
            return res.status(403).json({
                success: false,
                message: '❌Unauthorized user...',
            });
        }
        // delete the post
        await Post.findByIdAndDelete(postId);
        // delete the post from Post, so that it would not be accessed -> remove postId from user
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId); // it means give all the post except this post
        await user.save();

        // after deleting the post, delete all the comments also
        await Comment.deleteMany({post: postId});

        return res.status(200).json({
            success: true,
            message: '😥Post deleted...',
        });

    } catch (error) {
        console.log('deletePost Error', error);
    }
}

// how to save or do bookmark to post
export const bookMarkPost = async(req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        const user = await User.findById(authorId);
        
        if(!post){
            return res.status(403).json({
                success: false,
                message: '❌Post not found...',
            });
        }

        // if user is already saved the post just do unsave
        if(user.bookmarks.includes(post._id)){
            await user.updateOne({$pull: {bookmarks:post._id}});  // {$pull: {bookmarks:post._id} it means pull the post._id from bookmarks of user.
            await user.save();
            return res.status(200).json({type:"unsaved", message:"😊Unsaved the post", success:true});
        }
        // if user didnot saved the post just do save
        else {
            await user.updateOne({$addToSet: {bookmarks: post._id}}); // {$addToSet: {bookmarks: post._id} it means add unique to post, means if once post is clicked it is saved and next time unsave it
            await user.save();
            return res.status(200).json({type:"saved", message:"😊saved the post", success: true});
        }
    } catch (error) {
        console.log('bookMarkPost Error', error);
    }
}



