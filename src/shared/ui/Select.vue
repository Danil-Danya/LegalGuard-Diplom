<template>
    <div class="input__container flex w-full min-w-0 flex-col">
        <label class="uppercase tracking-[1px] !text-[12px]">{{ label }}</label>
        <select
            :value="modelValue"
            class="input w-full min-w-0 !p-[12px_16px] rounded-[4px] border border-transparent bg-soft-blue text-[16px] outline-none transition-colors focus:border-accent !mt-[10px]"
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
        <ErrorMessage :text="errorText" v-if="errorText" />
    </div>
</template>

<script setup lang="ts">

    import { computed, ref } from 'vue';

    import ErrorMessage from './ErrorMessage.vue';

    interface SelectOption {
        label: string;
        value: string;
    }

    const errorText = ref('');

    const props = withDefaults(defineProps<{
        label: string;
        placeholder?: string;
        modelValue?: string;
        options: Array<string | SelectOption>;
    }>(), {
        placeholder: '',
        modelValue: '',
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

</script>
