import { fetchLatestSites } from '@/services/sites';
import { fetchStats } from '@/services/stats';
import { useAsync } from './useAsync';

const loadLatestSites = () => fetchLatestSites(6);

export const useLatestSites = () => useAsync(loadLatestSites);
export const useStats = () => useAsync(fetchStats);
