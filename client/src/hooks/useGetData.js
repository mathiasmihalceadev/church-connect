"use client";

import {useQuery} from '@tanstack/react-query';
import axios from "axios";

const useGetData = (endpoint, key, options = {}) => {
    return useQuery({
        queryKey: [key],
        queryFn: () => axios.get(endpoint, {withCredentials: true}),
        retry: 0,
        ...options,
    });
};

export default useGetData;
