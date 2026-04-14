<template>
    <div class="input__container flex w-full min-w-0 flex-col">
        <label class="uppercase tracking-[1px] !text-[12px]">{{ label }}</label>
        <select
            :value="modelValue"
            class="input w-full min-w-0 !p-[12px_16px] rounded-[4px] border bg-soft-blue text-[16px] outline-none transition-colors !mt-[10px]"
            :class="hasError ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)]' : 'border-transparent focus:border-accent'"
            @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        >
            <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
            <option
                v-for="option in normalizedOptions"
                :key="option.value"
                :value="option.value"
            >
                {{ option.label }}
            </option>
        </select>
        <ErrorMessage :text="props.errorText" v-if="hasError" />
    </div>
</template>

<script setup lang="ts">

    import { computed } from 'vue';

    import ErrorMessage from './ErrorMessage.vue';

    interface SelectOption {
        label: string;
        value: string;
    }

    const props = withDefaults(defineProps<{
        label: string;
        placeholder?: string;
        modelValue?: string;
        options: Array<string | SelectOption>;
        errorText?: string;
    }>(), {
        placeholder: '',
        modelValue: '',
        errorText: '',
    });

    const emit = defineEmits<{
        (e: 'update:modelValue', value: string): void;
    }>();

    const normalizedOptions = computed<SelectOption[]>(() => {
        return props.options.map((option) => {
            if (typeof option === 'string') {
                return {
                    label: option,
                    value: option,
                };
            }

            return option;
        });
    });

    const hasError = computed(() => {
        return Boolean(props.errorText);
    });

</script>
