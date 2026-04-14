import api from '@/api/axios';
import { getStoredCurrentUser } from '@/entities/users/api/auth';
import type { CreateProfileRequest, ProfileResponse } from '@/entities/users/lib/types';

const MULTIPART_HEADERS = {
    'Content-Type': 'multipart/form-data',
    'X-Skip-Case-Transform': 'true',
};

const JSON_HEADERS = {
    'Content-Type': 'application/json',
};

const createProfileBody = (payload: CreateProfileRequest) => {
    const currentUser = getStoredCurrentUser();

    return {
        userId: payload.userId || currentUser?.id,
        firstName: payload.firstName,
        lastName: payload.lastName,
        position: payload.position,
        biography: payload.biography,
    };
};

export const createProfile = async (payload: CreateProfileRequest) => {
    const profileBody = createProfileBody(payload);

    if (payload.avatar) {
        const formData = new FormData();

        Object.entries(profileBody).forEach(([key, value]) => {
            if (value) {
                formData.append(key, value);
            }
        });

        formData.append('avatar', payload.avatar);

        const response = await api.post<ProfileResponse>(
            '/profiles',
            formData,
            {
                headers: MULTIPART_HEADERS,
            },
        );

        return response.data;
    }

    const response = await api.post<ProfileResponse>(
        '/profiles',
        JSON.stringify(profileBody),
        {
            headers: JSON_HEADERS,
        },
    );

    return response.data;
};

export const getMyProfile = async () => {
    try {
        const response = await api.get('/profile');
        return response.data;
    }
    catch (err) {
        console.log(err);
        throw err
    }
}
