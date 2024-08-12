// hooks/usePatchData.js
import {useMutation} from '@tanstack/react-query';
import axios from 'axios';

const usePatchData = (endpoint, successCallback) => {
    return useMutation({
        mutationFn: (data) => {
            return axios.patch(endpoint, data, {
                withCredentials: true
            });
        },
        onSuccess: successCallback
    });
};

export default usePatchData;
