<template>
    <div class="chat__user-container flex justify-end">
        <div class="chat__user !mb-[20px] max-w-[600px]">
            <div class="chat__user-avatar flex items-center justify-end gap-[10px]">
                <div class="flex items-center gap-[10px]">
                    <p class="font-brand text-[18px] font-extrabold leading-none tracking-[0.02em] text-primary [text-shadow:0_1px_0_rgba(255,255,255,0.7)]">
                        Вы
                    </p>
                    <p class="text-[14px] font-semibold leading-none tracking-[0.01em] text-text-subtle">
                        {{ resolvedMetaText }}
                    </p>
                </div>
                <span class="inline-flex h-[30px] w-[30px] items-center justify-center overflow-hidden rounded-[4px] border border-accent bg-white text-accent">
                    <img v-if="avatarUrl" :src="avatarUrl" alt="Аватар пользователя" class="h-full w-full object-cover">
                    <UserAvatarIcon v-else />
                </span>
            </div>
            <div class="!mt-[20px] rounded-[10px] bg-soft-blue !p-[20px]">
                <p class="text whitespace-pre-line">{{ text }}</p>
            </div>
            <div class="!mt-[10px] flex justify-end">
                <MessageActionButton label="Скопировать сообщение" :active="copied" @click="handleCopy">
                    <CopyActionIcon />
                </MessageActionButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, onBeforeUnmount, ref } from 'vue';

    import { useUserStore } from '@/entities/users/models/store';
    import CopyActionIcon from '@/shared/icons/chat/CopyAction.vue';
    import UserAvatarIcon from '@/shared/icons/chat/UserAvatar.vue';
    import MessageActionButton from '@/shared/ui/MessageActionButton.vue';
    import { copyTextToClipboard } from '@/utils/messageActions';

    const props = defineProps<{
        text: string;
        time?: string;
        pending?: boolean;
    }>();

    const userStore = useUserStore();
    const copied = ref(false);
    let copiedTimer: ReturnType<typeof setTimeout> | null = null;
    const staticUrl = import.meta.env.VITE_APP_STATIC_URL;

    const avatarUrl = computed(() => {
        const avatarPath = (userStore.myProfile as { profile?: { avatarPath?: string | null } })?.profile?.avatarPath;

        if (!avatarPath || !staticUrl) {
            return '';
        }

        const normalizedBase = staticUrl.replace(/\/+$/, '');
        const normalizedPath = avatarPath.replace(/^\/+/, '');

        return `${normalizedBase}/${normalizedPath}`;
    });

    const resolvedMetaText = computed(() => {
        if (props.pending) {
            return 'Отправка...';
        }

        return props.time || 'Сейчас';
    });

    const handleCopy = async () => {
        const isCopied = await copyTextToClipboard(props.text);

        if (!isCopied) {
            return;
        }

        copied.value = true;

        if (copiedTimer) {
            clearTimeout(copiedTimer);
        }

        copiedTimer = setTimeout(() => {
            copied.value = false;
        }, 1800);
    };

    onBeforeUnmount(() => {
        if (copiedTimer) {
            clearTimeout(copiedTimer);
        }
    });
</script>
