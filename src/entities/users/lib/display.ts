export interface UserDisplayProfileShape {
    firstName?: string;
    lastName?: string;
    avatarPath?: string | null;
    profile?: {
        firstName?: string;
        lastName?: string;
        avatarPath?: string | null;
    };
}

export const normalizeUserText = (value?: string | null) => {
    return typeof value === 'string' ? value.trim() : '';
};

export const resolveUserDisplayName = (profile?: UserDisplayProfileShape | null, fallbackEmail = '') => {
    const firstName = normalizeUserText(profile?.firstName) || normalizeUserText(profile?.profile?.firstName);
    const lastName = normalizeUserText(profile?.lastName) || normalizeUserText(profile?.profile?.lastName);
    const fullName = [firstName, lastName].filter(Boolean).join(' ');

    return fullName || fallbackEmail || 'Аккаунт';
};

export const resolveUserInitials = (displayName: string) => {
    const parts = displayName
        .split(/\s+/)
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 2);

    if (!parts.length) {
        return 'LG';
    }

    return parts
        .map((item) => item[0]?.toUpperCase() || '')
        .join('');
};

export const resolveUserAvatarUrl = (profile?: UserDisplayProfileShape | null, staticUrl = '') => {
    const avatarPath = normalizeUserText(profile?.avatarPath) || normalizeUserText(profile?.profile?.avatarPath);

    if (!avatarPath || !staticUrl) {
        return '';
    }

    const normalizedBase = staticUrl.replace(/\/+$/, '');
    const normalizedPath = avatarPath.replace(/^\/+/, '');

    return `${normalizedBase}/${normalizedPath}`;
};
