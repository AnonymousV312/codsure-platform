import useSWR from 'swr';
import api from '@/lib/api';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useMerchantOrders(page = 1, status = 'any') {
    const { data, error, isLoading, mutate } = useSWR(`/dashboard/orders?page=${page}&status=${status}`, fetcher);
    return {
        data: data, // { orders, total, page, pages }
        isLoading,
        isError: error,
        mutate
    };
}

export function useShopifySync() {
    const triggerSync = async () => {
        try {
            const res = await api.post('/shopify/sync');
            return res.data;
        } catch (error) {
            console.error("Sync failed", error);
            throw error;
        }
    }
    return { triggerSync };
}
