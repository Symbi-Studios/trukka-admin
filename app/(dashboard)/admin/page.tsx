import { RecentJobs } from '@/components/dashboard/overview/RecentsJobs'
import { HeaderMenu } from '@/components/layouts/HeaderMenu'
import React from 'react'

const Home = () => {
  return (
    <div>
      <HeaderMenu />
      <div className='p-5'>
        <div className='flex justify-between items-center gap-5'>
          {['1', '2', '3', '4'].map((c, index) => (
            <div 
            key={index}
            className='bg-white border-[#BDBDBD] border rounded-xl flex-1 p-5 grid gap-2'
            >
              <p className='text-[#4A5567] font-bold text-xs'>Active jobs</p>
              <p className='font-bold text-4xl'>284</p>
              <p className='font-bold text-xs'>12%</p>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-2 gap-7 mt-5'>
          <RecentJobs />
          <RecentJobs />
          <RecentJobs />
          <RecentJobs />
        </div>
      </div>
      
    </div>
  )
}

export default Home