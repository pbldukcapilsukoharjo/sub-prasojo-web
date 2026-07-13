import { useQuery } from '@tanstack/react-query';
import { filterService } from '@/services/filter.service';

export interface UseFilterOptionsArgs {
  addAllOption?: boolean;
  allOptionLabel?: string;
  allOptionValue?: string | number;
}

function useGenericFilterOptions(
  queryKey: string,
  fetchFn: () => Promise<any>,
  options?: UseFilterOptionsArgs
) {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const response = await fetchFn();
      let formattedOptions = response.data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));

      if (options?.addAllOption) {
        formattedOptions = [
          {
            label: options.allOptionLabel || 'Semua',
            value: options.allOptionValue !== undefined ? options.allOptionValue : 'all',
          },
          ...formattedOptions,
        ];
      }

      return formattedOptions;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export const useLayananOptions = (options?: UseFilterOptionsArgs) => {
  return useGenericFilterOptions('filter-layanan', filterService.getLayanan, options);
};

export const useKecamatanOptions = (options?: UseFilterOptionsArgs) => {
  return useGenericFilterOptions('filter-kecamatan', filterService.getKecamatan, options);
};

export const usePelaporOptions = (options?: UseFilterOptionsArgs) => {
  return useGenericFilterOptions('filter-pelapor', filterService.getPelapor, options);
};

export const useStatusOptions = (options?: UseFilterOptionsArgs) => {
  return useGenericFilterOptions('filter-status', filterService.getStatus, options);
};

export const useJenisAjuanOptions = (options?: UseFilterOptionsArgs) => {
  return useGenericFilterOptions('filter-jenis-ajuan', filterService.getJenisAjuan, options);
};

export const useJalurOptions = (options?: UseFilterOptionsArgs) => {
  return useGenericFilterOptions('filter-jalur', filterService.getJalur, options);
};

export const useOperatorOptions = (options?: UseFilterOptionsArgs) => {
  return useGenericFilterOptions('filter-operator', filterService.getOperator, options);
};
