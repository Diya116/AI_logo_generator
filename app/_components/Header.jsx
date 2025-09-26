"use client"
import { Button } from '../../components/ui/Button'
import React from 'react'
import Image from 'next/image'
import {UserButton,useUser} from "@clerk/nextjs"
function Header() {
  const {user}=useUser();
  return (
    <div className='px-10 lg:px-32 xl:px-48 2xl:px-56 p-4 flex justify-between'>
        {/* <Image src={'/logo.svg'} alt='logo' width={80} height={70}/> */}
        <h2 className='text-black text-4xl font-bold'>Logix</h2>
        <div className='flex items-center gap-3'>
          {user&&<Button variant="outline">Dashboard</Button>}
        <Button>Get Started</Button>
         <UserButton/>
        </div>
    </div>
  )
}

export default Header