import useSWR from 'swr';
import api from '@/lib/api';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useAdminOverview() {
    const { data, error, isLoading } = useSWR('/admin/overview', fetcher);
    return {
        stats: data,
        isLoading,
        isError: error
    };
}

export function useMerchants() {
    const { data, error, isLoading, mutate } = useSWR('/admin/merchants', fetcher);

    const toggleStatus = async (userId: number) => {
        try {
            await api.post(`/admin/merchants/${userId}/toggle`);
            mutate(); // Refresh list
        } catch (e) {
            console.error("Failed to toggle status", e);
            throw e;
        }
    }

    return {
        merchants: data,
        isLoading,
        isError: error,
        toggleStatus
    };
}

export function useAllOrders(page = 0) {
    const { data, error, isLoading } = useSWR(`/admin/orders?skip=${page * 50}&limit=50`, fetcher);
    return {
        orders: data,
        isLoading,
        isError: error
    };
}
