"use client";

import {useQuery} from '@tanstack/react-query';
import axios from "axios";

const useGetData = (endpoint, key, options = {}) => {
    return useQuery({
        queryKey: [key],
        queryFn: () => {
            if (!endpoint) {
                return Promise.reject(new Error('Invalid endpoint'));
            }
            return axios.get(endpoint, {withCredentials: true}).then(res => res.data);
        },
        retry: 0,
        ...options,
    });
};

export default useGetData;
