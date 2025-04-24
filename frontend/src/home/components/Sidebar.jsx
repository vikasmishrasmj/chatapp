import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { IoArrowUndo } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import UserConversation from '../../zustans/UserConversation';
import { useSocketContext } from '../../context/SocketContext';

const Sidebar = ({ onSelectUser }) => {

    const navigate = useNavigate();
    const { authUser, setAuthUser } = useAuth();
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchUser] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [newMessageUsers,setNewmessageUsers]=useState('')
    const {messages,setMessage, selectedConversation, setSelectedConversation } = UserConversation();
    const { onlineUser, socket } = useSocketContext();

    const nowOnline = chatUser.map((user) => (user._id));
    // chats function here we are checking we are online are not
    const isOnline = nowOnline.map(userId => onlineUser.includes(userId));

useEffect(()=>{
   socket?.on("newMessage",(newMessage)=>{
   setNewmessageUsers(newMessage)
   })

   return ()=> socket?.off("newMessage")
  },[socket,messages]);





    // its shows users with you chat
    useEffect(() => {
        const chatUserHandler = async () => {
            setLoading(true)
            try {
                const chatapp = await axios.get(`/api/user/currentchats`);
                const data = chatapp.data;

                if (data.success === false) {
                    setLoading(false)
                    console.log(data.message)
                }
                setLoading(false)
                setChatUser(data)

            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        }
        chatUserHandler()
    }, [])
    console.log(chatUser);


    // show user from the search result
    const handleSearchSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const search = await axios.get(`/api/user/search?search=${searchInput}`);
            const data = search.data;
            if (data.success === false) {
                setLoading(false)
                console.log(data.message)
            } setLoading(false)
            if (data.loading === 0) {
                toast.info("User not found")
            } else {
                setSearchUser(data)
            }
        } catch (error) {
            setLoading(false)
            console.log(error);

        }
    }

    // show which user is seleted
    const handleUserClick = (user) => {
        onSelectUser(user);
        setSelectedConversation(user);
        setSelectedUserId(user._id);
        setNewmessageUsers('')

    }

    // back from seacrch result
    const handleSearchback = () => {
        setSearchUser([]);
        setSearchInput('')
    }


    //logout  
    const handleLogOut = async () => {
        const confirmlogout = window.prompt("type 'username' to logout");
        if (confirmlogout === authUser.username) {
            setLoading(true)
            try {
                const logout = await axios.post('/api/auth/logout');
                const data = logout.data;
                if (data?.success === false) {
                    setLoading(false)
                    console.log(data?.message)
                }
                toast.info(data?.message);
                localStorage.removeItem('chatapp');
                setAuthUser(null);
                setLoading(false);
                navigate('/login')
            } catch (error) {
                setLoading(false)
                console.log(error)
            }
        } else {
            toast.info("logout cancelled")
        }

    }



    console.log(searchUser);
    console.log(loading);
    return (
        <div className='h-full w-auto px-1'>
            <div className='flex justify-between gap-2'>
                <form onSubmit={handleSearchSubmit}
                    className='w-auto flex items-center justify-between bg-white rounded-full'>
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        type='text'
                        className='px-4 w-auto bg-transparent outline-none rounded-full'
                        placeholder='search user'
                    />
                    <button className='btn btn-circle bg-sky-700 hover:bg-gray-950'>
                        <FaSearch />
                    </button>

                </form>

                <img
                    onClick={() => navigate(`/profile/${authUser._id}`)}
                    src={authUser?.profilepic}
                    className='self-center h-12 w-12 hover:scale-110 cursor-pointer' />

            </div>
            <div className='divider px-3'></div>
            {searchUser?.length > 0 ? (
                <>
                    <div className=' min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar'>
                        <div className='w-auto'></div>
                        {searchUser.map((user, index) => (
                            <div key={user._id}>

                                <div
                                    onClick={() => handleUserClick(user)}
                                    className={`
                                                    
                                                    flex gap-3 items-center rounded p-2 py-1 cursor-pointer
                                                   hover:bg-blue-500 transition duration-200
                                                           ${selectedUserId === user?._id ? 'bg-sky-500' : 'hover:bg-blue-500'

                                        }`}>
                                    {/* socket is online //here we are giving a css for showing user is online dot*/}
                                   
                                    <div className={`avatar ${isOnline[index] ? 'online' : ''} flex items-center justify-center`}>
                                        <div className='relative w-12 h-12'>
                                            <img
                                                src={user.profilepic}
                                                alt='user'
                                                className='rounded-full w-full h-full object-cover'
                                            />
                                            {isOnline[index] && (
                                                <span className='absolute top-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white'></span>
                                            )}
                                        </div>
                                    </div>
                                    <div className='flex flex-col flex-1'>
                                        <p className='font-bold text-white'>{user.username}</p>
                                    </div>

                                </div>
                                <div className='divider divide-solid px-3 h-[1px]'></div>
                            </div>
                        )
                        )}
                    </div>
                    <div className='mt-auto px-1 py-1 flex'>
                        <button onClick={handleSearchback}
                            className='bg-white rounded-full px-2 py-1 self-center'>
                            <IoArrowUndo size={30} />
                        </button>

                    </div>
                </>
            ) : (
                <>
                    <div className=' min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar'>
                        <div className='w-auto'>
                            {chatUser.length === 0 ? (
                                <>
                                    <div className='font-bold items-center flex flex-col text-xl text-yellow-500'>
                                        <h1>why are you alone</h1>
                                        <h1>search username to chat</h1>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {chatUser.map((user, index) => (
                                        <div key={user._id}>
                                            <div
                                                onClick={() => handleUserClick(user)}
                                                className={`
                                                    
                                                    flex gap-3 items-center rounded p-2 py-1 cursor-pointer
                                                   hover:bg-blue-500 transition duration-200
                                                           ${selectedUserId === user?._id ? 'bg-sky-500' : 'hover:bg-blue-500'

                                                    }`}>
                                                {/* socket is online //here we are giving a css for showing user is online dot*/}
                                              
                                                <div className={`avatar ${isOnline[index] ? 'online' : ''} flex items-center justify-center`}>
                                                    <div className='relative w-12 h-12'>
                                                        <img
                                                            src={user.profilepic}
                                                            alt='user'
                                                            className='rounded-full w-full h-full object-cover'
                                                        />
                                                        {isOnline[index] && (
                                                            <span className='absolute top-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white'></span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className='flex flex-col flex-1'>
                                                    <p className='font-bold text-white'>{user.username}</p>
                                                </div>
                                                <div>
                                                    {newMessageUsers.recieverId === authUser._id && newMessageUsers.senderId === user._id ?
                                                    <div className='rounded-full bg-green-700 text-sm text-white px-[4px]'>+1</div>:<></>
                                                      }
                                                </div>

                                            </div>
                                            <div className='divider divide-solid px-3 h-[1px]'></div>
                                        </div>
                                    )
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <div className='mt-auto px-1 py-1 flex'>
                        <button onClick={handleLogOut}
                            className=' hover:bg-red-600  w-10  cursor-pointer hover:text-white rounded-lg'>
                            <BiLogOut size={30} />
                        </button>
                        <p className='text-sm py-1'>Logout</p>
                    </div>
                </>
            )}

        </div>
    )
}

export default Sidebar





{/* <div className='w-12 rounded-full h-12'>
                                                        <img src={user.profilepic} alt='user.img' />
                                                    </div> */}