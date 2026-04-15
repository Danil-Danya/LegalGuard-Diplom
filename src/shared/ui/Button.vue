<template>
    <button
        :disabled="disabled"
        class="button inline-flex items-center justify-center rounded-[10px] text-[16px] leading-[20px] duration-[300ms] cursor-pointer transition-colors"
        :class="variantClass"
        :style="buttonStyle"
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
        paddingMd?: string;
        disabled?: boolean;
    }>(), {
        padding: '12px_32px',
        paddingMd: '',
        disabled: false,
    });

    const variantClass = computed(() => {
        if (props.color === 'gray') {
            return 'border border-[var(--color-primary-30)] bg-white text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-10)]';
        }

        return 'bg-primary text-white hover:bg-accent';
    });

    const buttonStyle = computed(() => {
        const base = props.padding.replaceAll('_', ' ');

        if (!props.paddingMd) {
            return {
                padding: base,
            };
        }

        const md = props.paddingMd.replaceAll('_', ' ');

        return {
            padding: base,
            '--md-padding': md,
        };
    });
</script>

<style scoped>
@media (min-width: 768px) {
    .button {
        padding: var(--md-padding) !important;
    }
}
</style>