<template>
    <div class="input__container flex w-full min-w-0 flex-col">
        <label class="uppercase tracking-[1px] !text-[12px]">{{ label }}</label>

        <div class="relative !mt-[10px]">
            <input
                :type="resolvedInputType"
                :value="modelValue"
                :placeholder="placeholder"
                class="input w-full min-w-0 rounded-[4px] border bg-soft-blue text-[16px] outline-none transition-colors placeholder:text-[var(--color-text-muted)]"
                :class="[
                    hasError
                        ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)]'
                        : 'border-transparent focus:border-accent',
                    isPasswordField ? '!p-[12px_52px_12px_16px]' : '!p-[12px_16px]',
                ]"
                @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            >

            <button
                v-if="isPasswordField"
                type="button"
                class="absolute right-[14px] top-1/2 inline-flex -translate-y-1/2 cursor-pointer items-center justify-center text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                :aria-label="isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'"
                @click="isPasswordVisible = !isPasswordVisible"
            >
                <EyeOpen v-if="isPasswordVisible" />
                <EyeClosed v-else />
            </button>
        </div>

        <ErrorMessage :text="errorText" v-if="hasError" />
    </div>
</template>

<script setup lang="ts">

    import { computed, ref } from 'vue';

    import EyeClosed from '@/shared/icons/auth/EyeClosed.vue';
    import EyeOpen from '@/shared/icons/auth/EyeOpen.vue';

    import ErrorMessage from './ErrorMessage.vue';

    const props = withDefaults(defineProps<{
        label: string;
        type?: string;
        placeholder: string;
        modelValue?: string;
        errorText?: string;
    }>(), {
        type: 'text',
        modelValue: '',
        errorText: '',
    });

    const emit = defineEmits<{
        (e: 'update:modelValue', value: string): void;
    }>();

    const isPasswordVisible = ref(false);

    const isPasswordField = computed(() => {
        return props.type === 'password';
    });

    const resolvedInputType = computed(() => {
        if (!isPasswordField.value) {
            return props.type;
        }

        return isPasswordVisible.value ? 'text' : 'password';
    });

    const hasError = computed(() => {
        return Boolean(props.errorText);
    });

</script>
