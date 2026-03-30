import { Bell, ChevronRight } from "lucide-react";



export function HeaderMenu(){
    return(
        <div className="bg-white p-4 border-b border-b-[#BDBDBD] flex items-center justify-between">
            <div>
                <p className="font-bold text-lg">Marketplace Overview</p>
                <div className="text-[#718097] flex items-center  font-meduim text-xs">
                    <p>Admin</p>
                    <ChevronRight size={18} />
                    <p>Overview</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="bg-[#E8ECF1] border border-[#BDBDBD] rounded-lg w-10 h-10 flex items-center justify-center">
                    <Bell />
                </div>
                <div className="bg-[#0241E8] font-bold text-lg text-white rounded-lg w-10 h-10 flex justify-center items-center">
                    <p>DC</p>
                </div>
            </div>
        </div>
    )
}   