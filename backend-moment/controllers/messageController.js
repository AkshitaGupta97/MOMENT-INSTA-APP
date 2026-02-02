import { Conversation } from "../model/conversation.model.js";
import { Message } from "../model/message.model.js";

// function for chatting
export const sendMessage = async(req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {message} = req.body;

        // check if conversation already exists
        let conversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId] },
        });
        // estalblish the conversation if not started
        if(conversation.length === 0){
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

        await Promise.all([conversation.save(), newMessage.save()]);


    } catch (error) {
        console.log('sendMessage Error', error);
    }
}

