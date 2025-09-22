import { Button } from '../../components/ui/button'
import React from 'react'
import Image from 'next/image'
function Header() {
  return (
    <div className='px-10 lg:px-32 xl:px-48 2xl:px-56 p-4 flex justify-between'>
        <Image src={'/logo.svg'} alt='logo' width={80} height={70}/>
        <Button>Get Started</Button>
    </div>
  )
}

export default Header