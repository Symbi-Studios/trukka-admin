import { dashboard_menu } from '@/constant/dashboardMenu'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const SideBar = () => {
  return (
    <div className=' overflow-y-auto no-scrollbar border-r-[#BDBDBD] border-r'>
        <div className='flex items-center gap-2 py-7 border-b-[#BDBDBD] border-b px-3'>
            <Image src={'/icon.png'} alt='trukka image' width={40} height={40} />
            <div>
                <p className='font-bold text-lg'>Trukkas</p>
                <p className='font-bold text-xs text-[#718097]'>ADMIN CONSOLE</p>
            </div>
        </div>
        <div className='space-y-4 py-5 px-3'>
            {
                dashboard_menu.map((m, index) => (
                    <div key={index}>
                        {/* Category Header */}
                        <div className="text-[#718097] font-bold uppercase text-xs tracking-wider">
                        <span>{m.title}</span>
                        </div>

                        {/* Sub-menu Items */}
                        <ul className="space-y-1 ">
                        {m.items.map((item) => (
                            <li key={item.label}>
                            <Link 
                                href={item.link} 
                                className="flex items-center text-[#616161] text-sm font-bold gap-3 px-3 py-2 rounded-lg hover:bg-[#0241E814] hover:rounded-lg hover:text-[#0241E8] hover:border-l hover:border-l-hover:text-[#0241E8] transition-colors"
                            >
                                <item.icon size={18} className=" hover:text-[#0241E8]" />
                                {item.label}
                            </Link>
                            </li>
                        ))}
                        </ul>

                    </div>
                ))
            }
        </div>
        <div className='px-3 py-2 border-t-[#BDBDBD] border-t'>
            <div className='flex items-center gap-2 bg-[#E8ECF1] rounded-lg px-5 py-2 '>
                <div className='text-white font-bold text-lg bg-[#0241E8] flex items-center justify-center rounded-full w-10 h-10'>
                    <p>DC</p>
                </div>
                <div>
                    <p className='font-bold text-lg'>Dee Caulcrick</p>
                    <p className='text-[#718097] font-medium text-xs'>Super Admin</p>
                </div>
            </div>
        </div>
    </div>
  )
}
