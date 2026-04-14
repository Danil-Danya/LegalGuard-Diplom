<template>
    <div class="input__container flex w-full min-w-0 flex-col">
        <label class="uppercase tracking-[1px] !text-[12px]">{{ label }}</label>
        <textarea
            :value="modelValue"
            :placeholder="placeholder"
            :rows="rows"
            class="input min-h-[140px] w-full min-w-0 resize-y rounded-[4px] border bg-soft-blue !p-[12px_16px] text-[16px] outline-none transition-colors placeholder:text-[var(--color-text-muted)] !mt-[10px]"
            :class="hasError ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)]' : 'border-transparent focus:border-accent'"
            @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        ></textarea>
        <ErrorMessage :text="props.errorText" v-if="hasError" />
    </div>
</template>

<script setup lang="ts">

    import { computed } from 'vue';

    import ErrorMessage from './ErrorMessage.vue';

    const props = withDefaults(defineProps<{
        label: string;
        placeholder?: string;
        modelValue?: string;
        rows?: number;
        errorText?: string;
    }>(), {
        placeholder: '',
        modelValue: '',
        rows: 5,
        errorText: '',
    });

    const emit = defineEmits<{
        (e: 'update:modelValue', value: string): void;
    }>();

    const hasError = computed(() => {
        return Boolean(props.errorText);
    });

</script>
