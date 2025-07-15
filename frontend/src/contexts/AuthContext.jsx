
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StatusCodes } from "http-status-codes";


export const AuthContext=createContext({});

const client=axios.create({
    baseURL:"http://localhost:3000/api/v1/users"
})

export const AuthProvider=({children})=>{
    const authContext=useContext(AuthContext);

    const [userData,setUserData]=useState();

    const router=useNavigate();

    const handleRegister=async(name,username,password)=>{
        try{
            let request=await client.post("/register",{
                name,
                username,
                password
            })

            if(request.status===StatusCodes.CREATED){
                return request.data.message;
            }
        }catch(err){
            throw err;
        }
    }
    const handleLogin=async(username,password)=>{
        try{
            let request=await client.post("/login",{
                username,
                password
            });

            if(request.status===StatusCodes.OK){
                localStorage.setItem("token",request.data.token);
                router("/home");
            }
        }catch(err){
            throw err;
        }
    }


    const data={
        userData,
        setUserData,
        handleRegister,
        handleLogin
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}