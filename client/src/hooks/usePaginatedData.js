// hooks/usePaginatedData.js
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';

const fetchPaginatedData = async ({queryKey}) => {
    const [_key, {endpoint, page, limit}] = queryKey;
    const response = await axios.get(`${endpoint}?page=${page}&limit=${limit}`, {withCredentials: true});
    return response.data;
};

const usePaginatedData = (endpoint, page, limit, options = {}) => {
    return useQuery({
        queryKey: ['paginatedData', {endpoint, page, limit}],
        queryFn: fetchPaginatedData,
        keepPreviousData: true,
        ...options,
    });
};

export default usePaginatedData;
