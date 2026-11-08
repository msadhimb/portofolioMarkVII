const AmbientBackdrop = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 overflow-hidden"
  >
    <div className="bg-hairline absolute inset-0 opacity-70" />
    <div className="absolute -top-44 -left-40 size-[42rem] rounded-full bg-signal/[0.08] blur-[130px] dark:bg-signal/[0.06]" />
    <div className="absolute top-1/3 -right-48 size-[38rem] rounded-full bg-teal-800/[0.06] blur-[140px] dark:bg-teal-400/[0.05]" />
    <div className="absolute inset-x-0 top-0 h-[55vh] bg-gradient-to-b from-card/45 to-transparent" />
  </div>
)

export default AmbientBackdrop
