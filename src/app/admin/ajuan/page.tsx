"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Forms/Input";
import CustomSelect from "@/components/Forms/CustomSelect";
import CustomDateRangePicker from "@/components/Forms/CustomDateRangePicker";
import Button from "@/components/Common/Button";
import FilterCard from "@/components/Common/FilterCard";
import Tabs from "@/components/Common/Tabs";
import Table from "@/components/Common/Table";
import Badge from "@/components/Common/Badge";
import Pagination from "@/components/Common/Pagination";
import dynamic from "next/dynamic";

const DetailModal = dynamic(() => import("@/components/Common/DetailModal"), { ssr: false });
import AjuanCharts from "@/components/Dashboard/AjuanCharts";
import { useKecamatanOptions, usePelaporOptions, useStatusOptions, useLayananOptions } from "@/hooks/useFilterOptions";
import { pengajuanService, AjuanListItem, PengajuanAjuanParams, ChartDataItem, ChartAjuanParams } from "@/services/pengajuan.service";
import { handleApiError } from "@/lib/api-error";
import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";

export default function Ajuan() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [pelapor, setPelapor] = useState("all");
  const [kecamatan, setKecamatan] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [periode, setPeriode] = useState<string | number>('');
  const [sortBy, setSortBy] = useState("newest");
  const [filterStatus, setFilterStatus] = useState("all");

  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    pelapor: "all",
    kecamatan: "all",
    startDate: "",
    endDate: "",
    periode: "" as string | number,
    sortBy: "newest",
    filterStatus: "all",
  });

  const { data: pelaporOptions = [] } = usePelaporOptions({ addAllOption: true, allOptionLabel: "Semua Pelapor" });
  const { data: kecamatanOptions = [] } = useKecamatanOptions({ addAllOption: true, allOptionLabel: "Seluruh Kecamatan" });
  const { data: statusOptions = [] } = useStatusOptions({ addAllOption: true, allOptionLabel: "Semua Status" });
  const { data: layananOptions = [] } = useLayananOptions({ addAllOption: true, allOptionLabel: "SEMUA", allOptionValue: "semua" });

  const [perPage, setPerPage] = useState(10);

  const isRentangTanggalDisabled = !!periode;
  const isPeriodeDisabled = !!startDate || !!endDate;

  const formatToDDMMYYYY = (dateStr: string) => {
    if (!dateStr) return undefined;
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const parts = dateStr.split("-");
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const params: PengajuanAjuanParams = {
    search: appliedFilters.search || undefined,
    kecamatan: appliedFilters.kecamatan !== "all" ? appliedFilters.kecamatan : undefined,
    pelapor: appliedFilters.pelapor !== "all" ? appliedFilters.pelapor : undefined,
    start_date: formatToDDMMYYYY(appliedFilters.startDate),
    end_date: formatToDDMMYYYY(appliedFilters.endDate),
    periode: appliedFilters.periode ? Number(appliedFilters.periode) : undefined,
    layanan: activeTab !== "semua" ? activeTab : undefined,
    status: appliedFilters.filterStatus !== "all" ? appliedFilters.filterStatus : undefined,
    sort: appliedFilters.sortBy,
    page: currentPage,
    per_page: perPage,
  };

  const chartParams: ChartAjuanParams = {
    start_date: formatToDDMMYYYY(appliedFilters.startDate) || undefined,
    end_date: formatToDDMMYYYY(appliedFilters.endDate) || undefined,
    periode_bulan: appliedFilters.periode ? Number(appliedFilters.periode) : undefined,
    id_kecamatan: appliedFilters.kecamatan !== "all" ? appliedFilters.kecamatan : undefined,
    kecamatan: appliedFilters.kecamatan !== "all" ? appliedFilters.kecamatan : undefined,
    id_layanan: activeTab !== "semua" ? activeTab : undefined,
    layanan: activeTab !== "semua" ? activeTab : undefined,
    id_pelapor: appliedFilters.pelapor !== "all" ? appliedFilters.pelapor : undefined,
    pelapor: appliedFilters.pelapor !== "all" ? appliedFilters.pelapor : undefined,
    status: appliedFilters.filterStatus !== "all" ? appliedFilters.filterStatus : undefined,
    search: appliedFilters.search || undefined,
  };

  const queryClient = useQueryClient();

  const handlePageHover = (page: number) => {
    queryClient.prefetchQuery({
      queryKey: ["ajuan", { ...params, page }],
      queryFn: () => pengajuanService.getAjuan({ ...params, page }),
    });
  };

  const {
    data: ajuanRes,
    isLoading: isAjuanLoading,
    isFetching: isAjuanFetching,
  } = useQuery({
    queryKey: ["ajuan", params],
    queryFn: () => pengajuanService.getAjuan(params),
    placeholderData: keepPreviousData,
  });

  const { data: chartRes, isLoading: isChartLoading } = useQuery({
    queryKey: ["ajuanChart", chartParams],
    queryFn: () => pengajuanService.getChartAjuan(chartParams),
    placeholderData: keepPreviousData,
  });

  const data = ajuanRes?.data || [];
  const totalItems = ajuanRes?.meta?.total || 0;
  const totalPages = ajuanRes?.meta?.total_page || 1;
  const isLoading = isAjuanLoading;

  const chartStatus = chartRes?.data?.chart_status || [];
  const chartLayanan = chartRes?.data?.chart_layanan || [];

  const handleReset = useCallback(() => {
    setSearch("");
    setPelapor("all");
    setKecamatan("all");
    setStartDate("");
    setEndDate("");
    setPeriode("");
    setSortBy("newest");
    setFilterStatus("all");
    setAppliedFilters({
      search: "",
      pelapor: "all",
      kecamatan: "all",
      startDate: "",
      endDate: "",
      periode: "" as string | number,
      sortBy: "newest",
      filterStatus: "all",
    });
    setCurrentPage(1);
  }, []);

  const handleFilter = useCallback(() => {
    setAppliedFilters({
      search,
      pelapor,
      kecamatan,
      startDate,
      endDate,
      periode,
      sortBy,
      filterStatus,
    });
    setCurrentPage(1);
  }, [search, pelapor, kecamatan, startDate, endDate, periode, sortBy, filterStatus]);

  const tabs = useMemo(
    () =>
      layananOptions.map((option: any) => ({
        id: String(option.value),
        label: String(option.label).toUpperCase(),
      })),
    [layananOptions],
  );

  const tableColumns = useMemo(
    () => [
      { key: "no", header: "No", fixed: true, width: 60, minWidth: 60, left: 0 },
      { key: "noRegis", header: "NO. REG", fixed: true, minWidth: 160, left: 60 },
      { key: "kodeLayanan", header: "KODE LAYANAN" },
      { key: "jenisAjuan", header: "JENIS AJUAN" },
      { key: "jalur", header: "JALUR ONLINE / OFFLINE" },
      { key: "pelapor", header: "PELAPOR" },
      {
        key: "status",
        header: "STATUS",
        render: (row: any) => {
          let variant: "primary" | "default" | "success" | "danger" | "warning" = "default";
          if (row.status === "DIVERIFIKASI") variant = "primary";
          else if (row.status === "DIPROSES") variant = "default";
          else if (row.status === "DISETUJUI") variant = "success";
          else if (row.status === "DITOLAK") variant = "danger";
          else if (row.status === "MENUNGGU") variant = "warning";

          return <Badge variant={variant as any}>{row.status}</Badge>;
        },
      },
      {
        key: "tanggal",
        header: "TANGGAL",
        render: (row: any) => (
          <div className="flex flex-col">
            <span>{row.tanggal}</span>
            <span className="text-[10px] text-text-secondary font-bold">{row.waktu}</span>
          </div>
        ),
      },
      { key: "kecamatan", header: "KECAMATAN" },
    ],
    [],
  );

  const mappedData = useMemo(
    () =>
      data.map((ajuan, index) => {
        let tanggal = "-";
        let waktu = "-";
        if (ajuan.tanggal_parse) {
          const dateStr = ajuan.tanggal_parse.replace(", ", "T");
          const dateObj = new Date(dateStr);
          if (!isNaN(dateObj.getTime())) {
            tanggal = dateObj.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "");
            waktu = dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
          } else {
            tanggal = ajuan.tanggal.split(",")[0] || ajuan.tanggal;
            waktu = ajuan.tanggal.split(",")[1] ? ajuan.tanggal.split(",")[1].trim() + " WIB" : "-";
          }
        } else if (ajuan.tanggal) {
          tanggal = ajuan.tanggal;
        }

        return {
          id: ajuan.id,
          no: String((currentPage - 1) * perPage + index + 1).padStart(2, "0"),
          noRegis: ajuan.no_regis || "-",
          kodeLayanan: ajuan.kode_layanan || "-",
          jenisAjuan: ajuan.jenis_ajuan || "-",
          jalur: ajuan.jalur || "-",
          nama: ajuan.nama || "-",
          pelapor: ajuan.pelapor || "-",
          nik: ajuan.nik || "-",
          kecamatan: ajuan.kecamatan || "-",
          tanggal,
          waktu,
          status: ajuan.status || "MENUNGGU",
          originalData: ajuan,
        };
      }),
    [data, currentPage, perPage],
  );

  const handleRowClick = (row: any) => {
    setSelectedData({
      id: row.id,
      noRegis: row.noRegis,
      namaLengkap: row.nama,
      nik: row.nik,
      jenisLayanan: row.kodeLayanan || row.jenisAjuan,
      kecamatan: row.kecamatan,
      status: row.status,
      tanggal: row.tanggal,
      waktu: row.waktu,
    });
    setIsModalOpen(true);
  };

  const handleExport = async () => {
    try {
      await pengajuanService.exportPengajuan("all");
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Card */}
      <FilterCard onReset={handleReset} onApply={handleFilter}>
        <Input label="Pencarian Cepat" placeholder="No. Regis, dll" icon="ri-search-line" value={search} onChange={(e) => setSearch(e.target.value)} />
        <CustomSelect label="Kecamatan" value={kecamatan} onChange={(val) => setKecamatan(String(val))} options={kecamatanOptions} />
        <CustomSelect label="Pelapor" value={pelapor} onChange={(val) => setPelapor(String(val))} options={pelaporOptions} />
        <CustomDateRangePicker
          label="Rentang Tanggal"
          startDate={startDate}
          endDate={endDate}
          onChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
          disabled={isRentangTanggalDisabled}
          placeholder="Pilih Rentang Tanggal"
        />
        <CustomSelect
          label="Periode"
          value={periode}
          onChange={(val) => setPeriode(val)}
          disabled={isPeriodeDisabled}
          placeholder="Pilih Periode"
          options={[
            { label: "Januari", value: 1 },
            { label: "Februari", value: 2 },
            { label: "Maret", value: 3 },
            { label: "April", value: 4 },
            { label: "Mei", value: 5 },
            { label: "Juni", value: 6 },
            { label: "Juli", value: 7 },
            { label: "Agustus", value: 8 },
            { label: "September", value: 9 },
            { label: "Oktober", value: 10 },
            { label: "November", value: 11 },
            { label: "Desember", value: 12 },
          ]}
        />
        <CustomSelect
          label="Urutkan Dari"
          value={sortBy}
          onChange={(val) => setSortBy(String(val))}
          options={[
            { label: "Terbaru", value: "newest" },
            { label: "Terlama", value: "oldest" },
          ]}
        />
        <CustomSelect label="Status Ajuan" value={filterStatus} onChange={(val) => setFilterStatus(String(val))} options={statusOptions} />
      </FilterCard>

      <AjuanCharts chartStatus={chartStatus} chartLayanan={chartLayanan} isLoading={isChartLoading} />

      {/* Table Card */}
      <div className={`card shadow-sm border border-border flex flex-col p-0 overflow-hidden transition-opacity duration-300 ${isLoading ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
        <div className="p-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-text-primary">Tabel Ajuan</h3>
          <Button variant="primary" icon="ri-download-2-line" iconPosition="left" size="sm" onClick={handleExport}>
            EXPORT EXCEL
          </Button>
        </div>

        <div className="px-6">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="w-full mt-2 min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-sm py-12">
              <i className="ri-loader-4-line text-3xl animate-spin mb-3 text-primary"></i>
              <span className="font-bold text-text-secondary animate-pulse">Sedang memuat data...</span>
            </div>
          ) : mappedData.length > 0 ? (
            <Table columns={tableColumns} data={mappedData} onRowClick={handleRowClick} />
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-text-secondary py-12">Tidak ada data ditemukan</div>
          )}
        </div>

        <div className="p-6 border-t border-border">
          <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} itemsPerPage={perPage} onPageChange={setCurrentPage} onPageHover={handlePageHover} />
        </div>
      </div>

      {isModalOpen && <DetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={selectedData} />}
    </div>
  );
}
