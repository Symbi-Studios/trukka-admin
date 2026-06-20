'use client'

import React from 'react'
import { HardHat, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UnderConstructionProps {
  title?: string;
  message?: string;
}

export const UnderConstruction = ({ 
  title = "Page Under Construction", 
  message = "We are currently building this feature. Check back soon for updates!" 
}: UnderConstructionProps) => {
  const router = useRouter();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 border-8 border-blue-100/50">
        <HardHat size={40} className="text-[#0241E8]" />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 mb-3">
        {title}
      </h2>
      
      <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
        {message}
      </p>
      
      {/* <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
      >
        <ArrowLeft size={16} /> Go Back
      </button> */}
    </div>
  )
}