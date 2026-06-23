'use client'

import React, { useState } from 'react'
import { HeaderMenu } from '@/components/layouts/HeaderMenu'
import { Plus, ChevronDown } from 'lucide-react'
import { AddPortModal } from '@/components/modals/AddPortModal'

// --- Custom Toggle Switch Component ---
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
      checked ? 'bg-blue-600' : 'bg-slate-300'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
)

// --- Mock Data ---
const portsData = [
  {
    id: 1,
    name: 'Apapa Port',
    status: 'Active',
    baseRate: '₦2,200/km',
    fuelSurcharge: true,
    terminals: [
      { name: 'Terminal A', type: 'Bulk cargo' },
      { name: 'Terminal B', type: 'Bulk cargo' },
      { name: 'Terminal C', type: 'General Cargo' },
      { name: 'Terminal D', type: 'General Cargo' },
    ]
  },
  {
    id: 2,
    name: 'Tin Can Island',
    status: 'Paused',
    baseRate: '₦2,000/km',
    fuelSurcharge: false,
    terminals: [
      { name: 'Terminal A', type: 'Container terminal' },
      { name: 'Terminal B', type: 'Liquid cargo' },
    ]
  }
]

export default function GlobalSettingsPage() {
  // State for toggles
  const [apapaSurcharge, setApapaSurcharge] = useState(true)
  const [tinCanSurcharge, setTinCanSurcharge] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [mandatoryCheckIns, setMandatoryCheckIns] = useState(true)

  const [isAddPortOpen, setIsAddPortOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50/50 pb-10">
      <HeaderMenu title='Global Settings' label='Settings' />

      <div className="mx-auto p-6 space-y-6">
        
        {/* 1. Commission Rate Banner */}
        <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="text-5xl font-extrabold text-blue-600">10%</span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-0.5">Platform Commission Rate</h2>
              <p className="text-sm text-slate-500 font-medium">Current base commission applied to all deliveries</p>
            </div>
          </div>
          <button className="px-5 py-2.5 bg-white border border-blue-200 text-blue-600 font-bold text-sm rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap shadow-sm">
            Adjust commission
          </button>
        </div>

        {/* 2. Ports & Terminals */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900">Ports & Terminals</h2>
              <p className="text-sm text-slate-500 mt-0.5">Define ports and their terminals</p>
            </div>
            <button onClick={() => setIsAddPortOpen(true)} className="px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus size={16} /> Add port
            </button>
          </div>

          <div className="p-6 space-y-8">
            {portsData.map((port, index) => (
              <div key={port.id} className={index !== portsData.length - 1 ? "border-b border-slate-100 pb-8" : ""}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-slate-900">{port.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        port.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {port.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">{port.baseRate} base rate</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-700">Fuel surcharge</span>
                      <Toggle 
                        checked={port.id === 1 ? apapaSurcharge : tinCanSurcharge} 
                        onChange={port.id === 1 ? setApapaSurcharge : setTinCanSurcharge} 
                      />
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-1.5 border border-slate-200 text-blue-600 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors">Edit</button>
                      <button className="px-4 py-1.5 border border-slate-200 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors">
                        {port.status === 'Active' ? 'Pause' : 'Resume'}
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Terminals ({port.terminals.length})</p>
                <div className="flex flex-wrap gap-3">
                  {port.terminals.map((terminal, idx) => (
                    <div key={idx} className="bg-slate-100/70 border border-slate-200 rounded-lg p-3 min-w-[140px]">
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{terminal.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{terminal.type}</p>
                    </div>
                  ))}
                  <button className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-lg p-3 min-w-[140px] text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                    <Plus size={16} /> Terminal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Cancellation Policy */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Cancellation Policy</h2>
            <p className="text-sm text-slate-500 mt-0.5">Windows and fee rules</p>
          </div>
          <div className="p-6 space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Free cancellation window</h4>
                <p className="text-xs text-slate-500 font-medium">No fee if cancelled within this period after acceptance</p>
              </div>
              <div className="relative w-full sm:w-64">
                <select className="w-full appearance-none bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-8 font-medium">
                  <option>4 hours</option>
                  <option>12 hours</option>
                  <option>24 hours</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-3 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Late cancellation fee</h4>
                <p className="text-xs text-slate-500 font-medium">Applied after free window expires</p>
              </div>
              <div className="w-full sm:w-64">
                <input type="text" defaultValue="₦10,000" className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 font-medium" />
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">No-show fee</h4>
                <p className="text-xs text-slate-500 font-medium">Applied if trucker does not arrive</p>
              </div>
              <div className="w-full sm:w-64">
                <input type="text" defaultValue="₦15,000" className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 font-medium" />
              </div>
            </div>

          </div>
        </div>

        {/* 4. Platform Configuration */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Platform Configuration</h2>
            <p className="text-sm text-slate-500 mt-0.5">Language, currency, and compliance</p>
          </div>
          <div className="p-6 space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h4 className="text-sm font-bold text-slate-900">Platform fee</h4>
              <div className="w-full sm:w-64">
                <input type="text" defaultValue="₦30,000" className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 font-medium" />
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h4 className="text-sm font-bold text-slate-900">Default currency</h4>
              <div className="relative w-full sm:w-64">
                <select className="w-full appearance-none bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-8 font-medium">
                  <option>NGN (₦)</option>
                  <option>USD ($)</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-3 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h4 className="text-sm font-bold text-slate-900">Platform language</h4>
              <div className="relative w-full sm:w-64">
                <select className="w-full appearance-none bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-8 font-medium">
                  <option>English</option>
                  <option>French</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-3 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="flex justify-between items-center gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Push notifications</h4>
                <p className="text-xs text-slate-500 font-medium">Send real-time alerts to forwarders and truckers</p>
              </div>
              <Toggle checked={pushNotifications} onChange={setPushNotifications} />
            </div>

            <hr className="border-slate-100" />

            <div className="flex justify-between items-center gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Mandatory trucker check-ins</h4>
                <p className="text-xs text-slate-500 font-medium">Require status update every 4 hours during transit</p>
              </div>
              <Toggle checked={mandatoryCheckIns} onChange={setMandatoryCheckIns} />
            </div>

            <hr className="border-slate-100" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Data retention period</h4>
                <p className="text-xs text-slate-500 font-medium">Auto-archive records older than</p>
              </div>
              <div className="relative w-full sm:w-64">
                <select className="w-full appearance-none bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-8 font-medium">
                  <option>180 days</option>
                  <option>1 year</option>
                  <option>3 years</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-3 text-slate-500 pointer-events-none" />
              </div>
            </div>

          </div>
        </div>

        {/* 5. Save Action */}
        <div className="flex justify-end pt-4">
          <button className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            Save all settings
          </button>
        </div>

      </div>



      <AddPortModal isOpen={isAddPortOpen} onClose={() => setIsAddPortOpen(false)} />
    </div>
  )
}