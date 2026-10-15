export const principles = [
    {
      title: "Struktur sebelum kecepatan mengetik",
      note: "Kontrak tipe, batas modul, dan aliran data ditetapkan dulu. Fitur cepat tidak berguna jika tidak bisa diubah enam bulan kemudian.",
    },
    {
      title: "Server state ≠ client state",
      note: "Cache milik React Query, preferensi UI milik Zustand. Tidak ada dua source of truth untuk satu data.",
    },
    {
      title: "Keamanan sebagai default",
      note: "RLS, validasi ganda (client + server), dan prinsip least-privilege — terutama untuk data finansial dan enterprise.",
    },
    {
      title: "Motion melayani narasi",
      note: "Animasi hanya ada jika membantu orientasi atau emosi. Hormati prefers-reduced-motion.",
    },
  ];
