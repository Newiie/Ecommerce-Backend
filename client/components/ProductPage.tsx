"use client"
import Image from 'next/image'
import { motion } from 'framer-motion'
import React, { useState } from 'react'

type PricingOption = {
  price: number;
  originalPrice: number;
  discount: string;
};

const ProductPage = () => {
  const [selectedColor, setSelectedColor] = useState('red')
  const [selectedStorage, setSelectedStorage] = useState('64GB')
  const [selectedOption, setSelectedOption] = useState('1') // Buy 1, Buy 2, or Buy 3
  const [isRedImageVisible, setIsRedImageVisible] = useState(true)

  const pricing: Record<string, PricingOption> = {
    1: { price: 5500, originalPrice: 11000, discount: '50%' },
    2: { price: 4950, originalPrice: 22000, discount: '10%' },
    3: { price: 4400, originalPrice: 33000, discount: '20%' },
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setIsRedImageVisible(color === 'red');
  };

  return (
    <div className="bg-pink-100 p-8">
      <div className='flex w-4/5 mx-auto justify-between h-[100vh]'>
        <div className='relative w-[50%] rounded-[8px]'>
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isRedImageVisible ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className='absolute inset-0'
          >
            <Image
              src="/image/supreme_red.jpg" 
              width={1000}
              height={3000}
              alt="supreme_red"
              className="rounded-[8px]"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isRedImageVisible ? 0 : 1 }}
            transition={{ duration: 0.8 }}
            className='absolute inset-0'
          >
            <Image
              src="/image/supreme_yellow.jpg" 
              width={1000}
              height={3000}
              alt="supreme_yellow"
              className="rounded-[8px]"
            />
          </motion.div>
        </div>

        {/* Product Info section */}
        <div className='flex flex-col w-[48%] p-4'>
          <h1 className='text-[2rem] font-bold'>SUPREME JACKET</h1>
          <div className='flex items-center space-x-4 my-4'>
            {/* Color selection */}
            <p className='text-[1.2rem] font-semibold'>Color:</p>
            <div className='flex space-x-2'>
              {['red', 'yellow'].map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 ${color === selectedColor ? 'border-black' : 'border-transparent'}`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          </div>

          <div className='my-4'>
            {['1', '2', '3'].map((option) => (
              <div
                key={option}
                className={`flex items-center justify-between p-4 rounded-lg border my-2 ${option === selectedOption ? 'border-black' : 'border-gray-300'}`}
                onClick={() => setSelectedOption(option)}
              >
                <div className='flex items-center space-x-4'>
                  <input type='radio' checked={option === selectedOption} onChange={() => setSelectedOption(option)} />
                  <p className='text-[1.2rem] font-semibold'>
                    Buy {option} {option === '1' ? 'Standard' : `Save ${pricing[option].discount}`}
                  </p>
                </div>
                <div>
                  <p className='text-[1.2rem] font-bold'>₱{pricing[option].price.toLocaleString()} / EACH</p>
                  {option === '1' && <p className='text-gray-400 line-through'>₱{pricing[option].originalPrice.toLocaleString()}</p>}
                </div>
              </div>
            ))}
          </div>

          <button className='bg-black text-white py-3 rounded-lg mt-4'>
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductPage;
