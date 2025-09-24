"use client";
import React, { useEffect, useState } from "react";
import Lookup from "../../_data/Lookup";
import HeadingDescription from "./HeadingDescription";


function LogoTitle({ onHandleInputChange, formData }) {
  const [title,setTitle]=useState(formData?.title??"");
  return (
    <div className="my-10">
      <HeadingDescription
        title={Lookup.LogoTitle}
        description={Lookup.LogoTitleDesc}
      />
      <input
        type="text"
        placeholder={Lookup.InputTitlePlaceholder}
        className="p-4 border rounded-lg mt-5 w-full"
        value={title}
        onChange={(e) => {onHandleInputChange(e.target.value);setTitle(e.target.value)}}
      />
    </div>
  );
}

export default LogoTitle;
