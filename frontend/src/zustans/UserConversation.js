import {create} from 'zustand'

const UserConversation = create((set)=>({
       selectedConversation:null,
       setSelectedConversation:(selectedConversation)=>set({selectedConversation}),
       messages:[],
       setMessage:(messages)=>set({messages})
}))
export default UserConversation;