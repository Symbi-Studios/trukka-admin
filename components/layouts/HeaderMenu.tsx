'use client'

import { useAuth } from "@/context/AuthContext";
import { logout } from "@/lib/logout";
import { Bell, ChevronRight, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";


interface Props {
    title: string;
    label: string;
}

export function HeaderMenu({title, label}: Props){
    const {user, initials} = useAuth()
    


    const [drop, setDrop] = useState(false)
    const params = usePathname()
    const headMenu = params.split('/').slice(2, 3).toString()
    const menu = headMenu.charAt(0).toUpperCase() + headMenu.slice(1)

    const handleLogout = async() =>{
        await logout();

        window.location.href = '/auth/sign-in'
    }
    return(
        <div className="bg-white p-4 border-b  border-b-[#BDBDBD] flex items-center justify-between">
            <div>
                <p className="font-bold text-lg">{title}</p>
                <div className="text-[#718097] flex items-center  font-meduim text-xs">
                    <p>{menu || 'Admin'}</p>
                    <ChevronRight size={18} />
                    <p>{label}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="bg-[#E8ECF1] border border-[#BDBDBD] rounded-lg w-10 h-10 flex items-center justify-center">
                    <Bell />
                </div>
                <div onClick={() => setDrop(prev => !prev)} className="bg-[#0241E8] font-bold text-lg text-white rounded-lg w-10 h-10 flex justify-center items-center relative cursor-pointer">
                    <p>{initials}</p> 
                    {drop && (
                        <div className="absolute -bottom-32 right-0 min-w-67.5 bg-white shadow-xl rounded-lg">
                            <div className="flex items-center gap-4 px-5 py-3">
                                <div onClick={() => setDrop(true)} className="bg-[#0241E8] font-bold text-lg text-white rounded-full w-10 h-10 flex justify-center items-center relative ">
                                <p>{initials}</p> 
                                </div>
                                <div className="text-black">
                                    <p className="text-lg font-bold">{user?.name}</p>
                                    <p className="font-medium text-xs">{user?.role}</p>
                                </div>
                            </div>
                            
                            <div onClick={handleLogout} className="text-[#EB3A32] flex gap-2 items-center border-t border-t-[#BDBDBD] px-5 py-3 cursor-pointer">
                                <LogOut />
                                Log out
                            </div>
                        </div>
                    )}
                </div>
            </div>

            
        </div>
    )
}   