export const principles = [
    {
      title: "Structure before typing speed",
      note: "Type contracts, module boundaries, and data flow come first. Shipping fast is useless if it can't change six months later.",
    },
    {
      title: "Server state ≠ client state",
      note: "Cache belongs to React Query, UI preferences to Zustand. No two sources of truth for one piece of data.",
    },
    {
      title: "Security by default",
      note: "RLS, double validation (client + server), and least privilege — especially for financial and enterprise data.",
    },
    {
      title: "Motion serves narrative",
      note: "Animation exists only if it aids orientation or emotion. Respect prefers-reduced-motion.",
    },
  ];
