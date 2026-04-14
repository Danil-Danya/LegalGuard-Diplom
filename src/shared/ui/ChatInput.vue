<template>
    <div
        class="chat-input flex w-full flex-col gap-[10px] rounded-[26px] border border-[#CDD5DE] bg-[linear-gradient(180deg,#E2E7ED_0%,#D9DEE5_100%)] p-[12px_14px] shadow-[0_20px_48px_rgba(45,51,56,0.12),0_1px_0_rgba(255,255,255,0.9)_inset,0_0_0_1px_rgba(255,255,255,0.45)] transition-[border-color,box-shadow,transform] duration-300 focus-within:border-[var(--color-primary-30)] focus-within:shadow-[0_24px_56px_rgba(45,51,56,0.14),0_1px_0_rgba(255,255,255,0.95)_inset,0_0_0_4px_rgba(118,89,44,0.08)] max-sm:gap-[10px] max-sm:rounded-[22px] max-sm:p-[10px_12px]"
    >
        <div
            v-if="selectedFile"
            class="flex items-center justify-between gap-[12px] rounded-[14px] bg-white/75 px-[14px] py-[10px] text-[13px] font-medium text-[var(--color-text-secondary)]"
        >
            <span class="truncate">{{ selectedFile.name }}</span>
            <button
                type="button"
                class="shrink-0 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                aria-label="Убрать файл"
                @click="clearSelectedFile"
            >
                Убрать
            </button>
        </div>

        <div class="flex w-full items-center gap-[14px] max-sm:gap-[10px]">
            <button
                type="button"
                class="inline-flex cursor-pointer h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px] text-[#5E6772] transition-colors duration-300 hover:bg-[rgba(255,255,255,0.35)] hover:text-[var(--color-text-primary)] max-sm:h-[40px] max-sm:w-[40px]"
                aria-label="Прикрепить файл"
                :disabled="disabled"
                @click="openFileDialog"
            >
                <AttachFileIcon />
            </button>

            <textarea
                ref="textareaRef"
                :value="modelValue"
                :placeholder="resolvedPlaceholder"
                rows="1"
                :disabled="disabled"
                class="min-h-[52px] min-w-0 flex-1 appearance-none border-none !p-[15px_0] resize-none overflow-hidden bg-transparent py-[12px] text-[18px] leading-[28px] font-medium text-[var(--color-text-primary)] outline-none placeholder:font-medium placeholder:text-[#7A838E] disabled:cursor-not-allowed disabled:opacity-70 max-sm:min-h-[48px] max-sm:!text-[14px] max-sm:leading-[24px]"
                @input="onInput"
                @keydown="onKeydown"
            ></textarea>

            <button
                type="button"
                class="inline-flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[30px] bg-[var(--color-primary)] text-white shadow-[0_12px_24px_rgba(118,89,44,0.22)] transition-all duration-300 hover:-translate-y-[1px] hover:bg-[var(--color-primary-80)] hover:shadow-[0_16px_30px_rgba(118,89,44,0.28)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[var(--color-primary-80)] disabled:opacity-60 disabled:shadow-none max-sm:h-[48px] max-sm:w-[48px] max-sm:rounded-[50px]"
                :disabled="disabled || !canSubmit"
                aria-label="Отправить сообщение"
                @click="handleSubmit"
            >
                <SendMessageIcon />
            </button>
        </div>

        <input
            ref="fileInputRef"
            class="hidden"
            type="file"
            @change="handleFileChange"
        >
    </div>
</template>

<script setup lang="ts">
    import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

    import AttachFileIcon from '@/shared/icons/chat/AttachFile.vue';
    import SendMessageIcon from '@/shared/icons/chat/SendMessage.vue';

    const props = withDefaults(defineProps<{
        modelValue?: string;
        placeholder?: string;
        mobilePlaceholder?: string;
        disabled?: boolean;
    }>(), {
        modelValue: '',
        placeholder: 'Напишите сообщение...',
        mobilePlaceholder: '',
        disabled: false,
    });

    const emit = defineEmits<{
        'update:modelValue': [value: string];
        submit: [payload: { text: string; file: File | null }];
    }>();

    const isMobile = ref(false);
    const selectedFile = ref<File | null>(null);
    const textareaRef = ref<HTMLTextAreaElement | null>(null);
    const fileInputRef = ref<HTMLInputElement | null>(null);
    let mediaQuery: MediaQueryList | null = null;

    const resizeTextarea = async () => {
        await nextTick();

        if (!textareaRef.value) {
            return;
        }

        textareaRef.value.style.height = 'auto';
        textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
    };

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
        isMobile.value = event.matches;
    };

    onMounted(() => {
        mediaQuery = window.matchMedia('(max-width: 576px)');
        isMobile.value = mediaQuery.matches;
        mediaQuery.addEventListener('change', handleMediaQueryChange);
        resizeTextarea();
    });

    onBeforeUnmount(() => {
        mediaQuery?.removeEventListener('change', handleMediaQueryChange);
    });

    watch(() => props.modelValue, () => {
        resizeTextarea();
    });

    const resolvedPlaceholder = computed(() => {
        if (isMobile.value && props.mobilePlaceholder) {
            return props.mobilePlaceholder;
        }

        return props.placeholder;
    });

    const canSubmit = computed(() => {
        return Boolean(props.modelValue?.trim() || selectedFile.value);
    });

    const clearSelectedFile = () => {
        selectedFile.value = null;

        if (fileInputRef.value) {
            fileInputRef.value.value = '';
        }
    };

    const openFileDialog = () => {
        if (props.disabled) {
            return;
        }

        fileInputRef.value?.click();
    };

    const handleFileChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        selectedFile.value = target.files?.[0] ?? null;
    };

    const onInput = (event: Event) => {
        const target = event.target as HTMLTextAreaElement;
        emit('update:modelValue', target.value);
    };

    const handleSubmit = () => {
        if (!canSubmit.value || props.disabled) {
            return;
        }

        emit('submit', {
            text: props.modelValue?.trim() || '',
            file: selectedFile.value,
        });

        clearSelectedFile();
        emit('update:modelValue', '');
    };

    const onKeydown = (event: KeyboardEvent) => {
        if (event.key !== 'Enter' || event.shiftKey) {
            return;
        }

        event.preventDefault();
        handleSubmit();
    };
</script>
