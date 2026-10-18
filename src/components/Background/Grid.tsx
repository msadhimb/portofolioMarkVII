import React from "react"

const Grid = () => {
  return (
    <>
      <div
        aria-hidden="true"
        className="bg-grid bg-grid-fade absolute inset-0"
      />
      {/* Aurora: hanya render di layar ≥ sm. Di mobile, elemen blur-[110px]
           meski animasinya di-pause tetap mengonsumsi GPU layer → lag. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden sm:block">
        <div className="animate-aurora absolute -top-20 left-[8%] size-[26rem] rounded-full bg-signal/15 blur-[110px]" />
        <div className="animate-aurora-slow absolute top-24 right-[4%] size-[22rem] rounded-full bg-cyan-400/20 blur-[110px]" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent"
      />
    </>
  )
}

export default Grid
