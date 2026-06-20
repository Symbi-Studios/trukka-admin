import { getJobDetailAction } from '@/app/actions/jobs';
import { ArrowLeft, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'



const JobDetails = ({ jobId, onBack, onIntervene }: { jobId: string; onBack: () => void, onIntervene: () => void }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [jobData, setJobData] = useState<any>(null);


   const isoString = jobData?.tdoDate;
    // 1. Declare the variable outside the block
    let formattedDate = "Loading date..."; 

    // 2. Only run the formatting logic if the string is present
    if (isoString) {
    const date = new Date(isoString);
    
    const options: Intl.DateTimeFormatOptions = { 
        weekday: 'short', 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric',
        timeZone: 'UTC'
    };

    // 3. Ensure the parsed date timestamp is a valid number before formatting
    if (!isNaN(date.getTime())) {
        formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    } else {
        formattedDate = "Invalid Date";
    }
    }



    const containerInfo = [
        {id:1, label: 'CONTAINER TYPE ', value: jobData?.container.type},
        {id:2, label: 'CONTAINER SIZE ', value: jobData?.container.size},
        {id:3, label: 'CONTAINER NUMBER ', value: jobData?.container.number},
        {id:4, label: 'CONTAINER WEIGHT ', value: jobData?.container.cargoWeight},
        {id:5, label: 'CONTAINER CONTENTS ', value: jobData?.container.cargoContents},
        {id:6, label: 'TDO DATE ', value: formattedDate},
    ]

    const PickUpInfo = [
        {id:1, label: 'PICKUP PORT ', value: jobData?.pickup.port},
        {id:2, label: 'TERMINAL ', value: jobData?.pickup.terminal},
        {id:3, label: 'DELIVERY ADDRESS ', value: jobData?.delivery.address},
        {id:4, label: 'CONTAINER RETURN ADDRESS ', value: jobData?.containerReturnAddress},
        // {id:5, label: 'EST DISTANCE ', value: 'NAN'},
        // {id:6, label: 'EST TRIP TIME ', value: 'NAN'},
    ]

    const pricing = [
        {id:1, label: 'AGREED PRICE', value: jobData?.pricing.agreedPrice},
        {id:2, label: 'PLATFORM COMMISION', value: jobData?.pricing.platformFee},
        {id:3, label: 'TRUCKER PAYOUT ', value: jobData?.pricing.truckerPayout},
        {id:4, label: 'MOBILISATION FEE (30%) ', value: jobData?.pricing.mobilizationAmount},
        {id:5, label: 'MOBILISATION PAID ', value: jobData?.pricing.mobilizationPaid},
        {id:6, label: 'FINAL PAYOUT STATUS ', value: jobData?.pricing.finalPayoutStatus},
    ]


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
            isLoading  ? (
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
                            <div className='grid md:grid-cols-3 gap-2 '>
                            {PickUpInfo.map((p, index) => (
                                <div key={index}>
                                   <DetailBox label={p.label} value={p.value}/>
                                </div>
                            ))}
                            </div>
                        </div>

                        {/* Container & cargo */}
                        <div >
                            <p className='font-bold text-xs'>CONTAINER & CARGO</p>
                            <div className='grid md:grid-cols-3 gap-2'>
                            {containerInfo.map(c => (
                                <div key={c.id}>
                                    <DetailBox label={c.label} value={c.value}/>
                                </div>
                            ))}
                            </div>
                        </div>

                        {/* Pricing & payment */}
                        <div >
                            <p className='font-bold text-xs'>PRICING & PAYMENT</p>
                            <div className='grid md:grid-cols-3 gap-2'>
                            {pricing.map((p, index) => (
                                <div key={index}>
                                    <DetailBox label={p.label} value={p.value} />
                                </div>
                            ))}
                            </div>
                        </div>
                        


                    </div>

                    {/* right details */}
                    <div className=' bg-white rounded-2xl py-6 px-3 '>
                        {/* role */}
                        <div>
                            {jobData.forwarder && <UserRole name={jobData?.forwarder.name} role='Forwarder' email={jobData?.forwarder.email} id={jobData?.forwarder.id} />}
                            {jobData.trucker && <UserRole name={jobData?.trucker.name} role='Trucker' email={jobData?.trucker.email} id={jobData?.trucker.id} />}
                            {jobData.driver && <UserRole name={jobData?.driver.name} role='Driver' email={jobData?.driver.email} id={jobData?.driver.id} />}
                        </div>

                        {/* docs */}
                        <div className='mt-7'>
                            <div className='flex justify-between items-center'>
                                <p className='text-[#757575] font-bold text-sm'>DOCUMENTS</p>
                                <p className={`text-[#00652D] bg-[#E4FFF0] font-bold text-xs p-1 ${jobData?.documents.approvalStatus === 'Pending' && 'bg-amber-50 text-amber-600' || jobData?.documents.approvalStatus === 'Rejected' && 'bg-red-50 text-red-600' }`}>{jobData?.documents.approvalStatus}</p>
                            </div>
                            <div className='flex items-center gap-2 mt-2'>
                            {[
                                { key: 'tdo', label: 'TDO' },
                                { key: 'exitNote', label: 'Exit Note' },
                                { key: 'gatePass', label: 'Gate Pass' }
                            ]
                                .filter(docConfig => jobData?.documents?.[docConfig.key as keyof typeof jobData.documents]?.url)
                                .map((docConfig, index) => (
                                <div 
                                    key={index} 
                                    className='border border-[#718097] rounded-lg text-xs font-bold px-3 py-1'
                                >
                                    {docConfig.label}
                                </div>
                                ))
                            }
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
  <div className="bg-[#E8ECF1] h-full p-3.5 rounded-xl border border-slate-100">
    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">{label}</p>
    <p className="text-[13px] font-semibold text-slate-800">{value}</p>
  </div>
);

const UserRole = ({ name,  email, role, id }: { name: string, role: string, email: string, id: string }) => (
  <div className="p-3.5">
    <p className='font-bold text-xs text-[#757575] mb-2'>{role}</p>
    <div className='flex  items-center justify-between gap-2'>
        <div className='flex  items-center gap-2'>
            <div className='bg-[#0241E8] text-white font-bold text-lg p-2 rounded-lg'>
                DC
            </div>
            <div>
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-[#718097] font-medium">{email}</p>
            </div>
        </div>

        <div className='border-[#0241E8] border rounded-lg px-3 py-1'>
            View
        </div>
        
    </div>
  </div>
);