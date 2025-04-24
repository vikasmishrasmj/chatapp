import React from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"


export const VerifyUser = ()=>{
    const {authUser} = useAuth();
    return authUser ? <Outlet/> : <Navigate  to={'/login'}/>
}