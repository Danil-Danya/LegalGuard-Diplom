<template>
    <div class="input__container flex w-full min-w-0 flex-col">
        <label class="uppercase tracking-[1px] !text-[12px]">{{ label }}</label>
        <input
            :type="type"
            :placeholder="placeholder"
            class="input w-full min-w-0 !p-[12px_16px] rounded-[4px] border border-transparent bg-soft-blue text-[16px] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-accent !mt-[10px]"
        >
        <ErrorMessage :text="errorText" v-if="errorText" />
    </div>
</template>

<script setup lang="ts">

    import { ref } from 'vue';

    import ErrorMessage from './ErrorMessage.vue';

    const errorText = ref('');

    const props = withDefaults(defineProps<{
        label: string;
        type?: string;
        placeholder: string;
        modelValue?: string;
    }>(), {
        type: 'text',
        modelValue: '',
    });

</script>
