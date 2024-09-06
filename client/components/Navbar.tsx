import Link from 'next/link'
import React from 'react'
import { ShoppingCartIcon, User } from 'lucide-react';
const Navbar = () => {
  return (
    <div className='bg-[#F6E3FF] text-black'>
        <div className=' flex justify-around items-center mx-auto w-4/5 py-4'>
            <h1 className='font-bold text-[1.5rem]'>SUPREME TEAM</h1>
            <div className='flex gap-[3rem]'>
                <Link className='nav-item' href={""}>HOME</Link>
                <Link className='nav-item' href={"/products/jacket"}>JACKET</Link>
                <Link className='nav-item' href={""}>HELP</Link>
            </div>
            <div className='flex gap-[2rem]'>
                <User />
                <ShoppingCartIcon />
            </div>
        </div>
    </div>
  )
}

export default Navbar
