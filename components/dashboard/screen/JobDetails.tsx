import { getJobDetailAction } from '@/app/actions/jobs';
import { ArrowLeft, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'



const JobDetails = ({ jobId, onBack, onIntervene }: { jobId: string; onBack: () => void, onIntervene: () => void }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [jobData, setJobData] = useState<any>(null);


    useEffect(() => {
        if (jobId) {
          setIsLoading(true);
          getJobDetailAction(jobId).then((res) => {
            console.log('details',res)
            if (res.success) setJobData(res?.data);
            setIsLoading(false);
          });
        } else {
          setJobData(null);
        }
    }, [jobId]);
    
    if (!jobId) return null;
  return (
    <div className="p-5  mx-auto">
        <div className='flex justify-between gap-5'>
            <div className='flex items-center gap-5'>
                <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-black">
                <ArrowLeft size={16} /> Back 
                </button>
                <p className='text-[#718097] text-sm font-medium' >
                    Jobs /  {jobData?.jobNumber}
                </p>
            </div>
            <div className="flex space-x-3 justify-end ">
                <button className="px-4 py-2 text-[13px] font-semibold text-white bg-[#0241E8] border hover:bg-blue-700 rounded-lg">
                Message driver
                </button>
                <button  className="px-4 py-2 text-[13px] font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg">
                Intervene
                </button>
            </div>
        </div>


        {
            isLoading || !jobData ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="animate-spin text-blue-600 h-8 w-8" />
            </div> )
            : (
                <>
                 <div className='mt-5 grid lg:grid-cols-3 gap-7'>
                    {/* left details */}
                    <div className='grid gap-4 bg-white rounded-2xl py-6 px-3 col-span-2 '>
                        <p className='font-semibold text-xl'>{jobData.jobNumber}</p>
                        <div className='w-ful h-[200px] bg-blue-300'></div>

                        {/* Pickup and delivery */}
                        <div >
                            <p className='font-bold text-xs'>PICKUP & DELIVERY</p>
                            <div className='grid md:grid-cols-3 gap-2'>
                            {[1,2,3,4,5,6].map((p, index) => (
                                <div key={index}>
                                    <DetailBox label='Pickup port' value='Apapa Port' />
                                </div>
                            ))}
                            </div>
                        </div>

                        {/* Container & cargo */}
                        <div >
                            <p className='font-bold text-xs'>CONTAINER & CARGO</p>
                            <div className='grid md:grid-cols-3 gap-2'>
                            {[1,2,3,4,5,6].map((p, index) => (
                                <div key={index}>
                                    <DetailBox label='Pickup port' value='Apapa Port' />
                                </div>
                            ))}
                            </div>
                        </div>

                        {/* Pricing & payment */}
                        <div >
                            <p className='font-bold text-xs'>PRICING & PAYMENT</p>
                            <div className='grid md:grid-cols-3 gap-2'>
                            {[1,2,3,4,5,6].map((p, index) => (
                                <div key={index}>
                                    <DetailBox label='Pickup port' value='Apapa Port' />
                                </div>
                            ))}
                            </div>
                        </div>
                        


                    </div>

                    {/* right details */}
                    <div className=' bg-white rounded-2xl py-6 px-3 '>
                        {/* role */}
                        <div>
                            <UserRole firstName='firstName' lastName='LastNme' role='Forwarder' email='ccc@gmail.com' />
                            <UserRole firstName='firstName' lastName='LastNme' role='Forwarder' email='ccc@gmail.com' />
                            <UserRole firstName='firstName' lastName='LastNme' role='Forwarder' email='ccc@gmail.com' />
                        </div>

                        {/* docs */}
                        <div className='mt-7'>
                            <div className='flex justify-between items-center'>
                                <p className='text-[#757575] font-bold text-sm'>DOCUMENTS</p>
                                <p className='text-[#00652D] bg-[#E4FFF0] font-bold text-xs p-1'>Approved</p>
                            </div>
                            <div className='flex items-center gap-2 mt-2'>
                                {['TDO', 'Exit Note', 'Gate Pass'].map((d, index) => (
                                    <div key={index} className='border border-[#718097] rounded-lg text-xs font-bold px-3 py-1'>{d}</div>
                                ))}
                            </div>
                            <div className='border border-[#0241E8] rounded-lg text-[#0241E8] text-sm text-center py-2 mt-3'>
                                View
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className='mt-7'>
                        <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-4"> JOB TIMELINE</h3>
                        <div className="relative border-l-2 border-slate-100 ml-2.5 space-y-6">
                            {jobData.timeline.map((event: any, index: number) => (
                            <div key={index} className="relative pl-5">
                                <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ring-4 ring-white ${
                                event.completed ? 'bg-emerald-500' : 'bg-slate-300'
                                }`} />
                                <div>
                                <p className={`text-[13px] font-bold ${!event.completed ? 'text-slate-500' : 'text-slate-800'}`}>
                                    {event.event}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                                    {new Date(event.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                </p>
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                </div>

                </>
            )
        }
       
       
      

    
    </div>
  )
}

export default JobDetails



const DetailBox = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-[#E8ECF1] p-3.5 rounded-xl border border-slate-100">
    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">{label}</p>
    <p className="text-[13px] font-semibold text-slate-800">{value}</p>
  </div>
);

const UserRole = ({ firstName, lastName, email, role }: { firstName: string, lastName: string, role: string, email: string }) => (
  <div className="p-3.5">
    <p className='font-bold text-xs text-[#757575] mb-2'>{role}</p>
    <div className='flex  items-center justify-between gap-2'>
        <div className='flex  items-center gap-2'>
            <div className='bg-[#0241E8] text-white font-bold text-lg p-2 rounded-lg'>
                DC
            </div>
            <div>
                <p className="text-sm font-medium">{firstName} {lastName}</p>
                <p className="text-xs text-[#718097] font-medium">{email}</p>
            </div>
        </div>

        <div className='border-[#0241E8] border rounded-lg px-3 py-1'>
            View
        </div>
        
    </div>
  </div>
);