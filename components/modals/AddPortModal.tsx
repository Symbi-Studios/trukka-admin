'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Plus, Trash2, ChevronDown } from 'lucide-react'

interface AddPortModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Terminal {
  name: string;
  type: string;
}

// --- Custom Toggle Switch ---
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

const terminalTypes = [
  'General Cargo',
  'Container terminal',
  'Bulk cargo',
  'Liquid cargo',
  'RoRo (Roll-on/Roll-off)'
]

export const AddPortModal = ({ isOpen, onClose }: AddPortModalProps) => {
  // Form State
  const [portName, setPortName] = useState('')
  const [address, setAddress] = useState('')
  const [baseRate, setBaseRate] = useState('')
  const [fuelSurcharge, setFuelSurcharge] = useState(false)
  const [terminals, setTerminals] = useState<Terminal[]>([{ name: '', type: 'General Cargo' }])
  
  // Location Coordinates State
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)

  // Refs for Google Places
  const inputRef = useRef<HTMLInputElement>(null)
  const autoCompleteRef = useRef<any>(null)

  // Load Google Places Script dynamically
  useEffect(() => {
    if (!isOpen) return;

    const initAutocomplete = () => {
      if (!inputRef.current || !(window as any).google) return;

      autoCompleteRef.current = new (window as any).google.maps.places.Autocomplete(inputRef.current, {
        fields: ['formatted_address', 'geometry'],
      });

      autoCompleteRef.current.addListener('place_changed', () => {
        const place = autoCompleteRef.current.getPlace();
        if (place.geometry && place.geometry.location) {
          setAddress(place.formatted_address || '');
          setLat(place.geometry.location.lat());
          setLng(place.geometry.location.lng());
        }
      });
    };

    if (typeof window !== 'undefined' && !(window as any).google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      script.onload = initAutocomplete;
    } else {
      initAutocomplete();
    }
  }, [isOpen]);

  // Terminal Handlers
  const addTerminal = () => {
    setTerminals([...terminals, { name: '', type: 'General Cargo' }])
  }

  const removeTerminal = (index: number) => {
    setTerminals(terminals.filter((_, i) => i !== index))
  }

  const updateTerminal = (index: number, field: keyof Terminal, value: string) => {
    const updated = [...terminals]
    updated[index][field] = value
    setTerminals(updated)
  }

  // Handle Form Submission
  const handleSave = () => {
    const payload = {
      portName,
      address,
      latitude: lat,
      longitude: lng,
      baseRate: baseRate ? Number(baseRate.replace(/,/g, '')) : 0,
      fuelSurcharge,
      terminals: terminals.filter(t => t.name.trim() !== '') // Filter out empty terminal names
    };

    console.log('--- NEW PORT PAYLOAD ---');
    console.dir(payload, { depth: null });
    
    // TODO: Connect your API here using the payload
    
    handleClose();
  };

  // Reset state when closing
  const handleClose = () => {
    setPortName('');
    setAddress('');
    setBaseRate('');
    setFuelSurcharge(false);
    setLat(null);
    setLng(null);
    setTerminals([{ name: '', type: 'General Cargo' }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Add New Port</h2>
            <p className='text-[#757575]'>Define a new port</p>
          </div>
          <button onClick={handleClose} className="p-2 bg-slate-50 text-slate-500 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <X size={18} />
          </button>
        </div>


        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Port Name */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Port Name</label>
              <input 
                type="text" 
                value={portName}
                onChange={(e) => setPortName(e.target.value)}
                placeholder="e.g. Apapa Port" 
                className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none" 
              />
            </div>

            {/* Location / Address (Google Places) */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Address</label>
              <input 
                type="text" 
                ref={inputRef}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                placeholder="Search address..." 
                className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Base Rate */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Base rate (₦/km)</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-500 font-bold">₦</span>
                <input 
                  type="text" 
                  value={baseRate}
                  onChange={(e) => setBaseRate(e.target.value)}
                  placeholder="2,000" 
                  className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 pl-8 outline-none" 
                />
              </div>
            </div>

            {/* Minimum fee */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Minimum fee (₦)</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-500 font-bold">₦</span>
                <input 
                  type="text" 
                  value={baseRate}
                  onChange={(e) => setBaseRate(e.target.value)}
                  placeholder="e.g 2,000" 
                  className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 pl-8 outline-none" 
                />
              </div>
            </div>
            
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Peak multiplier */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Base rate (₦/km)</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-500 font-bold">₦</span>
                <input 
                  type="text" 
                  value={baseRate}
                  onChange={(e) => setBaseRate(e.target.value)}
                  placeholder="2,000" 
                  className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 pl-8 outline-none" 
                />
              </div>
            </div>

            {/* Fuel surcharge */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Minimum fee (₦)</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-500 font-bold">₦</span>
                <input 
                  type="text" 
                  value={baseRate}
                  onChange={(e) => setBaseRate(e.target.value)}
                  placeholder="e.g 2,000" 
                  className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 pl-8 outline-none" 
                />
              </div>
            </div>
            
          </div>

          <hr className="border-slate-100 my-2" />

          {/* Add Terminals Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900">Terminals</h3>
              <button 
              onClick={addTerminal}
              className="mt-4 flex items-center gap-2 text-sm font-bold border border-[#0241E8] rounded-lg px-3 py-1 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Plus size={16} /> Add terminal
            </button>
            </div>
            
            <div className="space-y-4">
              {terminals.map((terminal, index) => (
                <div key={index} className="flex items-start gap-4">
                  {/* Terminal Name */}
                  <div className="flex-[2]">
                    {index === 0 && <label className="block text-xs font-bold text-slate-500 mb-2">Terminal Name</label>}
                    <input 
                      type="text" 
                      value={terminal.name}
                      onChange={(e) => updateTerminal(index, 'name', e.target.value)}
                      placeholder="e.g. Terminal A" 
                      className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none" 
                    />
                  </div>
                  
                  {/* Terminal Type */}
                  <div className="flex-[2]">
                    {index === 0 && <label className="block text-xs font-bold text-slate-500 mb-2">Terminal Type</label>}
                    <div className="relative">
                      <select 
                        value={terminal.type}
                        onChange={(e) => updateTerminal(index, 'type', e.target.value)}
                        className="w-full appearance-none bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 pr-8 outline-none font-medium"
                      >
                        {terminalTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-3.5 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className={`flex shrink-0 ${index === 0 ? 'mt-6' : ''}`}>
                    <button 
                      onClick={() => removeTerminal(index)}
                      disabled={terminals.length === 1}
                      className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 shrink-0">
          <button 
            onClick={handleClose} 
            className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Save port
          </button>
        </div>

      </div>
    </div>
  )
}