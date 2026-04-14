<template>
    <div class="flex w-full min-w-0 flex-col">
        <label class="text-[12px] uppercase tracking-[1px] text-[var(--color-text-secondary)]">
            {{ label }}
        </label>

        <button
            type="button"
            class="!mt-[10px] flex min-h-[126px] w-full max-w-full flex-col items-start justify-between rounded-[10px] border border-dashed bg-white !p-[16px] text-left transition-colors"
            :class="hasError ? 'border-[var(--color-danger)] bg-[var(--color-danger-10)]' : 'border-[var(--color-primary-30)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-10)]'"
            @click="openDialog"
        >
            <div class="w-full space-y-[8px]">
                <p class="break-words text-[16px] font-semibold text-[var(--color-text-primary)]">
                    {{ modelValue?.name || label }}
                </p>
                <p class="break-words text-[14px] leading-[22px] text-[var(--color-text-secondary)]">
                    {{ description }}
                </p>
            </div>

            <span class="text-[14px] font-medium text-[var(--color-primary)]">
                {{ modelValue ? 'Заменить файл' : 'Выбрать файл' }}
            </span>
        </button>

        <input
            ref="inputRef"
            :accept="accept"
            class="hidden"
            type="file"
            @change="handleChange"
        >

        <ErrorMessage v-if="hasError" :text="errorText" />
    </div>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';

    import ErrorMessage from '@/shared/ui/ErrorMessage.vue';

    const inputRef = ref<HTMLInputElement | null>(null);

    const props = withDefaults(defineProps<{
        label: string;
        modelValue?: File | null;
        accept?: string;
        description?: string;
        errorText?: string;
    }>(), {
        modelValue: null,
        accept: '',
        description: '',
        errorText: '',
    });

    const emit = defineEmits<{
        (e: 'update:modelValue', value: File | null): void;
    }>();

    const hasError = computed(() => {
        return Boolean(props.errorText);
    });

    const openDialog = () => {
        inputRef.value?.click();
    };

    const handleChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        emit('update:modelValue', target.files?.[0] ?? null);
        target.value = '';
    };
</script>
