import React, { useState } from 'react'
import HeadingDescription from './HeadingDescription'
import Lookup from '../../_data/Lookup'
import Color from "../../_data/Color"
function LogoPalette({onHandleInputChange,formData}) {
  const [selectedOption,setSelectedOption]=useState(formData?.palette);
  return (
    <div className='my-10'>
      <HeadingDescription title={Lookup.LogoColorPaletteTitle} description={Lookup.LogoColorPaletteDesc} />
      <div className='grid grid-cols-2 md:grid-cols-3 mt-5 gap-5 ' >
        {
          Color.map((palette,index)=>(
            <div className={`flex cursor-pointer p-2 border-2 b ${selectedOption===palette.name&&' border-2 border-primary p-2 rounded-lg'}`} key={index} 
            onClick={()=>{setSelectedOption(palette.name);onHandleInputChange(palette.name)}}>
              {
                palette?.colors.map((color,index)=>(
                  <div key={index} style={{backgroundColor:color}} className='w-full h-24'> </div>
                ))
              }
            </div>
          ))
          
        }
      </div>
    </div>
  )
}

export default LogoPalette
