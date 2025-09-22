import React,{useState} from 'react'
import Lookup from '../../_data/Lookup'
import HeadingDescription from './HeadingDescription'
import { useSearchParams } from 'next/navigation'

function LogoTitle({onHandleInputChange,formData}) {
  const searchParams=useSearchParams();
  const [title,setTitle]=useState(searchParams?.get('title')??"")
  return (
    <div className='my-10'>
      <HeadingDescription title={Lookup.LogoTitle} description={Lookup.LogoTitleDesc} />
      <input type="text"  
      placeholder={Lookup.InputTitlePlaceholder} 
      className='p-4 border rounded-lg mt-5 w-full'
      value={title}
      onChange={(e)=>onHandleInputChange(e.target.value)}/>
    </div>
  )
}

export default LogoTitle