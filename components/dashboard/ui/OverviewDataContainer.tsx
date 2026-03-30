import React, { ReactNode } from 'react'

export function OverviewDataContainer({children}: {children: ReactNode}){
  return (
    <div className="bg-white rounded-xl ">
        {children}
    </div>
  )
}