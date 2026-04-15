import { ref } from 'vue';

const DEFAULT_AUTH_REDIRECT = '/chat/new-chat';

const isAuthRequiredModalOpen = ref(false);
const requestedPath = ref(DEFAULT_AUTH_REDIRECT);
const requestedLabel = ref('этот раздел');

export const resolveAuthRedirectPath = (value: unknown, fallback = DEFAULT_AUTH_REDIRECT) => {
    if (typeof value !== 'string') {
        return fallback;
    }

    const normalizedValue = value.trim();

    if (!normalizedValue || !normalizedValue.startsWith('/') || normalizedValue.startsWith('//')) {
        return fallback;
    }

    return normalizedValue;
};

export const openAuthRequiredModal = (options?: {
    requestedPath?: string;
    requestedLabel?: string;
}) => {
    requestedPath.value = resolveAuthRedirectPath(options?.requestedPath, DEFAULT_AUTH_REDIRECT);
    requestedLabel.value = options?.requestedLabel?.trim() || 'этот раздел';
    isAuthRequiredModalOpen.value = true;
};

export const closeAuthRequiredModal = () => {
    isAuthRequiredModalOpen.value = false;
};

export const useAuthGate = () => {
    return {
        isAuthRequiredModalOpen,
        requestedPath,
        requestedLabel,
    };
};
