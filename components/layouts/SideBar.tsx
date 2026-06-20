'use client'

import { dashboard_menu } from '@/constant/dashboardMenu'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const SideBar = () => {
    const pathname = usePathname();
    console.log(pathname)
    const {user, initials} = useAuth()

    return (
        <div className='overflow-y-auto no-scrollbar border-r-[#BDBDBD] border-r h-screen flex flex-col justify-between'>
            <div>
                {/* Logo Section */}
                <div className='flex items-center gap-2 py-7 border-b-[#BDBDBD] border-b px-3'>
                    <Image src={'/icon.png'} alt='trukka image' width={40} height={40} />
                    <div>
                        <p className='font-bold text-lg'>Trukkas</p>
                        <p className='font-bold text-xs text-[#718097]'>ADMIN CONSOLE</p>
                    </div>
                </div>

                {/* Navigation Menu */}
                <div className='space-y-6 py-5 px-3'>
                    {dashboard_menu.map((m, index) => (
                        <div key={index} className="space-y-2">
                            {/* Category Header */}
                            <div className="text-[#718097] font-bold uppercase text-xs tracking-wider px-3">
                                <span>{m.title}</span>
                            </div>

                            {/* Sub-menu Items */}
                            <ul className="space-y-1">
                                {m.items.map((item) => {
                                    const isActive = pathname === item.link;

                                    return (
                                        <li key={item.label}>
                                            <Link 
                                                href={`${item.link}`} 
                                                className={`flex items-center  py-2 rounded-lg transition-colors border-l-4 border-transparent
                                                    ${isActive 
                                                        ? 'bg-[#0241E814]' 
                                                        : 'hover:bg-[#0241E814]'
                                                    }`}
                                            >
                                                <div className={`flex items-center gap-3 text-sm font-bold  px-3 ${isActive 
                                                        ? ' text-[#0241E8] border-l-[#0241E8] border-l-4' 
                                                        : 'text-[#616161] hover:text-[#0241E8]'
                                                    }`}>
                                                    <item.icon 
                                                    size={18} 
                                                    className={isActive ? 'text-[#0241E8]' : 'text-[#616161] group-hover:text-[#0241E8]'} 
                                                    />
                                                    {item.label}
                                                </div>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Profile Section */}
            <div className='px-3 py-2 border-t-[#BDBDBD] border-t'>
                <div className='flex items-center gap-2 bg-[#E8ECF1] rounded-lg px-5 py-2 '>
                    <div className='text-white font-bold text-lg bg-[#0241E8] flex items-center justify-center rounded-full w-10 h-10'>
                        <p>{initials}</p>
                    </div>
                    <div>
                        <p className='font-bold text-lg'>{user?.name}</p>
                        <p className='text-[#718097] font-medium text-xs'>{user?.role}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}