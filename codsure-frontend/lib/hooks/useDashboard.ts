import useSWR from 'swr';
import api from '@/lib/api';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useDashboardStats() {
    const { data, error, isLoading } = useSWR('/dashboard/stats', fetcher);
    return {
        stats: data,
        isLoading,
        isError: error
    };
}

export function useDashboardChart() {
    const { data, error, isLoading } = useSWR('/dashboard/chart', fetcher);
    return {
        chartData: data,
        isLoading,
        isError: error
    };
}

export function useRecentOrders() {
    const { data, error, isLoading } = useSWR('/dashboard/recent-orders', fetcher);
    return {
        orders: data,
        isLoading,
        isError: error
    };
}
