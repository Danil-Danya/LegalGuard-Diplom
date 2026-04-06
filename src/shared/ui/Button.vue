<template>
    <button
        class="button inline-flex items-center justify-center rounded-[10px] text-[16px] leading-[20px] duration-[300ms] cursor-pointer transition-colors"
        :class="variantClass"
        :style="{ padding: normalizedPadding }"
    >
        {{ text }}
    </button>
</template>

<script lang="ts" setup>
    import { computed } from 'vue';

    const props = withDefaults(defineProps<{
        color: string;
        text: string;
        padding?: string;
    }>(), {
        padding: '12px_32px',
    });

    const variantClass = computed(() => {
        if (props.color === 'gray') {
            return 'border border-[var(--color-primary-30)] bg-white text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-10)]';
        }

        return 'bg-primary text-white hover:bg-accent';
    });

    const normalizedPadding = computed(() => {
        return props.padding.replaceAll('_', ' ');
    });
</script>
