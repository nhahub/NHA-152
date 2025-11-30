import React from 'react'
import HowToCard from './HowToCard'

const HowTo = () => {
  return (
    <div className='p-10 bg-[#ADC6E5]'>
      <h2 style={{ color: "#1E0F75" }} className='text-3xl font-bold text-center mb-10'>How to join us?</h2>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-10 ">
        <HowToCard icon="1" title="Sign Up" content="Create your account and verify your email address" />
        <HowToCard icon="2" title="Fill Details" content="Complete your seller profile and store information" />
        <HowToCard icon="3" title="Get Approved" content="Wait for admin approval of your seller application" />
        <HowToCard icon="4" title="Start Selling" content="List your products and start selling to customers" />
      </div>
    </div>
  )
}

export default HowTo

