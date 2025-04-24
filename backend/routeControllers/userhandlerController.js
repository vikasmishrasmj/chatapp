import Conversation from "../Models/conversationModel.js";
import User from "../Models/userModels.js";

export const getUserBySearch= async(req,resp)=>{
    try {
        const search = req.query.search || "";
        const currentUserId = req.user._id;
        console.log("Current User ID =>", currentUserId);
        const user = await User.find({
            $and:[
                {
                    $or:[
                        //{username:{$regex:'.*'|+search+'.*',$options:'i'}},
                       // {fullname:{$regex:'.*'|+search+'.*',$options:'i'}}
                       { username: { $regex: `.*${search}.*`, $options: "i" } },
                       { fullname: { $regex: `.*${search}.*`, $options: "i" } }

                    ]
                },{
                    _id:{$ne:currentUserId}
                }
            ]
        }).select("-password").select("email")

         resp.status(200).send(user)

    } catch (error) {
        resp.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}

// mow for showing current chats

export const getCurrentChats = async(req,resp)=>{
     try {
        const currentUserId = req.user._id;
        const currentchats = await Conversation.find({
            participants:currentUserId
        }).sort({
            updatedAt:-1// jpo recent me chat hua wo sabse pehle
        });

        if(!currentchats || currentchats.length === 0) return resp.status(200).send([]);
      ////  const participantsIDS = currentchats.reduce((ids,conversation)=>{
           // const otherparticipants = conversation.participants.filter(id =>id !==currentUserId)
           // return[...ids , ...otherparticipants]
       // },[])
       const participantsIDS = currentchats.reduce((ids, conversation) => {
        const otherparticipants = conversation.participants.filter(
            id => id && currentUserId && id.toString() !== currentUserId.toString()
        );
        return [...ids, ...otherparticipants];
    }, []);
    

           const otherparticipantsIDS = participantsIDS.filter(id => id.toString() !== currentUserId.toString());

           const user = await User.find({_id:{$in:otherparticipantsIDS}}).select("-password").select("-email");

           const users = otherparticipantsIDS.map(id=> user.find(user => user._id.toString() === id.toString() ));
           resp.status(200).send(users) 

        

     } catch (error) {
        resp.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
     }
}