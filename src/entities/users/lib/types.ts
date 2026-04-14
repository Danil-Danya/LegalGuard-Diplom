export enum ProfilePosition {
    INDIVIDUAL = 'INDIVIDUAL',
    BUSINESS_OWNER = 'BUSINESS_OWNER',
    LAWYER = 'LAWYER',
}

export interface ProfileFormState {
    avatar: File | null;
    firstName: string;
    lastName: string;
    position: ProfilePosition | '';
    biography: string;
}

export interface AuthToken {
    token: string;
    expiresAt: number;
}

export interface AuthUser {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface RegistrationRequest {
    email: string;
    password: string;
    roleId: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: AuthToken;
    refreshToken: AuthToken;
}

export interface RegistrationResponse extends AuthResponse {
    createdUser: AuthUser;
}

export interface CreateProfileRequest {
    userId?: string;
    firstName: string;
    lastName: string;
    position: ProfilePosition;
    biography: string;
    avatar?: File | null;
}

export interface ProfileResponse {
    id?: string;
    userId?: string;
    firstName: string;
    lastName: string;
    position: ProfilePosition;
    biography: string;
    avatarPath?: string | null;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
}
