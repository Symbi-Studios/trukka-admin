import { Dot, MoveRight } from "lucide-react"
import { OverviewDataContainer } from "../ui/OverviewDataContainer"

export function RecentJobs(){
    return(
        <OverviewDataContainer>
            <div className="flex items-center justify-between py-3 px-5">
                <p className="font-bold text-sm text-[#131514]">Recent jobs</p>
                <p className="text-[#616161] border-[#616161] border font-bold text-sm px-2 py-1">View all</p>
            </div>

            <div className="w-full overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-spacing-y-2 border-collapse">
                    <thead className="bg-[#E8ECF1]">
                        <tr className="text-[#64748B] text-xs font-medium uppercase tracking-wider">
                            {['JOB ID', 'ROUTE', 'TEXT', 'BADGE'].map((h, index) => (
                                <th key={index} className="px-5 py-3 first:rounded-l-lg last:rounded-r-lg">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="font-satoshi">
                        {
                            ['1', '2'].map((t, index) => (
                                <tr className="text-sm border-b-[#E8ECF1] border-b">
                                    <td className="px-5 py-4 text-[#0241E8] font-bold">#JB-2836</td>
                                    <td className="px-5 py-4">
                                        <div className="font-medium flex items-center gap-2">
                                            <p>Apapa</p>
                                            <MoveRight size={16} className="text-gray-400" />
                                            <p>Abuja</p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 font-medium text-[#1E293B]">K. Okafor</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center bg-[#E4FFF0] text-[#00652D] font-bold text-xs w-fit py-1 px-3 rounded-full">
                                            <div className="w-2 h-2 rounded-full bg-[#00652D] mr-2" />
                                            <p>On track</p>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                        
                        
                    </tbody>
                </table>
            </div>

        </OverviewDataContainer>
            
    )
}