"use client"

import { useDeferredValue, useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  FileText,
  Globe2,
  MonitorSmartphone,
  RefreshCw,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EMPTY_PAGINATION } from "@/lib/pagination"
import { cn } from "@/lib/utils"
import BreakdownCard from "./components/BreakdownCard"
import SummaryCards from "./components/SummaryCards"
import VisitTrend from "./components/VisitTrend"
import VisitorsTable from "./components/VisitorsTable"
import { formatCountry, formatDevice } from "./helper/format"
import { useAdminVisits } from "./store"
import type {
  VisitBreakdown,
  VisitorRow,
  VisitRange,
  VisitSummary,
} from "./store/type"

const PER_PAGE = 20

const RANGE_OPTIONS: { value: VisitRange; label: string }[] = [
  { value: "7d", label: "7 hari" },
  { value: "30d", label: "30 hari" },
  { value: "90d", label: "90 hari" },
]

const EMPTY_SUMMARY: VisitSummary = {
  pageviews: 0,
  visitors: 0,
  todayPageviews: 0,
  online: 0,
}

const EMPTY_BREAKDOWN: VisitBreakdown[] = []
const EMPTY_ROWS: VisitorRow[] = []

export const VisitorsAdminView = () => {
  const { getAdminVisits } = useAdminVisits()
  const [range, setRange] = useState<VisitRange>("30d")
  const [device, setDevice] = useState("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const deferredSearch = useDeferredValue(search)

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["admin", "visits", range, device, page, deferredSearch],
    queryFn: () =>
      getAdminVisits({
        range,
        page,
        perPage: PER_PAGE,
        search: deferredSearch,
        device: device === "all" ? undefined : device,
      }),
  })

  const summary = data?.summary ?? EMPTY_SUMMARY
  const daily = data?.daily ?? []
  const pages = data?.pages ?? EMPTY_BREAKDOWN
  const countries = data?.countries ?? EMPTY_BREAKDOWN
  const devices = data?.devices ?? EMPTY_BREAKDOWN
  const rows = data?.data ?? EMPTY_ROWS
  const pagination = data?.pagination ?? EMPTY_PAGINATION

  const handleRangeChange = (value: VisitRange) => {
    setRange(value)
    setPage(1)
  }

  const handleDeviceChange = (value: string) => {
    setDevice(value)
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  useEffect(() => {
    if (!data) return
    if (data.pagination.total_pages > 0 && page > data.pagination.total_pages) {
      setPage(data.pagination.total_pages)
    }
  }, [data, page])

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Visitors
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Pengunjung unik berdasarkan browser. Lokasi dari header Vercel, IP
              di-hash, dan kunjungan berulang tidak membuat baris baru.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {RANGE_OPTIONS.map((option) => (
              <Button
                key={option.value}
                type="button"
                size="sm"
                variant={range === option.value ? "default" : "outline"}
                onClick={() => handleRangeChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            Filter tabel
          </span>
          <div className="relative">
            <Search
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Cari ID, kota, negara, halaman..."
              aria-label="Cari pengunjung"
              className="h-9 w-72 rounded-full pl-9"
            />
          </div>

          <Select value={device} onValueChange={handleDeviceChange}>
            <SelectTrigger size="sm" className="w-[160px]">
              <SelectValue placeholder="Semua perangkat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua perangkat</SelectItem>
              <SelectItem value="desktop">Desktop</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
              <SelectItem value="tablet">Tablet</SelectItem>
              <SelectItem value="unknown">Tidak diketahui</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={cn("size-3.5", isFetching && "animate-spin")}
            />
            Refresh
          </Button>
        </div>
      </div>

      <SummaryCards summary={summary} loading={isLoading} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VisitTrend daily={daily} loading={isLoading} />
        </div>
        <BreakdownCard
          title="Negara"
          description="Asal kunjungan berdasarkan kode negara."
          icon={<Globe2 className="size-4" />}
          items={countries}
          loading={isLoading}
          formatLabel={formatCountry}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <BreakdownCard
          title="Halaman populer"
          description="Halaman yang paling sering dibuka."
          icon={<FileText className="size-4" />}
          items={pages}
          loading={isLoading}
        />
        <BreakdownCard
          title="Perangkat"
          description="Sebaran pengunjung berdasarkan perangkat."
          icon={<MonitorSmartphone className="size-4" />}
          items={devices}
          loading={isLoading}
          formatLabel={formatDevice}
        />
      </div>

      <VisitorsTable
        rows={rows}
        pagination={pagination}
        loading={isLoading}
        error={isError}
        onRetry={() => refetch()}
        onPageChange={setPage}
      />
    </div>
  )
}
