<template>
    <div
        class="chat-input flex w-full items-center gap-[14px] rounded-[26px] border border-[#D3D8DF] bg-[linear-gradient(180deg,#E2E7ED_0%,#D9DEE5_100%)] p-[12px_14px] shadow-[0_14px_36px_rgba(45,51,56,0.08)] transition-[border-color,box-shadow] duration-300 focus-within:border-[var(--color-primary-30)] focus-within:shadow-[0_18px_44px_rgba(45,51,56,0.1),0_0_0_4px_rgba(118,89,44,0.06)] max-sm:gap-[10px] max-sm:rounded-[22px] max-sm:p-[10px_12px]"
    >
        <button
            type="button"
            class="inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px] text-[#5E6772] transition-colors duration-300 hover:bg-[rgba(255,255,255,0.35)] hover:text-[var(--color-text-primary)] max-sm:h-[40px] max-sm:w-[40px]"
            aria-label="Прикрепить файл"
        >
            <AttachFileIcon />
        </button>

        <textarea
            :value="modelValue"
            :placeholder="placeholder"
            rows="1"
            class="min-h-[52px] flex-1 !p-[15px_0] resize-none bg-transparent py-[12px] text-[18px] leading-[28px] font-medium text-[var(--color-text-primary)] outline-none placeholder:font-medium placeholder:text-[#7A838E] max-sm:min-h-[48px] max-sm:!text-[14px] max-sm:leading-[24px]"
            @input="onInput"
        />

        <button
            type="button"
            class="inline-flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[16px] bg-[var(--color-primary)] text-white shadow-[0_12px_24px_rgba(118,89,44,0.22)] transition-all duration-300 hover:-translate-y-[1px] hover:bg-[var(--color-primary-80)] hover:shadow-[0_16px_30px_rgba(118,89,44,0.28)] max-sm:h-[48px] max-sm:w-[48px] max-sm:rounded-[14px]"
            aria-label="Отправить сообщение"
        >
            <SendMessageIcon />
        </button>
    </div>
</template>

<script setup lang="ts">
    import AttachFileIcon from '@/shared/icons/chat/AttachFile.vue';
    import SendMessageIcon from '@/shared/icons/chat/SendMessage.vue';

    withDefaults(defineProps<{
        modelValue?: string;
        placeholder?: string;
    }>(), {
        modelValue: '',
        placeholder: 'Напишите сообщение...',
    });

    const emit = defineEmits<{
        'update:modelValue': [value: string];
    }>();

    const onInput = (event: Event) => {
        const target = event.target as HTMLTextAreaElement;
        emit('update:modelValue', target.value);
    };
</script>
