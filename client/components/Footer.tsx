import { SendIcon, TwitterIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const Footer = () => {
    const LinksData = [
        {
			name: "HOME",
			url: "/"
		}, 
		{
			name: "SUPREME JACKET",
			url: "/products/jacket"
		}, 
        {
			name: "HELP",
			url: "/"
		},
		
	];

    const LinksData2 = [
        {
			name: "POLICIES", 
			url: "/"
		},
        {
			name: "RETURN POLICY", 
			url: "/"
		},
        {
			name: "SHIPPING POLICY", 
			url: "/"
		},
        {
			name: "PRIVACY POLICY", 
			url: "/"
		},
        {
			name: "TERMS OF SERVICE", 
			url: "/"
		},
    ]
  return (
    <div className='text-white bg-black'>
		<div className=' lg:w-4/5 mx-auto flex flex-col lg:flex-row justify-center gap-[2rem] lg:gap-[4rem]'>
			<div className='px-[2rem] lg:w-[40%] border-b lg:border-r py-[2rem] lg:py-[4rem] border-white flex items-center lg:items-start lg:flex-col justify-between'>
				<h1 className='text-[1.5rem] lg:text-[3rem]'>SUPREME TEAM</h1>
				<div className='flex flex-col gap-2 mt-[3rem]'>
                    {LinksData.map(link => {
                        return (
                            <Link className={`nav-item | ${link.name == "HOME" ? "text-[1rem] font-semibold" : ""} text-[0.8rem]`} href={link.url} key={link.name}>{link.name}</Link>
                        )
                    })}
                </div>
			</div>
			<div className='px-[2rem] lg:w-[40%] lg:py-[4rem] lg:pr-[4rem] lg:border-r  border-white'>
				<div className='grid grid-cols-2 gap-y-[2rem] lg:flex justify-between'>
					
					<div className='flex flex-col gap-2'>
						{LinksData2.map(link => {
							return (
								<Link className={`nav-item | ${link.name == "POLICIES" ? "text-[1rem] font-semibold" : ""} text-[0.8rem]`} href={link.url} key={link.name}>{link.name}</Link>
							)
						})}
					</div>
					<div className="pb-[2rem] flex flex-col">
						<Link className='nav-item | text-[0.8rem] text-[#A9A6A6]' href={"/privacy-policy"} >PRIVACY POLICY</Link>
						<Link className='nav-item | text-[0.8rem] text-[#A9A6A6]' href={"/terms-of-use"} >TERMS OF USE</Link>
					</div>
				</div>
		
			</div>
		</div>
		<div className='block lg:hidden px-[2rem] py-[1rem] border-t border-[#e5e5e5]'>
			<p className='text-[0.7rem] lg:text-[1rem]'>© DWF LABS ALL RIGHTS RESERVED 2024</p>
		</div>
    </div>
  )
}

export default Footer
