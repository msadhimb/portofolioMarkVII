import React from "react"

const Grid = () => {
  return (
    <>
      <div
        aria-hidden="true"
        className="bg-grid bg-grid-fade absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden sm:block"
      >
        <div className="animate-aurora absolute -top-20 left-[8%] size-[26rem] rounded-full bg-signal/15 blur-[110px]" />
        <div className="animate-aurora-slow absolute top-24 right-[15%] hidden size-[22rem] rounded-full bg-teal-400/20 blur-[110px] lg:block" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 sm:hidden"
      >
        <div className="animate-pulse-slow absolute -top-16 left-[5%] size-80 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.15)_0%,transparent_70%)]" />
        <div
          className="animate-pulse-slow absolute top-32 right-[-10%] size-72 rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.12)_0%,transparent_70%)]"
          style={{ animationDelay: "3.5s" }}
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent"
      />
    </>
  )
}

export default Grid
