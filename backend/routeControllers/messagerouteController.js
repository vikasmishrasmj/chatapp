  import Conversation from "../Models/conversationModel.js";
import Message from "../Models/messageSchema.js";
import { getRecieverSocketId, io } from "../Socket/socketio.js";
  
  export const sendMessage = async(req,resp)=>{
    try {
        const {message} = req.body;
        const {id:recieverId} = req.params;
        const senderId = req.user._id;

        let chats = await Conversation.findOne({
            participants:{$all:[senderId , recieverId]}
        })
        if(!chats){
            chats  = await Conversation.create({
                participants:[senderId , recieverId],
            })
        }

        const newMessages = new Message({
            senderId,
            recieverId,
            message,
            conversationId:chats._id
        })


        if(newMessages){
            chats.messages.push(newMessages._id)
        }

    // sare data and message save karne ke liye
     await Promise.all([chats.save(),newMessages.save()]);

     // socket IO function
     const  recieverSocketId = getRecieverSocketId(recieverId);
     if(recieverSocketId){
        io.to(recieverSocketId).emit("newMessage",newMessages)
     } 


    resp.status(201).send(newMessages)
        
    } catch (error) {
        resp.status(500).send({
            success: false,
            message: error
        })
        
    }

}

export const getMessages = async(req,resp)=>{
try {
    const {id:recieverId} = req.params;
    const senderId = req.user._id;
    const chats = await Conversation.findOne({
        participants:{$all:[senderId,recieverId]}
    }).populate("messages")// message show karne ke liye

    if(!chats) return resp.status(200).send([]);
    const message = chats.messages
    resp.status(200).send(message)

} catch (error) {
    resp.status(500).send({
        success: false,
        message: error
    })
    console.log(error);
}
}