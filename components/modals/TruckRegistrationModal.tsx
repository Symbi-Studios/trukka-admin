'use client'

import React from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

export interface TruckRegData {
  companyName: string
  truckId: string
  plateNumber: string
  containerType: string
  containerSize: string
  containerWeight: string
  yearOfManufacture: string
  images: string[]
}

interface TruckRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  data?: TruckRegData
}

export const TruckRegistrationModal: React.FC<TruckRegistrationModalProps> = ({ 
  isOpen, 
  onClose,
  data = {
    companyName: 'Apapa Swift Cargo Ltd.',
    truckId: 'EXY 123 BG',
    plateNumber: 'EXY 123 BG',
    containerType: 'Container Truck',
    containerSize: '20 ft Container',
    containerWeight: '20 tons',
    yearOfManufacture: '2005',
    images: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586191552066-d52cd82cb3ce?q=80&w=800&auto=format&fit=crop'
    ]
  }
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 flex justify-between items-start border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Truck Registration Review</h2>
            <p className="text-sm text-gray-500 mt-1">{data.companyName} • Truck {data.truckId}</p>
          </div>
          <button onClick={onClose} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Trucker</p>
              <p className="font-medium text-gray-900">{data.companyName}</p>
            </div>
            <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Plate Number</p>
              <p className="font-bold text-[#0241E8] tracking-wider">{data.plateNumber}</p>
            </div>
            <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Container Type</p>
              <p className="font-medium text-gray-900">{data.containerType}</p>
            </div>
            <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Container Size</p>
              <p className="font-medium text-gray-900">{data.containerSize}</p>
            </div>
            <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Container Weight</p>
              <p className="font-medium text-gray-900">{data.containerWeight}</p>
            </div>
            <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Year of Manufacture</p>
              <p className="font-medium text-gray-900">{data.yearOfManufacture}</p>
            </div>
          </div>

          {/* Truck Images Section */}
          <div>
            <div className="border-b border-[#E0E0E0] pb-2 mb-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Truck Images</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {data.images.map((imgUrl, index) => (
                <div key={index} className="relative rounded-xl overflow-hidden h-32 bg-gray-100 border border-gray-200">
                  <Image 
                    src={imgUrl} 
                    alt={`Truck view ${index + 1}`} 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-between items-center bg-white">
          <button onClick={onClose} className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
            Close
          </button>
          <div className="flex gap-3">
            <button className="border border-[#EB3A32] text-[#EB3A32] px-5 py-2 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors">
              Reject
            </button>
            <button className="border border-[#01AC4E] text-[#01AC4E] px-5 py-2 rounded-lg text-sm font-bold hover:bg-green-50 transition-colors">
              Approve
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}