import axios from 'axios';

import api from '@/api/axios';
import type {
    AuthResponse,
    AuthUser,
    LoginRequest,
    RegistrationRequest,
    RegistrationResponse,
} from '@/entities/users/lib/types';

export const DEFAULT_REGISTRATION_ROLE_ID = '1c377981-171a-4743-b6ae-604e5062e270';

const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';
const ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY = 'accessTokenExpiresAt';
const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';
const REFRESH_TOKEN_EXPIRES_AT_STORAGE_KEY = 'refreshTokenExpiresAt';
const CURRENT_USER_STORAGE_KEY = 'currentUser';

const JSON_HEADERS = {
    'Content-Type': 'application/json',
};

const isBrowser = () => {
    return typeof window !== 'undefined';
};

const getErrorMessageFromPayload = (payload: unknown) => {
    if (!payload || typeof payload !== 'object') {
        return null;
    }

    const maybeMessage = (payload as { message?: unknown }).message;

    if (typeof maybeMessage === 'string' && maybeMessage.trim()) {
        return maybeMessage;
    }

    if (Array.isArray(maybeMessage)) {
        const normalizedMessage = maybeMessage
            .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
            .join(', ');

        return normalizedMessage || null;
    }

    const maybeError = (payload as { error?: unknown }).error;

    if (typeof maybeError === 'string' && maybeError.trim()) {
        return maybeError;
    }

    return null;
};

export const getAuthRequestErrorMessage = (error: unknown, fallbackMessage: string) => {
    if (axios.isAxiosError(error)) {
        return getErrorMessageFromPayload(error.response?.data) || fallbackMessage;
    }

    if (error instanceof Error && error.message.trim()) {
        return error.message;
    }

    return fallbackMessage;
};

const storeCurrentUser = (user: AuthUser) => {
    if (!isBrowser()) {
        return;
    }

    window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
};

export const getStoredCurrentUser = () => {
    if (!isBrowser()) {
        return null;
    }

    const rawCurrentUser = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);

    if (!rawCurrentUser) {
        return null;
    }

    try {
        return JSON.parse(rawCurrentUser) as AuthUser;
    }
    catch {
        return null;
    }
};

export const storeAuthSession = (authData: AuthResponse, user?: AuthUser) => {
    if (!isBrowser()) {
        return;
    }

    window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, authData.accessToken.token);
    window.localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY, String(authData.accessToken.expiresAt));
    window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, authData.refreshToken.token);
    window.localStorage.setItem(REFRESH_TOKEN_EXPIRES_AT_STORAGE_KEY, String(authData.refreshToken.expiresAt));

    if (user) {
        storeCurrentUser(user);
        return;
    }

    window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
};

export const clearAuthSession = () => {
    if (!isBrowser()) {
        return;
    }

    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_EXPIRES_AT_STORAGE_KEY);
    window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
};

export const registerUser = async (payload: RegistrationRequest) => {
    const response = await api.post<RegistrationResponse>(
        '/registration',
        JSON.stringify(payload),
        {
            headers: JSON_HEADERS,
        },
    );

    return response.data;
};

export const loginUser = async (payload: LoginRequest) => {
    const response = await api.post<AuthResponse>(
        '/login',
        JSON.stringify(payload),
        {
            headers: JSON_HEADERS,
        },
    );

    return response.data;
};
