import React from 'react'

const HeroCard = (props) => {
  return (
    <div className="bg-transparent py-8 px-6 sm:py-10 sm:px-10 rounded-2xl border border-white hover:opacity-80 hover:-translate-y-2 transition-transform duration-300 text-center">
      <h5 className='text-white text-3xl sm:text-4xl font-bold'>{props.title}</h5>
      <span className='text-white text-sm'>{props.span}</span>
    </div>
  )
}

export default HeroCard
