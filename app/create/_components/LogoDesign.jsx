import React from "react";
import Lookup from "../../_data/Lookup";
import LogoDesignData from "../../_data/LogoDesignData";
import HeadingDescription from "./HeadingDescription";
import Image from "next/image";
import { useState } from "react";
function LogoDesign({ onHandleInputChange, formData }) {
  const [selectedOption, setSelectedOption] = useState(formData?.design?.title);
  return (
    <div className="my-10">
      <HeadingDescription
        title={Lookup.LogoDesignTitle}
        description={Lookup.LogoDesignDesc}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mt-5">
        {LogoDesignData.map((design, index) => (
          <div
            key={index}
            className={`p-2 cursor-pointer hover:border-2 border-primary rounded-md ${
              selectedOption === design.title &&
              "border-primary border-2 rounded-md"
            }`}
            onClick={() => {
              setSelectedOption(design.title);
              onHandleInputChange(design);
            }}
          >
            <Image
              src={design.image}
              alt={design.title}
              width={300}
              height={200}
              className="w-full rounded-xl object-cover h-[150px]"
            />
            <p className="text-center p-2 font-semibold">{design.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogoDesign;
