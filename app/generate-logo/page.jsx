"use client";
import React from "react";
import Prompt from "../_data/Prompt";
import { useEffect, useState,useContext } from "react";
import { UserDetailContext } from "../_context/UserDetailContext";
import { generateFinalprompt } from "../../config/aiModel"
import axios from 'axios'
function page() {
  const [formData, setFormData] = useState();
  const {userDetail,setUserDetail}=useContext(UserDetailContext)
  useEffect(() => {
    if (typeof window != undefined && userDetail?.email) {
      const storage = localStorage.getItem("formData");
      if (storage) {
        setFormData(JSON.parse(storage))
        console.log(JSON.parse(storage));
      }
    }
  }, [userDetail]);
  useEffect(()=>{
    if(formData?.title)
    {
      GenerateAILogo();
    }
  })
  const GenerateAILogo=async()=>{
    const PROMPT=Prompt.LOGO_PROMPT.replace('{logoTitle}',formData?.title)
    .replace('{logoDesc}',formData?.desc)
    .replace('{logoColor}',formData?.palette)
    .replace('{logoIdea}',formData?.idea)
    .replace('{logoDesign}',formData?.design?.title)
    .replace('{logoPrompt}',formData?.design?.prompt);
    console.log(PROMPT);
    const result=await axios.post('/api/ai-logo-generate',{
      prompt:PROMPT
    })
    console.log(result);
  }
  return (
    <div>
      <h1>i will generte your logo shortly...........</h1>
    </div>
  );
}

export default page;
