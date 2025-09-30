"use client";
import { Button } from "../../components/ui/Button";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
function Header() {
  const { user } = useUser();
  return (
    <div className="px-10 lg:px-32 xl:px-48 2xl:px-56 p-4 flex justify-between">
      {/* <Image src={'/logo.svg'} alt='logo' width={80} height={70}/> */}
      <h2 className="text-black text-4xl font-bold">Logix</h2>
      <div className="flex items-center gap-3">
        {user ? (
          <Link href="/dashboard">
            <Button variant="outline" className='cursor-pointer'>Dashboard</Button>
          </Link>
        ) : (
          <SignInButton mode="modal" forceRedirectUrl={"/"}>
            <Button className="mt-5 cursor-pointer">Login/Signup</Button>
          </SignInButton>
        )}
        {/* <Button>Get Started</Button> */}
        <UserButton />
      </div>
    </div>
  );
}

export default Header;
