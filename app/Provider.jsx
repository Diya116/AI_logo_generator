"use client"
import React from 'react'
import Header from './_components/Header'

function Provider({ children }) {   // ✅ use children (small c)
  return (
    <div>
      <Header />
      <div className='px-10 lg:px-32 xl:px-48 2xl:px-56'>
        {children}   {/* ✅ correct */}
      </div>
    </div>
  )
}

export default Provider
