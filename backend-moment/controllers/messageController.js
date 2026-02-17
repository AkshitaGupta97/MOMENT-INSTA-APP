import { Conversation } from "../model/conversation.model.js";
import { Message } from "../model/message.model.js";
import { getReciverSocketId, io } from "../socket/socketIo.js";

// function for chatting
export const sendMessage = async(req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {message} = req.body;

        // check if conversation already exists
        let conversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId] },   // $all means every data is present
        });
        // estalblish the conversation if not started
        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        if(newMessage) conversation.message.push(newMessage._id); // if message exists then push them to {messsage in conversation}

        await Promise.all([conversation.save(), newMessage.save()]); // using promise.all as both calls must be replaced

        // implement socket io for real time data transfer
        const receiverSocketId = getReciverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        return res.status(201).json({
            success: true,
            newMessage
        });

    } catch (error) {
        console.log('sendMessage Error', error);
    }
}

// get message function
export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.find({
            participants: {$all : [senderId, receiverId]}
        });
        if(!conversation){
            return res.status(200).json({success: true, messages: []}); // it means if message is not started then give the empty array
        }

        return res.status(200).json({success: true, messages: conversation?.messages});

    } catch (error) {
        console.log('getMessage Error', error);
    }
}



