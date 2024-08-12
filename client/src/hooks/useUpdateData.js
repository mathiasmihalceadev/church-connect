import {useMutation} from '@tanstack/react-query';
import axios from "axios";

const usePostData = (endpoint, successCallback) => {
    return useMutation({
        mutationFn: (newData) => {
            return axios.put(endpoint, newData, {withCredentials: true})
        },
        onSuccess: successCallback

    });
};

export default usePostData;
