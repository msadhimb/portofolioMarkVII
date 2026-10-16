# General AI Engineering Rules

> Master rules for AI assistants working on React/Next.js/TypeScript projects. These rules are based on an existing feature-oriented enterprise codebase, but must always be adapted to the target repository's actual architecture.

## 1. Project Scope dan Mode Kerja

Gunakan aturan ini sebagai baseline untuk aplikasi React/Next.js/TypeScript. Pilih mode kerja secara dinamis sebelum coding:

### Mode A — Repository existing

Aktif jika repository sudah memiliki source code, `package.json`, konfigurasi build, route, atau feature yang berjalan.

1. Baca `AGENTS.md`, `README`, `package.json`, konfigurasi framework, struktur `src/`, environment example, dan entry point.
2. Identifikasi framework, router, package manager, styling system, authentication, data layer, testing, linting, dan deployment.
3. Ikuti pola lokal repository; jangan mengganti arsitektur, dependency utama, router, atau package manager tanpa instruksi eksplisit.
4. Pertahankan API contract, schema, permission, behavior, dan struktur yang sudah berjalan.

### Mode B — Aplikasi baru dari nol

Aktif jika belum ada repository/implementasi yang harus dipertahankan atau user secara eksplisit meminta bootstrap dari nol.

1. Klarifikasi hanya keputusan yang benar-benar memengaruhi fondasi: tujuan aplikasi, target platform, kebutuhan auth, sumber data, deployment, dan batasan teknis.
2. Jika user tidak menentukan pilihan, gunakan default yang paling sederhana dan paling sesuai dengan kebutuhan; nyatakan asumsi singkat, jangan membuat daftar pilihan panjang.
3. Tentukan fondasi dalam urutan: framework/router → package manager → TypeScript → styling → UI primitives → data/API layer → authentication → validation/form → state → testing → deployment.
4. Gunakan dependency minimum yang menyelesaikan kebutuhan nyata. Jangan menambahkan library hanya karena umum dipakai.
5. Buat struktur awal kecil: hanya folder dan abstraction yang dibutuhkan oleh feature pertama.
6. Tetapkan convention dasar sebelum implementasi kedua: naming, import alias, error format, environment naming, component placement, query/service boundary, dan validation boundary.
7. Pisahkan keputusan yang reversible dari keputusan yang mahal untuk diubah. Hindari mengunci database, auth provider, UI library, atau state manager jika kebutuhan belum membuktikannya.
8. Buat `.env.example`, README setup, dan konfigurasi lint/typecheck yang aman; jangan membuat atau menulis secret ke repository.
9. Setelah fondasi dibuat, verifikasi install, lint, typecheck, test minimal, dan build sebelum menambah feature berikutnya.

### Aturan adaptasi

- Jangan gunakan aturan Mode A untuk memaksa struktur pada project baru.
- Jangan gunakan kebebasan Mode B sebagai alasan untuk merombak repository existing.
- Jika status project ambigu, inspeksi file dan struktur terlebih dahulu; jangan menebak.
- Setiap rekomendasi framework, library, atau struktur harus dapat dijelaskan berdasarkan kebutuhan aplikasi, bukan preferensi pribadi.

Framework, router, package manager, styling system, authentication, dan data layer harus dibaca dari project target terlebih dahulu atau ditetapkan eksplisit untuk project baru.

- Jangan mengasumsikan Pages Router atau App Router.
- Jangan mengubah router, package manager, atau arsitektur existing tanpa instruksi eksplisit.
- Struktur umum yang dapat digunakan bila sesuai dengan project:
  - `src/api/` untuk API transaction dan service request.
  - `src/page/` atau `src/pages/` untuk halaman/layout aplikasi.
  - `src/app/` untuk App Router atau component, utility, dan view sesuai konvensi project.
- Jangan memaksakan pola project lain ke repository target.

## 2. Prinsip Umum

1. Untuk project existing, pahami struktur sebelum membuat file baru; untuk project baru, bentuk struktur sekecil mungkin dari kebutuhan feature pertama.
2. Pertahankan logic, naming, behavior, permission, dan flow yang sudah ada pada project existing.
3. Pada project baru, dokumentasikan keputusan fondasi dan konsisten setelah dipilih.
4. Jangan melakukan refactor besar hanya untuk merapikan style.
5. Jangan membuat abstraksi sebelum ada kebutuhan reuse yang nyata.
6. Pecah kode berdasarkan tanggung jawab, bukan sekadar jumlah baris.
7. Kode yang hanya dipakai satu feature tetap berada dekat feature tersebut.
8. Masukkan kode ke global/common hanya jika dipakai minimal oleh dua feature, API-nya stabil, tidak bergantung pada business rule khusus, dan benar-benar mengurangi duplikasi.
9. Jangan mengubah logic bisnis saat hanya diminta memperbaiki UI.
10. Jangan mengubah route, API contract, database contract, atau permission tanpa instruksi eksplisit.
11. Jika pola antar-file berbeda, ikuti pola lokal file/domain tersebut terlebih dahulu.

## 3. Struktur Folder

Gunakan struktur feature-oriented hanya sejauh dibutuhkan. Pada project baru, mulai dari struktur minimum berikut dan perluas berdasarkan kebutuhan nyata; pada project existing, ikuti struktur lokal repository.

Gunakan struktur feature-oriented. Sesuaikan nama folder dengan repository target:

```text
src/
├── api/v1/
├── pages/
├── components/
├── views/
├── hooks/
├── helpers/
├── utils/
├── form/
├── validation/
├── store/
└── [feature]/
    ├── components/
    ├── hooks/
    ├── form/
    ├── validation/
    ├── table/
    └── store/
```

- `src/api/v1/`: request API, Axios service, API transaction, mapper, dan error handling request.
- `src/page/`: page-level composition, layout aplikasi, dan route-level wrapper. Page harus tetap relatif bersih.
- `src/app/components/`: component UI dan business component.
- `src/app/views/`: view besar yang menggabungkan component, query, state, dan workflow.
- `hooks/`: custom hook khusus feature/domain.
- `helper/`: formatter, mapper, converter, dan helper lokal.
- `form/`: field group, form section, submit handler, dan form logic.
- `validation/`: schema Yup/Zod dan validasi payload.
- `store/`: Zustand store khusus feature/domain.
- `utils/`: utility yang benar-benar lintas feature.

Jangan membuat semua folder sekaligus. Buat hanya folder yang memang diperlukan.

## 4. Component Placement

Letakkan component di dalam feature jika hanya digunakan satu feature, memiliki business rule atau permission khusus, masih sering berubah, atau props-nya belum stabil.

```text
Claim/
├── index.tsx
├── components/
│   ├── ClaimHeader.tsx
│   ├── ClaimStatus.tsx
│   └── ClaimAction.tsx
├── form/
├── helper/
├── validation/
└── table/
```

Pindahkan component ke global/common hanya jika:

- Digunakan oleh lebih dari satu feature.
- Tidak mengandung business rule khusus.
- API/props sudah stabil.
- Behavior konsisten untuk semua pemakai.

Jangan memindahkan component ke common hanya karena file terlalu besar.

## 5. Urutan Isi File TSX

Urutan default:

```text
1. Imports
2. Types dan local constants
3. Component declaration
4. State dan hooks
5. Function/helper
6. useEffect
7. UI configuration
8. return JSX
```

Contoh:

```tsx
import { useEffect, useState } from 'react';

type Props = {
  id: string;
};

const DEFAULT_PAGE = 1;

export default function Example({ id }: Props) {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    // Ambil data melalui service/query hook.
  };

  const handleSubmit = async () => {
    // Handle mutation.
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return <section>{/* UI */}</section>;
}
```

- Semua hook harus berada di top-level component.
- Jangan memanggil hook secara conditional.
- Function yang dipakai `useEffect` diletakkan sebelum `useEffect`.
- Hindari function inline yang kompleks di JSX.
- Pecah JSX menjadi subcomponent jika memiliki tanggung jawab jelas.
- `index.tsx` menjadi orchestrator, bukan tempat seluruh detail implementasi.
- Gunakan functional component.
- Gunakan `forwardRef` hanya jika parent memang perlu mengendalikan ref.
- Component berbasis `forwardRef` wajib memiliki `displayName`.

## 6. API dan Data Fetching

Gunakan pola utama:

```text
React Query → Axios service → API route/backend
```

### React Query

Gunakan `useQuery` untuk GET, detail, list/table, caching, loading/error, dan refetch.

Gunakan `useMutation` untuk create, update, delete, approval, reject, OTP action, upload, download, dan workflow action.

### Larangan

- Component tidak boleh memanggil Axios secara langsung.
- Component tidak boleh memanggil `fetch` secara langsung jika service Axios sudah tersedia.
- Jangan menaruh URL API mentah di JSX.
- Jangan menggandakan logic request di banyak component.
- Jangan memasukkan business rule ke Axios client.
- Jangan mengubah bentuk response API tanpa mapper yang jelas.
- Jangan menyembunyikan error request.

### Pembagian tanggung jawab

- Axios service: HTTP method, URL, params, body, session/token forwarding, normalisasi error transport, dan status umum `401/403/503`.
- React Query: cache, query key, loading, error, refetch, mutation, invalidation.
- Component/View: UI, kapan query/mutation dijalankan, feedback user, permission, dan workflow UI.

```text
Component/View
    ↓
React Query hook
    ↓
Axios service
    ↓
API route/backend
```

## 7. Service Layer dan Axios Interceptor

Gunakan pola service seperti `nextjs-simpp-eiqc` jika aplikasi memiliki komunikasi HTTP yang cukup kompleks. Pada aplikasi baru, buat layer ini hanya jika memang ada API/backend atau lebih dari satu request yang perlu berbagi konfigurasi.

### Struktur dinamis

```text
src/
├── service/ atau services/
│   ├── client.ts       # request dari browser/client component
│   ├── server.ts       # request dari server component, route handler, atau server action
│   ├── http.ts         # optional: shared types/error utilities
│   └── [feature].service.ts
└── config/
    └── app.ts           # optional: public, non-secret runtime constants
```

- Ikuti nama folder yang sudah dipakai repository; jangan membuat `service` dan `services` sekaligus.
- `client.ts` dan `server.ts` adalah dua transport boundary, bukan tempat business logic.
- Feature service berisi endpoint, params, body, response type, dan mapper feature tersebut.
- React Query hook memanggil feature service; component tidak memanggil Axios/fetch langsung.
- Jika aplikasi baru hanya memakai data lokal atau Supabase client langsung, jangan membuat interceptor kosong demi mengikuti pola.

### Client interceptor

`service/client.ts` dipakai dari browser atau Client Component.

- Buat satu Axios instance client dengan `baseURL` yang konsisten.
- Gunakan URL relative seperti `/api` jika frontend dan API berada pada origin yang sama; ini adalah default untuk aplikasi baru tanpa environment variable.
- Jika API berada di origin lain, baca base URL dari konfigurasi public yang aman; jangan hardcode URL berbeda di setiap service.
- Request interceptor hanya menambahkan metadata yang aman atau token yang memang tersedia di browser.
- Jangan membaca service-role key, private API key, atau secret server di client bundle.
- Jangan menyalin access token ke `localStorage` jika session cookie httpOnly sudah menjadi mekanisme auth.
- Response interceptor harus menormalisasi error transport, menangani `401/403/503`, dan meneruskan error terstruktur ke React Query.
- Jangan melakukan redirect global untuk semua `401`; bedakan request browser, route auth, dan kebutuhan UI agar tidak terjadi redirect loop.
- Jangan menampilkan request header, cookie, token, atau response secret dalam log.

Contoh minimal untuk aplikasi baru tanpa env:

```ts
// src/service/client.ts
import axios from 'axios';

export const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    return Promise.reject({
      status,
      message: error.response?.data?.message ?? 'Request failed',
      cause: error,
    });
  },
);
```

### Server interceptor

`service/server.ts` dipakai dari Server Component, route handler, server action, atau backend adapter.

- Buat Axios instance server-side per request jika konfigurasi membawa cookie, claims, atau user context.
- Forward cookie/session hanya dari request server yang sedang diproses; jangan memakai mutable global singleton antar-user.
- Jika autentikasi menggunakan Supabase SSR, gunakan server client resmi dan cookie API; jangan mengambil token dari client secara manual.
- Jika backend membutuhkan API key, simpan dan baca hanya di server-side configuration; jangan menaruhnya pada `NEXT_PUBLIC_*` atau file source.
- Pada aplikasi baru tanpa env dan tanpa backend private, gunakan relative URL atau jangan buat server interceptor.
- Jika ada secret tetapi belum ada mekanisme secret injection, berhenti dan minta konfigurasi deployment; jangan mengakalinya dengan hardcode.
- Normalisasi error server tanpa membocorkan stack trace, header, cookie, query sensitif, atau credential.
- Preserve status `401`, `403`, `404`, `422`, dan `5xx`; jangan mengubah semua error menjadi `200`.
- Propagasi correlation/request ID hanya jika tersedia dan tidak mengandung credential.

### Tanpa environment variable

Tidak adanya `.env` bukan alasan untuk memasukkan secret ke source code.

| Kebutuhan                                               | Pola aplikasi baru                                                                                                    |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Frontend memanggil API pada origin sama                 | `baseURL: '/api'`                                                                                                     |
| Public non-secret config                                | `src/config/app.ts` dengan nilai default terpusat                                                                     |
| Supabase public URL/key                                 | boleh memakai config public sementara, tetapi siapkan migrasi ke runtime config; key tetap public dan RLS wajib benar |
| API key, service-role key, database URL, private secret | wajib server-side secret store/env; jangan hardcode                                                                   |
| Tidak ada API/backend                                   | hapus interceptor dan service transport; gunakan data layer yang memang diperlukan                                    |

- Jangan membuat `.env.local` hanya karena template biasa melakukannya.
- Jangan menganggap semua nilai konfigurasi harus environment variable.
- Jangan menganggap environment variable dapat membuat secret aman jika dipakai di client.
- Dokumentasikan konfigurasi public dan secret secara terpisah di README atau `.env.example` hanya jika memang diperlukan.

### Aturan pembuatan dari nol

1. Mulai dengan `client.ts` hanya jika browser membutuhkan HTTP client terpusat.
2. Tambahkan `server.ts` hanya saat ada server-side request, cookie forwarding, atau secret backend.
3. Tambahkan feature service setelah endpoint pertama nyata tersedia.
4. Tambahkan interceptor request/response hanya untuk behavior lintas request yang terbukti diperlukan.
5. Uji minimal: URL, method, payload, status `401/403`, error shape, cookie forwarding, dan tidak adanya secret pada client bundle.

## 8. API Route dan Workflow

API route harus mengikuti domain dan action yang jelas. Pisahkan CRUD, approval, reject, OTP, upload, download, import, parsing, validation, dan audit/history.

Jangan membuat satu endpoint besar untuk terlalu banyak workflow berbeda.

API handler wajib:

1. Memvalidasi input.
2. Memvalidasi session/authentication.
3. Memvalidasi permission/authorization.
4. Menjalankan business operation.
5. Mengembalikan response konsisten.
6. Menangani error secara eksplisit.
7. Tidak membocorkan stack trace atau detail internal ke client.
8. Tidak menerima user ID, role, atau permission dari client sebagai sumber kebenaran tanpa verifikasi server.

Workflow approval harus eksplisit:

```text
draft → review → approved → published
```

Jangan membuat transisi tersembunyi melalui banyak conditional yang sulit diaudit.

## 9. State Management

### TanStack React Query

Gunakan untuk server state: data API, cache, loading, error, refetch, mutation, dan invalidation.

### Zustand

Gunakan untuk client/UI state: modal, sidebar, filter, active tab, menu, role-related UI state, temporary workflow state, dan local interaction state lintas component.

Jangan menyimpan server response permanen di Zustand jika React Query sudah menjadi source of truth.

Jangan membuat Zustand store global jika state hanya dipakai satu feature.

## 10. Form dan Validation

### Foldering form

Gunakan form folder secara feature-oriented seperti pola aplikasi SIMPP/Duitku. Form yang hanya dipakai satu workflow harus tinggal dekat dengan modal, page, atau feature pemiliknya.

```text
src/
├── components/
│   └── Form/                         # primitive reusable lintas feature
│       ├── FormInput/
│       │   └── index.tsx
│       ├── FormSelect/
│       │   └── index.tsx
│       └── FormTextArea/
│           └── index.tsx
└── view/ atau features/
    └── [Domain]/
        └── components/
            └── [WorkflowModal]/
                ├── index.tsx         # orchestrator UI + submit workflow
                ├── form/
                │   └── index.ts      # default values, form type, config ringan
                ├── validation/
                │   └── index.ts      # schema Yup/Zod workflow
                ├── fields/           # optional: field group yang kompleks
                └── helper/           # optional: mapper/formatter khusus form
```

Aturan folder:

- `components/Form/` atau folder primitive setara hanya berisi input reusable: label, error display, disabled/loading state, ref forwarding, dan behavior UI umum.
- Form primitive tidak boleh mengetahui endpoint, permission, business rule, atau nama field domain tertentu.
- `[WorkflowModal]/index.tsx` menjadi orchestrator: menyusun field, menghubungkan React Hook Form, menjalankan mutation, menampilkan feedback, dan mengatur close/reset.
- `form/index.ts` menyimpan `defaultValues`, tipe form, atau konfigurasi field yang benar-benar lokal. Jangan menaruh schema validasi di sini.
- `validation/index.ts` menyimpan schema Yup/Zod dan pesan validasi workflow. Validasi server tetap wajib.
- `fields/` hanya dibuat jika section field memiliki tanggung jawab atau reuse lokal yang jelas; form sederhana tetap langsung di `index.tsx`.
- `helper/` hanya untuk mapper/formatter lokal, bukan tempat menyimpan request API atau business rule global.
- Jika satu form dipakai oleh create dan edit, gunakan form folder milik domain dengan `defaultValues` yang dapat menerima initial data; jangan menduplikasi schema tanpa alasan.
- Jika form hanya dipakai sekali, jangan memindahkannya ke global/common.
- Nama folder workflow harus menjelaskan domain dan action, misalnya `ModalAddCategory`, `ModalEditWallet`, atau `FormTransaction`.
- Gunakan satu konvensi casing yang mengikuti repository target; jangan mencampur `form`, `Form`, dan `forms` tanpa alasan kompatibilitas.

### Form dari nol

Pada aplikasi baru, mulai dari struktur minimum dan perluas hanya ketika kompleksitas form membuktikannya:

```text
features/
└── [feature]/
    ├── components/
    │   └── [FeatureForm].tsx
    ├── validation/
    │   └── [feature].schema.ts
    └── hooks/
        └── use[Feature]Mutation.ts
```

Tambahkan `form/`, `fields/`, `helper/`, atau modal folder hanya ketika default values, field groups, atau workflow memang sudah cukup kompleks. Jangan membuat semua folder sebagai template kosong.

### Batas tanggung jawab

```text
Form UI → React Hook Form → Yup/Zod → mutation/query hook → feature service → API/backend
```

- Primitive UI menangani tampilan dan interaction umum.
- React Hook Form menangani field state, submit, touched/dirty, dan error state.
- Yup/Zod menangani bentuk dan validasi input.
- Hook mutation menangani loading, request lifecycle, invalidation, dan feedback.
- Feature service menangani HTTP transport; form tidak memanggil Axios/fetch langsung.
- API/backend mengulang validasi dan authorization sebagai sumber kebenaran.

Gunakan pola:

```text
React Hook Form → Yup/Zod schema → API payload
```

Form wajib memiliki default values, type form data, schema validation, error message, submitting/loading state, disabled state, success feedback, failure feedback, dan reset behavior jika diperlukan.

- Schema validasi diletakkan di folder `validation/`.
- Form khusus feature diletakkan dekat feature.
- Jangan menaruh schema bisnis feature ke global/common tanpa reuse nyata.
- Jangan menduplikasi aturan validasi create dan edit jika kontraknya sama.
- Validasi client tidak menggantikan validasi server.
- API tetap wajib memvalidasi payload.

```text
Feature/
├── form/
│   ├── FeatureForm.tsx
│   └── fields/
├── validation/
│   └── feature.schema.ts
└── hooks/
    └── useFeatureMutation.ts
```

## 11. Permission dan Session

Permission harus diperiksa di dua lapisan:

1. UI untuk menyembunyikan atau menonaktifkan action.
2. Server/API untuk mencegah unauthorized access.

Jangan menganggap action aman hanya karena tombol tidak terlihat.

Pertahankan pola authentication, session, JWT/session forwarding, middleware, wrapper, dan permission hook yang sudah dipakai project. Jangan mengganti sistem authentication tanpa instruksi eksplisit.

- `401`: unauthenticated/session invalid.
- `403`: authenticated tetapi tidak memiliki permission.
- `503`: dependency/service unavailable.

Jangan mengubah semua error menjadi `200`.

## 12. Supabase Authentication

Jika project menggunakan Supabase Auth, gunakan pola SSR yang memisahkan browser client, server client, dan request/session refresh.

### Environment

- Pada repository existing, ikuti nama konfigurasi Supabase yang sudah dipakai.
- Pada aplikasi baru, gunakan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` bila environment/runtime config tersedia.
- Jika aplikasi baru sengaja tidak menggunakan env, letakkan hanya nilai Supabase yang memang public di satu file config public terpusat; jangan menyebarkannya ke service atau component.
- Legacy anon key hanya digunakan jika repository existing memang masih menggunakannya atau provider belum mendukung publishable key.
- Jangan pernah menaruh service-role key di variable `NEXT_PUBLIC_*`.
- Service-role key hanya boleh berada di server-side environment dan tidak boleh dikirim ke browser.
- Jangan mencetak token, key, cookie, atau secret ke log, response, screenshot, atau commit.

### Browser client

Buat client browser menggunakan `@supabase/ssr` dan `createBrowserClient`.

- Client browser boleh digunakan oleh Client Component.
- Gunakan client ini untuk login, sign-up, logout, reset password, dan subscription auth state.
- Jangan membuat singleton server client yang menyimpan request atau cookie antar-user.

Contoh pola ketika public config tersedia:

```ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
```

### Server client

Buat server client baru di setiap request atau pemanggilan server-side function.

- Gunakan `createServerClient` dari `@supabase/ssr`.
- Hubungkan client ke `cookies().getAll()` dan `cookies().setAll()`.
- Jangan menyimpan server client dalam global variable.
- Error saat `setAll` dipanggil dari Server Component dapat diabaikan hanya jika proxy/request layer bertanggung jawab memperbarui cookie session.

### Session refresh/proxy

Request/session refresh harus berjalan di proxy atau middleware sesuai router project.

- Buat server client baru untuk setiap request.
- Salin cookie dari request ke response dengan benar.
- Jalankan `supabase.auth.getClaims()` untuk memvalidasi session pada request layer.
- Jangan menaruh logic lain di antara pembuatan server client dan `getClaims()` yang dapat mengganggu refresh session.
- Selalu kembalikan response yang membawa cookie Supabase terbaru.
- Jika membuat `NextResponse` baru, teruskan request dan salin cookies response sebelumnya.
- Jangan memperbarui session hanya berdasarkan data client-side.

### Route protection

- Route private harus mengarahkan user tanpa claims/session ke halaman login.
- Halaman auth seperti login, sign-up, forgot password, confirm, dan callback harus dapat diakses tanpa session.
- User yang sudah login dapat diarahkan dari halaman auth ke dashboard/home private.
- Daftar public path harus eksplisit dan sesingkat mungkin.
- API route yang tidak memiliki session harus mengembalikan JSON `401`, bukan redirect HTML, jika dipanggil sebagai API.
- Bedakan `401` (belum login) dan `403` (sudah login tetapi tidak berwenang).

### Auth state di client

Jika membutuhkan data user/profile di Client Component:

1. Ambil claims/session melalui client Supabase.
2. Ambil profile berdasarkan `claims.sub` atau user ID yang sudah diverifikasi.
3. Simpan `isLoading`, `error`, `claims`, dan `profile` secara eksplisit.
4. Sediakan fungsi `refresh` jika profile dapat berubah.
5. Jangan mengambil profile menggunakan user ID dari input bebas tanpa mengikatnya ke session.
6. Redirect ke login hanya setelah kegagalan auth terdeteksi dan hindari redirect loop.

### API authentication tambahan

Jika project juga menyediakan API key untuk integrasi eksternal, pisahkan dua flow:

- Supabase JWT/session cookie: flow utama aplikasi browser.
- API key Bearer: flow integrasi eksternal.

Aturan API key:

- Gunakan `Authorization: Bearer <API_KEY>`.
- Bedakan API key dari Supabase JWT secara aman; jangan menganggap semua Bearer token sebagai API key.
- Validasi API key di server dengan hash, expiry, owner/user ID, dan scopes.
- API key invalid/expired harus menghasilkan JSON `401`.
- Scope tidak cukup hanya disembunyikan di UI; validasi harus dilakukan di server.
- Gunakan `403` jika key valid tetapi scope tidak mencukupi.
- Jangan pernah menyimpan plain API key; simpan hash dan tampilkan plain key hanya sekali saat dibuat.
- Audit penggunaan key secara server-side tanpa membocorkan secret.

## 13. UI dan Styling

Gunakan styling system yang sudah dipakai repository target. Jangan menambahkan styling framework baru tanpa kebutuhan dan persetujuan eksplisit.

- Pertahankan tema existing.
- Pertahankan spacing, color token, typography, dan interaction pattern existing.
- Jangan membuat theme baru tanpa kebutuhan.
- Jangan memakai inline style jika Tailwind atau existing class sudah cukup.
- Jangan menggunakan global CSS untuk kebutuhan satu component.
- Jangan menambahkan dependency UI baru jika styling system existing sudah cukup, kecuali aturan default Shadcn di bawah berlaku.
- Jangan mengganti seluruh component hanya karena ingin style berbeda.

### Default Shadcn UI

Jika tidak ada perintah spesifik tentang component UI, gunakan Shadcn UI sebagai baseline dan siapkan seluruh component resmi Shadcn yang tersedia untuk repository tersebut.

- Pada aplikasi baru dari nol, inisialisasikan Shadcn lalu ambil seluruh component resmi yang kompatibel dengan framework, router, Tailwind, dan package manager project.
- Pada repository existing, pertahankan seluruh component, wrapper, variant, token, dan modifikasi lokal yang sudah ada.
- Component Shadcn yang belum ada boleh ditambahkan satu per satu atau melalui proses batch yang aman; jangan menimpa file existing secara otomatis.
- Sebelum menambah component, cek apakah nama/path sudah digunakan. Jika sudah ada, gunakan component existing atau buat wrapper/variant baru tanpa menghapus implementasi lama.
- Source primitive Shadcn tetap berada di lokasi convention project, biasanya `src/components/ui/`; sesuaikan jika repository memakai path lain.
- Component bisnis tetap berada di feature/domain; jangan memasukkan business rule ke `components/ui`.
- Jangan mengganti component existing dengan versi Shadcn hanya karena implementasinya berbeda.
- Jika terjadi konflik nama, prioritaskan behavior dan API existing, lalu tambahkan Shadcn dengan nama yang tidak merusak import lama.
- Semua component yang diambil harus melewati lint, typecheck, dan build; hapus component yang benar-benar tidak kompatibel, bukan memaksa workaround besar.
- Aturan ini tidak mengharuskan pemasangan Shadcn pada project yang secara eksplisit memakai design system lain dan meminta system tersebut dipertahankan.
- Prioritaskan responsive layout.
- Pertahankan accessibility: label form, keyboard navigation, focus state, aria label untuk icon-only button, dialog focus management, dan loading/disabled state.

Saat memperbaiki UI:

1. Pertahankan data flow.
2. Pertahankan event handler.
3. Pertahankan query/mutation.
4. Pertahankan permission.
5. Pertahankan route.
6. Ubah hanya structure/styling yang diperlukan.
7. Verifikasi tidak ada regression behavior.

## 14. Modal, Table, dan Workflow UI

### Modal

- Modal tidak boleh menyimpan terlalu banyak business logic.
- Parent mengontrol lifecycle jika modal dipakai untuk workflow.
- Confirm action harus jelas.
- Destructive action wajib memiliki confirmation.
- Loading state harus terlihat.
- Modal harus dapat ditutup dengan aman tanpa kehilangan data secara tidak sengaja.

### Table

```text
Feature/
└── table/
    ├── columns.tsx
    ├── RowActions.tsx
    └── TableToolbar.tsx
```

- Column definition tidak ditulis berulang di page besar.
- Pagination dan filter harus konsisten.
- Loading, empty, error, dan not-found state harus tersedia.
- Row action tetap menghormati permission.

### Workflow

- Tampilkan status aktif.
- Disable action yang tidak valid untuk status tersebut.
- Jangan hanya mengandalkan warna untuk membedakan status.
- Setelah mutation berhasil, invalidate query terkait.
- Berikan feedback sukses/gagal yang jelas.

## 15. File Besar

Jika component melebihi sekitar 600 baris, evaluasi pemecahan berdasarkan tanggung jawab:

```text
Component/
├── index.tsx
├── components/
├── helper/
├── form/
├── validation/
├── table/
├── hooks/
└── store/
```

Pisahkan jika terdapat form, table, modal, mapper/formatter, query/mutation hook, state store, atau subcomponent dengan tanggung jawab sendiri.

Jangan memecah berdasarkan jumlah baris secara mekanis. Tetap pertahankan `index.tsx` sebagai orchestrator.

## 16. Naming

- Component: `PascalCase`.
- Hook: `useSomething`.
- Helper: nama berdasarkan fungsi.
- Schema: `[feature].schema.ts`.
- Service: `[feature].service.ts`.
- Store: `[feature].store.ts`.
- Type: nama domain yang jelas.
- Boolean: prefix `is`, `has`, `can`, atau `should`.
- Handler: prefix `handle`.
- Query hook: prefix `use...Query`.
- Mutation hook: prefix `use...Mutation`.

Hindari nama generik seperti `data`, `item`, `value`, `temp`, `handleFunction`, dan `doSomething` jika nama domain yang lebih jelas tersedia.

## 17. Error, Loading, dan Empty State

Setiap async UI yang relevan harus menangani loading, error, empty, success, unauthorized, dan forbidden jika applicable.

Jangan membiarkan UI kosong tanpa penjelasan.

Jangan menampilkan stack trace, database credentials, token, internal URL, raw server exception, atau query detail sensitif.

## 18. Perubahan yang Dilarang Tanpa Instruksi

AI tidak boleh melakukan hal berikut tanpa diminta eksplisit:

- Mengganti router atau pola routing existing.
- Memindahkan seluruh folder.
- Mengubah package manager existing.
- Mengganti HTTP client existing tanpa alasan teknis dan persetujuan eksplisit.
- Mengganti library data-fetching existing tanpa alasan teknis dan persetujuan eksplisit.
- Mengganti authentication/session flow existing.
- Mengubah API contract.
- Mengubah database schema.
- Menghapus route atau component lama.
- Mengubah permission behavior.
- Mengubah workflow status.
- Menghapus data.
- Push ke Git.
- Membuat commit.
- Mengubah environment production.
- Menambahkan dependency hanya untuk kebutuhan kecil.

## 19. Workflow AI Sebelum Coding

Sebelum mengubah code:

1. Identifikasi file target.
2. Baca component/page terkait.
3. Cari pemakaian component tersebut.
4. Cari query, mutation, service, store, dan permission terkait.
5. Identifikasi apakah file tersebut page, view, component, atau API.
6. Cari pola serupa di domain yang sama.
7. Tentukan perubahan minimal.
8. Jangan membuat file baru jika file existing masih tepat digunakan.

## 20. Workflow AI Setelah Coding

Setelah perubahan:

1. Periksa import yang tidak terpakai.
2. Periksa type error.
3. Periksa query key dan invalidation.
4. Periksa loading/error/empty state.
5. Periksa permission.
6. Periksa responsive UI jika perubahan visual.
7. Jalankan lint, typecheck, build, atau test yang tersedia.
8. Jangan push atau commit kecuali diminta.
9. Laporkan file yang diubah, file yang dibuat, logic yang dipertahankan, dependency yang ditambahkan, command verifikasi, dan error yang masih tersisa.

## 21. Prinsip Prioritas

Jika ada konflik aturan, gunakan prioritas berikut:

1. Pertahankan behavior existing.
2. Pertahankan security dan permission.
3. Pertahankan API/database contract.
4. Ikuti pola lokal feature.
5. Ikuti struktur dan konvensi repository target.
6. Hindari abstraksi premature.
7. Pilih perubahan paling kecil yang menyelesaikan masalah.
8. Verifikasi dengan lint, typecheck, build, atau test.
