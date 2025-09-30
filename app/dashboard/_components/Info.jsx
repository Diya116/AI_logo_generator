"use client"
import { UserDetailContext } from '../../_context/UserDetailContext'
import React,{useContext} from 'react'
import { Button } from '../../../components/ui/Button';
import Link from 'next/link';
function info() {
    const {userDetail,setUserDetail}=useContext(UserDetailContext);
    console.log({userDetail});
  return (
    <div>
        <div className='flex justify-between'>
            <h2 className='font-bold text-3xl text-primary'>Hello,{userDetail?.name}</h2>
            <div>
                <Link href='/create'>
                <Button className='cursor-pointer'>+ Create New Logo</Button>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default info