'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/Forms/Input';
import CustomSelect from '@/components/Forms/CustomSelect';
import CustomDateRangePicker from '@/components/Forms/CustomDateRangePicker';
import FilterCard from '@/components/Common/FilterCard';
import DetailUlasanModal from '@/components/Common/DetailUlasanModal';
import Pagination from '@/components/Common/Pagination';
import { ulasanService, UlasanData, UlasanKpiData, UlasanParams } from '@/services/ulasan.service';
import { handleApiError } from '@/lib/api-error';

export default function DetailUlasanPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [rating, setRating] = useState('all');
  const [jenisLayanan, setJenisLayanan] = useState('all');
  const [periode, setPeriode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [listData, setListData] = useState<UlasanData | null>(null);
  const [kpiData, setKpiData] = useState<UlasanKpiData | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const isRentangTanggalDisabled = !!periode;
  const isPeriodeDisabled = !!startDate || !!endDate;

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const formatToDDMMYYYY = (dateStr: string) => {
    if (!dateStr) return undefined;
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const parts = dateStr.split('-');
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const formattedStartDate = formatToDDMMYYYY(startDate);
      const formattedEndDate = formatToDDMMYYYY(endDate);

      const params: UlasanParams = {
        page: currentPage,
        search: search || undefined,
        sort_by: sortBy,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        rating: rating !== 'all' ? Number(rating) : undefined,
        layanan_kode: jenisLayanan !== 'all' ? jenisLayanan : undefined,
      };

      const [listRes, kpiRes] = await Promise.all([
        ulasanService.getUlasan(params),
        ulasanService.getUlasanKpi({
          search: params.search,
          start_date: params.start_date,
          end_date: params.end_date,
          rating: params.rating,
          layanan_kode: params.layanan_kode
        })
      ]);

      if (listRes.status && listRes.data) {
        setListData(listRes.data);
        if (listRes.data.daftar_ulasan?.meta) {
          setTotalItems(listRes.data.daftar_ulasan.meta.total);
          setTotalPages(listRes.data.daftar_ulasan.meta.total_page);
          setPerPage(listRes.data.daftar_ulasan.meta.per_page);
        }
      }

      if (kpiRes.status && kpiRes.data) {
        setKpiData(kpiRes.data);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearch('');
    setSortBy('newest');
    setRating('all');
    setJenisLayanan('all');
    setPeriode('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);

    setTimeout(() => {
      fetchData();
    }, 0);
  };

  const handleFilter = () => {
    if (currentPage === 1) {
      fetchData();
    } else {
      setCurrentPage(1);
    }
  };

  const renderStars = (ratingNum: number) => {
    const stars = [];
    const fullStars = Math.floor(ratingNum);
    const hasHalfStar = ratingNum % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<i key={i} className="ri-star-fill"></i>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<i key={i} className="ri-star-half-fill"></i>);
      } else {
        stars.push(<i key={i} className="ri-star-line text-gray-300"></i>);
      }
    }
    return stars;
  };

  // Metrics Logic
  const avgRating = kpiData?.rata_rata_bintang || listData?.rata_rata_ulasan || 0;
  const totalReviews = listData?.total_ulasan || 0;
  
  const distCounts = {
    5: kpiData?.distribusi?.bintang_5 || listData?.total_rating?.['5'] || 0,
    4: kpiData?.distribusi?.bintang_4 || listData?.total_rating?.['4'] || 0,
    3: kpiData?.distribusi?.bintang_3 || listData?.total_rating?.['3'] || 0,
    2: kpiData?.distribusi?.bintang_2 || listData?.total_rating?.['2'] || 0,
    1: kpiData?.distribusi?.bintang_1 || listData?.total_rating?.['1'] || 0,
  };

  const getWidthPercent = (count: number) => {
    if (!totalReviews || totalReviews === 0) return '0%';
    return `${(count / totalReviews) * 100}%`;
  };

  const reviews = listData?.daftar_ulasan?.list || [];

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Filters (Top) */}
      <FilterCard onReset={handleReset} onApply={handleFilter}>
        <Input
          label="Pencarian Cepat"
          placeholder="Isi ulasan / nama..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <CustomSelect
          label="Periode"
          value={periode}
          onChange={(val) => setPeriode(String(val))}
          disabled={isPeriodeDisabled}
          placeholder="Pilih Periode"
          options={[
            { label: 'Januari', value: 1 },
            { label: 'Februari', value: 2 },
            { label: 'Maret', value: 3 },
            { label: 'April', value: 4 },
            { label: 'Mei', value: 5 },
            { label: 'Juni', value: 6 },
            { label: 'Juli', value: 7 },
            { label: 'Agustus', value: 8 },
            { label: 'September', value: 9 },
            { label: 'Oktober', value: 10 },
            { label: 'November', value: 11 },
            { label: 'Desember', value: 12 },
          ]}
        />
        <CustomDateRangePicker
          label="Rentang Tanggal"
          startDate={startDate}
          endDate={endDate}
          onChange={(start, end) => { setStartDate(start); setEndDate(end); }}
          disabled={isRentangTanggalDisabled}
          placeholder="Pilih Rentang Tanggal"
        />
        <CustomSelect
          label="Rating"
          value={rating}
          onChange={(val) => setRating(String(val))}
          options={[
            { label: 'Semua Rating', value: 'all' },
            { label: '5 Bintang', value: '5' },
            { label: '4 Bintang', value: '4' },
            { label: '3 Bintang', value: '3' },
            { label: '2 Bintang', value: '2' },
            { label: '1 Bintang', value: '1' },
          ]}
        />
        <CustomSelect
          label="Jenis Layanan"
          value={jenisLayanan}
          onChange={(val) => setJenisLayanan(String(val))}
          options={[
            { label: 'Semua Jenis Layanan', value: 'all' },
            { label: 'Kartu Keluarga', value: 'kk' },
            { label: 'KTP-el', value: 'ktp' },
            { label: 'KIA', value: 'kia' },
            { label: 'Akta Kelahiran', value: 'akta_kelahiran' },
            { label: 'Akta Kematian', value: 'akta_kematian' },
          ]}
        />
        <CustomSelect
          label="Urutkan Dari"
          value={sortBy}
          onChange={(val) => setSortBy(String(val))}
          options={[
            { label: 'Terbaru', value: 'newest' },
            { label: 'Terlama', value: 'oldest' },
            { label: 'Rating Tertinggi', value: 'rating_desc' },
            { label: 'Rating Terendah', value: 'rating_asc' },
          ]}
        />
      </FilterCard>

      {/* 2. Below Filters Layout */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 items-start transition-opacity duration-300 ${isLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
        {/* Left: Rating Breakdown (Summary Card) */}
        <div className="card shadow-sm border border-gray-100 lg:col-span-4 p-6 flex flex-col items-center bg-white sticky top-6">
          <span className="text-6xl font-bold font-manrope text-gray-900 mb-2">{avgRating.toFixed(1)}</span>
          <div className="flex gap-1 text-[#F59E0B] text-2xl mb-4">
            {renderStars(avgRating)}
          </div>
          <span className="text-sm font-semibold text-gray-500 mb-8">Berdasarkan {totalReviews.toLocaleString('id-ID')} Ulasan</span>

          <div className="w-full flex flex-col gap-4">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = distCounts[stars as keyof typeof distCounts];
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-700 w-12 text-right">{stars} Bintang</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: getWidthPercent(count) }}></div>
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-8">{count.toLocaleString('id-ID')}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Reviews List */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Reviews List */}
          <div className="flex flex-col gap-4 min-h-[400px]">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="card shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <i className="ri-user-3-line text-gray-500 text-xl"></i>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{review.nama}</h4>
                        <span className="text-xs font-semibold text-gray-500">{review.tanggal} {review.waktu && `, ${review.waktu}`}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex gap-0.5 text-[#F59E0B] text-xs">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={i < review.rating ? "ri-star-fill" : "ri-star-line text-gray-300"}></i>
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                        {review.layanan}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {review.ulasan}
                  </p>
                  <div className="flex justify-end items-center gap-4 border-t border-gray-50 pt-4 mt-2">
                    <button 
                      onClick={() => {
                        setSelectedReview({
                          name: review.nama,
                          date: `${review.tanggal} ${review.waktu}`,
                          content: review.ulasan,
                          rating: review.rating,
                          type: review.layanan,
                          jenisLayanan: review.layanan,
                          kecamatan: '-'
                        });
                        setIsModalOpen(true);
                      }}
                      className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors font-bold text-[10px] px-4 py-1.5 rounded-full cursor-pointer"
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-400 py-12 border border-gray-100 rounded-xl bg-white">
                Tidak ada ulasan ditemukan
              </div>
            )}
          </div>

          <div className="card shadow-sm border border-gray-100 p-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={perPage}
              onPageChange={setCurrentPage}
            />
          </div>

        </div>
      </div>
      
      <DetailUlasanModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        review={selectedReview}
      />
    </div>
  );
}