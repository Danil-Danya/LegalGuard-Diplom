<template>
    <p class="error-message !mt-[8px] text-[13px] leading-[18px] text-[var(--color-danger)]">{{ text }}</p>
</template>

<script setup lang="ts">

    const props = defineProps<{
        text: string;
    }>();

</script>
