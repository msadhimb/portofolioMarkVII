import React from "react"

const Grid = () => {
  return (
    <>
      <div
        aria-hidden="true"
        className="bg-grid bg-grid-fade absolute inset-0"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="animate-aurora absolute -top-20 left-[8%] size-[26rem] rounded-full opacity-15 [background:radial-gradient(circle,var(--signal),transparent_70%)]" />
        <div className="animate-aurora-slow absolute top-24 right-[4%] size-[22rem] rounded-full opacity-20 [background:radial-gradient(circle,#22d3ee,transparent_70%)]" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent"
      />
    </>
  )
}

export default Grid
