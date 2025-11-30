import React from 'react'
import HowToCard from './HowToCard'

const HowTo = () => {
  return (
    <div className='p-10 bg-[#ADC6E5]'>
        <h2 style={{color:"#1E0F75"}} className='text-3xl font-bold text-center mb-10'>How to join us?</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-10 ">
                <HowToCard icon="1" title="Easy Setup" content="Start selling in minutes with our simple onboarding process" />
<HowToCard icon="2" title="Easy Setup" content="Start selling in minutes with our simple onboarding process" />
<HowToCard icon="3" title="Easy Setup" content="Start selling in minutes with our simple onboarding process" />
<HowToCard icon="4" title="Easy Setup" content="Start selling in minutes with our simple onboarding process" />


            </div>
    </div>
  )
}

export default HowTo
