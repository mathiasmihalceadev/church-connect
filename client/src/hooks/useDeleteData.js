import {useMutation} from '@tanstack/react-query';
import axios from 'axios';

const useDeleteData = (endpoint, successCallback) => {
    return useMutation({
        mutationFn: (newData) => {
            return axios.delete(endpoint, {
                data: newData,
                withCredentials: true
            });
        },
        onSuccess: successCallback
    });
};

export default useDeleteData;
