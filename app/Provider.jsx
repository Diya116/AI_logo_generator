"use client"
import React from 'react'
import Header from './_components/Header'
import { useEffect,useState } from "react";
import { useUser } from '@clerk/nextjs';
import  axios  from 'axios';
import {UserDetailContext} from "./_context/UserDetailContext"
function Provider({ children }) {   
  const {user}=useUser();
  const[userDetail,setUserDetail]=useState();
  const CheckUserAuth=async()=>{
    const result=await axios.post('/api/user',{
      userName:user?.fullName,
      userEmail:user?.primaryEmailAddress?.emailAddress
    })
    console.log(result.data);
    setUserDetail(result.data)
  }
  useEffect(()=>{
    user&&CheckUserAuth();
  },[user])
  return (
    <div>
      <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
      <Header />
      <div className='px-10 lg:px-32 xl:px-48 2xl:px-56'>
        {children}  
      </div>
      </UserDetailContext.Provider>
    </div>
  )
}

export default Provider
