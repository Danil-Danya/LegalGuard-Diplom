<template>
    <div class="chat__ai !mb-[20px] max-w-[600px]">
        <div class="chat__ai-avatar flex items-center gap-[10px]">
            <img src="@/assets/images/logo/logo.png" alt="Logo" class="chat__ai-avatar-img w-[50px] h-[50px] border-1 border-accent rounded-[4px]">
            <h2 class="title !text-[20px]">LEGALGUARD</h2>
        </div>
        <div class="chat__ai-text !mt-[20px]">
            <p class="text">{{ text }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">

    const props = defineProps<{
        text: string;
    }>();

</script>