import React, { useEffect, useRef, useState } from 'react'
import UserConversation from '../../zustans/UserConversation';
import { useAuth } from '../../context/AuthContext';
import { TiMessages } from "react-icons/ti";
import { IoArrowBackSharp } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import axios from 'axios';
import { useSocketContext } from '../../context/SocketContext';
import notify from '../../assets/sound/notification.wav';

const MessageContainer = ({ onBackUser }) => {
  const { messages, selectedConversation, setMessage, setSelectedConversation } = UserConversation();
  const {socket}=useSocketContext()
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sending,setSending]=useState(false);
  const [sendData,setSendData]=useState("")
  const lastMessageRef =useRef();


  // now i am using useEfeect for scoketio means realtime chat show karane ke liye
  useEffect(()=>{
   socket?.on("newMessage",(newMessage)=>{
    const sound = new Audio(notify)
    sound.play();
    setMessage(([...messages,newMessage]))
   })

   return ()=> socket?.off("newMessage")
  },[socket, setMessage, messages]);


  // lastmesssage tak dikhane ke liye scroll ja sake direct last message pe
  useEffect(()=>{
    setTimeout(()=>{
      lastMessageRef?.current?.scrollIntoView({behavior:"smooth"})
    },100)
  },[messages]);

  // mesahes ko show karane ke liye useeffect use kar rha hu
  useEffect(() => {
    const getMessages = async () => {
      setLoading(true)

      try {
        const get = await axios.get(`/api/message/${selectedConversation?._id}`);
        const data = await get.data;
        if (data.success === false) {
          setLoading(false)
          console.log(data.message)
        }
        setLoading(false)
        setMessage(data)


      } catch (error) {
        setLoading(false);
        console.log(error)
      }

    }
    if (selectedConversation?._id) getMessages();

  }, [selectedConversation?._id, setMessage])
  console.log(messages);

const handleMessage=(e)=>{
setSendData(e.target.value);
}
// now message send karne ke liye 
const handleSubmit=async(e)=>{
  e.preventDefault();
setSending(true)
try {
  const res = await axios.post(`/api/message/send/${selectedConversation?._id}`,{message:sendData});
  const data = await res.data;
  if (data.success === false) {
    setSending(false)
    console.log(data.message)
  } 
  setSending(false)
  setSendData('')// message bhejne ke bad empty aaraye taki jagah pura khali ho 
   setMessage([...messages,data])


} catch (error) {
  setSending(false)
  console.log(error)
}
}

  return (
    <div className='md:min-w-[500px] h-[99%] flex flex-col py-2'>
      {selectedConversation === null ? (
        <div className='flex items-center justify-center w-full h-full'>
          <div className='px-4 text-center text-2xl text-gray-950 font-semibold flex flex-col items-center gap-2'>
            <p className='text-2xl'>Welcome!!😎 {authUser.username}😊😂❤️</p>
            <p className='text-lg'>Select a chat to start messaging</p>
            <TiMessages className='text-6xl text-center' />
          </div>
        </div>
      ) : (
        <>
          <div className='flex justify-between gap-1 bg-sky-600 rounded-lg h:10 md:h-12'>
            <div className='flex gap-2 md:justify-between items-center w-full'>
              <div className='md:hidden ml-1 self-center'>
                <button onClick={() => onBackUser(true)}
                  className='bg-white rounded-full px-2 py-1 self-center'>
                  <IoArrowBackSharp size={25} />

                </button>
              </div>
              <div className='flex justify-between mr-2 gap-2'>
                <div className='self-center'>
                  <img className='rounded-full w-6 h-6 md:w-10 md:h-10 cursor-pointer'
                    src={selectedConversation?.profilepic}        >
                  </img>
                </div>
                <span className='text-gray-950 self-center text-sm md:text-xl font-bold'>
                  {selectedConversation?.username}
                </span>
              </div>
            </div>
          </div>


          <div className='flex-1 overflow-auto'>
            {loading && (
              <div className='flex w-full h-full flex-col items-center justify-center gap-4 bg-transparent'>
                <div className='loading loading-spinner'></div>
              </div>
            )}
            {!loading && messages?.length === 0 && (
              <p className='text-center text-white items-center'>
                Send a message to start a Conversation
              </p>
            )}
            {!loading && messages?.length > 0 && messages?.map((message) => (

              <div className='text-white' key={message?._id} ref={lastMessageRef}>
             <div className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}>
              <div className='chat-image avatar'></div>
              <div className={`chat-bubble  ${message.senderId === authUser._id ? 'bg-sky-600' : ''}`}>
                {message?.message}
              </div>
              
                {/* <div className='chat-footer text-[10px] opacity-80'>
                  {new Date(message?.createdAt).toLocalDateString('en-IN')}
                  {new Date(message?.createdAt).toLocalDateString('en-IN',{hour:'numeric',minute:'numeric'})}
                </div> */}
                <div className='chat-footer text-[10px] opacity-80 text-white'>
                   {new Date(message?.createdAt).toLocaleDateString('en-IN')}
                          {" "}
                         {new Date(message?.createdAt).toLocaleTimeString('en-IN', {
                             hour: 'numeric',
                            minute: 'numeric',
                               })}
                         </div>


             </div>
             </div>
         ))}
          </div>
          <form onSubmit={handleSubmit}
          className='rounded-full text-black'>
            <div className='w-full rounded-full flex items-center bg-white'>
              <input value={sendData}
               onChange={handleMessage} 
               required id='messaage' type='text'
              className='w-full bg-transparent outline-none px-4 rounded-full'/>
              <button type='submit'>
                {sending ? <div className='loading loading-spinner'></div>
                :<IoSend  size={25}
                className='text-sky-700 cursor-pointer rounded-full bg-gray-800 w-10 h-auto p-1'/>}
              </button>
            </div>
          </form>

        </>
      )
      }
    </div>
  )
}

export default MessageContainer
