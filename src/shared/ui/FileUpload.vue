<template>
    <div class="input__container flex w-full min-w-0 flex-col">
        <label class="uppercase tracking-[1px] !text-[12px]">{{ label }}</label>

        <div
            class="!mt-[10px] flex cursor-pointer items-center gap-[18px] rounded-[8px] border border-dashed bg-white !p-[18px] transition-colors max-sm:flex-col max-sm:items-start"
            :class="[
                hasError
                    ? 'border-[var(--color-danger)] bg-[var(--color-danger-10)]'
                    : isDragging
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-10)]'
                        : 'border-[var(--color-primary-30)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-10)]',
            ]"
            role="button"
            tabindex="0"
            @click="openFileDialog"
            @keydown.enter.prevent="openFileDialog"
            @keydown.space.prevent="openFileDialog"
            @dragenter.prevent="isDragging = true"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
        >
            <div class="flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-dashed border-[var(--color-primary-30)] bg-[var(--color-surface)]">
                <img v-if="previewUrl" :src="previewUrl" alt="Превью аватарки" class="h-full w-full object-cover">
                <span v-else class="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                    Аватар
                </span>
            </div>

            <div class="min-w-0 flex-1">
                <p class="truncate text-[16px] font-semibold text-[var(--color-text-primary)]">
                    {{ fileTitle }}
                </p>
                <p class="!mt-[4px] text-[14px] leading-[20px] text-[var(--color-text-secondary)]">
                    {{ description }}
                </p>
                <span class="!mt-[12px] inline-flex rounded-[8px] bg-[var(--color-primary-10)] px-[14px] py-[8px] text-[14px] font-medium text-[var(--color-primary)]">
                    {{ actionText }}
                </span>
            </div>
        </div>

        <input
            ref="inputRef"
            :accept="accept"
            class="hidden"
            type="file"
            @change="handleFileSelection"
        >

        <ErrorMessage :text="props.errorText" v-if="hasError" />
    </div>
</template>

<script setup lang="ts">

    import { computed, onBeforeUnmount, ref, watch } from 'vue';

    import ErrorMessage from './ErrorMessage.vue';

    const inputRef = ref<HTMLInputElement | null>(null);
    const isDragging = ref(false);
    const objectPreviewUrl = ref('');

    const props = withDefaults(defineProps<{
        label: string;
        modelValue?: File | null;
        accept?: string;
        placeholder?: string;
        description?: string;
        previewUrl?: string;
        errorText?: string;
    }>(), {
        modelValue: null,
        accept: 'image/png,image/jpeg,image/webp',
        placeholder: 'Аватар еще не загружен',
        description: 'Перетащите изображение сюда или нажмите, чтобы выбрать файл',
        previewUrl: '',
        errorText: '',
    });

    const emit = defineEmits<{
        (e: 'update:modelValue', value: File | null): void;
    }>();

    const revokeObjectUrl = () => {
        if (!objectPreviewUrl.value) {
            return;
        }

        URL.revokeObjectURL(objectPreviewUrl.value);
        objectPreviewUrl.value = '';
    };

    watch(() => props.modelValue, (file) => {
        revokeObjectUrl();

        if (file && file.type.startsWith('image/')) {
            objectPreviewUrl.value = URL.createObjectURL(file);
        }
    }, { immediate: true });

    onBeforeUnmount(() => {
        revokeObjectUrl();
    });

    const previewUrl = computed(() => {
        return props.previewUrl || objectPreviewUrl.value;
    });

    const fileTitle = computed(() => {
        return props.modelValue?.name || props.placeholder;
    });

    const actionText = computed(() => {
        return props.modelValue ? 'Заменить аватар' : 'Загрузить аватар';
    });

    const hasError = computed(() => {
        return Boolean(props.errorText);
    });

    const assignFile = (file: File | null) => {
        emit('update:modelValue', file);
    };

    const openFileDialog = () => {
        inputRef.value?.click();
    };

    const handleFileSelection = (event: Event) => {
        const target = event.target as HTMLInputElement;
        assignFile(target.files?.[0] ?? null);
        target.value = '';
    };

    const handleDrop = (event: DragEvent) => {
        isDragging.value = false;
        assignFile(event.dataTransfer?.files?.[0] ?? null);
    };

</script>
