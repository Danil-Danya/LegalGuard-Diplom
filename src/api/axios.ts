import axios from "axios";

import convertKeysToCamelCase from "@/utils/convertKeysToCamelCase";
import convertToSnakeCase from "@/utils/convertToSnakeCase";
import convertKeysToPascalCase from "@/utils/convertToPascalCase";

const SKIP_CASE_TRANSFORM_HEADER = 'X-Skip-Case-Transform';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL as string,
    timeout: 10000
});

api.interceptors.response.use((response) => {
    if (response.status === 401) {
        localStorage.removeItem('accessToken');
        return response;
    }

    const isBlobResponse = response.config.responseType === 'blob'
        || (typeof Blob !== 'undefined' && response.data instanceof Blob);
    const isArrayBufferResponse = response.config.responseType === 'arraybuffer'
        || response.data instanceof ArrayBuffer;

    if (response.data && !isBlobResponse && !isArrayBufferResponse) {
        response.data = convertKeysToCamelCase(response.data);
    }

    return response;
});

api.interceptors.request.use((request) => {
    const skipCaseTransform = typeof (request.headers as any)?.get === 'function'
        ? (request.headers as any).get(SKIP_CASE_TRANSFORM_HEADER) === 'true'
        : (request.headers as any)?.[SKIP_CASE_TRANSFORM_HEADER] === 'true';

    if (skipCaseTransform) {
        if (typeof (request.headers as any)?.delete === 'function') {
            (request.headers as any).delete(SKIP_CASE_TRANSFORM_HEADER);
        }
        else if (request.headers) {
            delete (request.headers as any)[SKIP_CASE_TRANSFORM_HEADER];
        }
    }
    else if (request.data instanceof FormData) {
        request.data = convertKeysToPascalCase(request.data);
    }
    else if (request.data) {
        request.data = convertKeysToPascalCase(request.data);
    }

    if (request.params) {
        request.params = convertToSnakeCase(request.params);
    }

    if (typeof window !== 'undefined' && localStorage.getItem("accessToken")) {
        request.headers = {
            ...request.headers,
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        } as any;
    }

    return request;
});

export default api;
