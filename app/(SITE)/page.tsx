import React from 'react'

const Hero = () => {
  return (
    <section className='bg-[#78D7FF] h-screen w-full relative overflow-hidden'>
      
      
      <div className='max-w-3xl mx-auto translate-y-32 flex flex-col items-center gap-3 px-6'> 
        
        <h1 className='font-bold text-3xl md:text-6xl text-center'>
          Move Goods. <br /> Faster. Smarter. 
        </h1>

        <p className='font-bold text-lg text-[#131514] leading-7 text-center max-w-xl'>
          Request a truck in minutes, get matched instantly, and follow every step—from document approval to delivery.
        </p>

        <button className="bg-[#0241E8] hover:bg-blue-700 transition-all px-8 py-3 rounded-full text-white font-medium">
          Contact us
        </button>
        
      </div>
    </section>
  )
}

export default Hero;
