<template>
    <button
        type="button"
        class="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border transition-colors duration-200"
        :class="variantClass"
        :aria-label="label"
        :title="label"
    >
        <slot />
    </button>
</template>

<script setup lang="ts">
    import { computed } from 'vue';

    const props = withDefaults(defineProps<{
        label: string;
        active?: boolean;
        tone?: 'neutral' | 'primary' | 'danger';
    }>(), {
        active: false,
        tone: 'neutral',
    });

    const variantClass = computed(() => {
        if (props.active && props.tone === 'danger') {
            return 'border-danger-20 bg-danger-10 text-danger';
        }

        if (props.active) {
            return 'border-primary-20 bg-primary-10 text-primary';
        }

        return 'border-transparent bg-transparent text-text-muted hover:border-border hover:bg-white hover:text-text-primary';
    });
</script>
