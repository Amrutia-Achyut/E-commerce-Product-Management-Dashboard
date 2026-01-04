import { SWRConfiguration } from 'swr';
import axios from 'axios';

export const swrConfig: SWRConfiguration = {
  fetcher: (url: string) => axios.get(url).then((res) => res.data.data),
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 5000,
};

