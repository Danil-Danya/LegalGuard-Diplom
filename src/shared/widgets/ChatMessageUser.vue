<template>
    <div class="chat__user-container flex justify-end">
        <div class="chat__user !mb-[20px] max-w-[600px]">
            <div class="chat__user-avatar flex items-center gap-[10px] justify-end">
                <h2 class="title !text-[20px]">Danil Sabitov</h2>
                <span class="chat__user-avatar-img inline-flex h-[50px] w-[50px] items-center justify-center rounded-[4px] border border-accent bg-white text-accent">
                    <UserAvatarIcon />
                </span>
            </div>
            <div class="chat__user-text !mt-[20px] bg-soft-blue !p-[20px] rounded-[10px]">
                <p class="text">{{ text }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import UserAvatarIcon from '@/shared/icons/chat/UserAvatar.vue';

    const props = defineProps<{
        text: string;
    }>();

</script>
