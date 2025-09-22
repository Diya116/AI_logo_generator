"use client";
import React, { useState } from "react";
import LogoTitle from "./_components/LogoTitle";
import { Button } from "../../components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import LogoDesc from "./_components/LogoDesc";
import LogoIdea from "./_components/LogoIdea";
import LogoDesign from "./_components/LogoDesign";
import LogoPalette from "./_components/LogoPalette";
function CreateLogo() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState();
  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  console.log(formData)
  return (
    <div className="mt-28 p-10 border rounded-xl 2xl:mx-72">
      {step == 1 ? (
        <LogoTitle
          onHandleInputChange={(v) => onHandleInputChange("title", v)}
          formData={formData}
        />
      ): step == 2 ? (
        <LogoDesc onHandleInputChange={(v) => onHandleInputChange("desc", v)}
        formData={formData} />
      ) :  step == 3 ? (
        <LogoPalette onHandleInputChange={(v) => onHandleInputChange("palette", v)} 
        formData={formData}/>
      ) : step == 4 ? (
        <LogoDesign
          onHandleInputChange={(v) => onHandleInputChange("design", v)}
          formData={formData}
        />
      ) : step == 5 ? (
        <LogoIdea
          onHandleInputChange={(v) => onHandleInputChange("idea", v)}
          formData={formData}
        />
      ) : null}

      <div className="flex items-center justify-between mt-5">
        {step !== 1 && (
          <Button variant="outline" onClick={()=>{setStep((prev)=>prev-1)}} className='cursor-pointer'>
            <ArrowLeft />
            Previous
          </Button>
        )}
        {step !== 5 && (
          <Button variant="outline" onClick={()=>{setStep((curr)=>curr+1)}}  className='cursor-pointer'>
            <ArrowRight />
            Next
          </Button>
        )}
      </div>
    </div>
  ); /*  */
}

export default CreateLogo;
