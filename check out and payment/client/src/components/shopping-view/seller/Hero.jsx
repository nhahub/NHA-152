import React from 'react'
import HeroCard from './HeroCard'

const Hero = () => {
  const style = {
    background: "linear-gradient(135deg,#1E0F75,#3785D8)"
  }
  return (
    <div className='text-center p-10' style={style}>
      <div className='flex flex-col gap-2'>
        <h1 className='text-4xl font-bold text-gray-700' style={{ color: "#EBB2C3" }}>Start Selling on Our Platform</h1>
        <p className='text-white text-sm'>Join thousands of successful sellers and grow your business</p>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 p-10 gap-10">
        <HeroCard title="10K+" span="Active Sellers" />
        <HeroCard title="Zero" span="Setup Fee" />
        <HeroCard title="24/7" span="Support" />
      </div>
    </div>
  )
}

export default Hero

