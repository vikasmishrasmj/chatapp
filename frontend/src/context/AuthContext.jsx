import { Children, createContext, useContext , useState } from "react";

export const AuthContext = createContext();

export const useAuth =()=>{
    return useContext(AuthContext)
}

export const AuthContextProvider =({children})=>{
    const [authUser,setAuthUser]=useState(JSON.parse(localStorage.getItem('chattapp')) || null );
    return <AuthContext.Provider value={{authUser ,setAuthUser}}>
        {children}

    </AuthContext.Provider>
}