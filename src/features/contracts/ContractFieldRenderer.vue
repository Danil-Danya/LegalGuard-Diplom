<template>
    <div
        ref="fieldContainerRef"
        class="relative min-w-0"
        :class="field.span === 2 ? 'md:col-span-2' : ''"
        @focusin="handleFocusIn"
        @focusout="handleFocusOut"
    >
        <Input
            v-if="field.type === 'text' || field.type === 'date'"
            :label="field.label"
            :model-value="stringValue"
            :placeholder="field.placeholder || ''"
            :type="field.type"
            @update:model-value="emitValue"
        />

        <TextArea
            v-else-if="field.type === 'textarea'"
            :label="field.label"
            :model-value="stringValue"
            :placeholder="field.placeholder || ''"
            :rows="field.rows || 5"
            @update:model-value="emitValue"
        />

        <ContractUploadField
            v-else
            :accept="field.accept"
            :description="field.description"
            :label="field.label"
            :model-value="fileValue"
            @update:model-value="emitValue"
        />

        <Transition name="profile-suggestion">
            <div
                v-if="showProfileSuggestion"
                class="absolute left-0 right-0 top-[calc(100%+10px)] z-[80]"
            >
                <div class="overflow-hidden rounded-[20px] border border-[var(--color-primary-30)] bg-white shadow-[0_24px_48px_rgba(45,51,56,0.14)]">
                    <div class="border-l-[4px] border-l-[var(--color-primary)] !p-[18px_18px_16px_20px]">
                        <div class="flex items-start gap-[12px]">
                            <span class="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] bg-[var(--color-primary-10)] p-[8px]">
                                <img :src="logoImage" alt="LegalGuard AI" class="h-full w-full object-contain">
                            </span>

                            <div class="min-w-0 flex-1">
                                <p class="text-[16px] leading-[26px] text-[var(--color-text-secondary)]">
                                    LegalGuard AI предлагает подставить данные из вашего профиля.
                                </p>

                                <p class="!mt-[8px] text-[16px] leading-[26px] text-[var(--color-text-primary)]">
                                    {{ suggestedFullName }}
                                </p>

                                <p class="!mt-[4px] text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                                    Юридическая служба LegalGuard AI
                                </p>

                                <div class="!mt-[14px] flex flex-wrap items-center gap-[10px]">
                                    <button
                                        type="button"
                                        class="inline-flex !p-[5px__30px] items-center justify-center rounded-[9px] border border-[var(--color-primary-30)] px-[14px] text-[14px] font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-10)]"
                                        @click="dismissProfileSuggestion"
                                    >
                                        Отказаться
                                    </button>
                                    <button
                                        type="button"
                                        class="inline-flex !p-[5px__30px] items-center justify-center rounded-[9px] bg-[var(--color-primary)] px-[14px] text-[14px] font-medium text-white transition-colors hover:bg-accent"
                                        @click="applyProfileSuggestion"
                                    >
                                        Принять
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';

    import logoImage from '@/assets/images/logo/logo.png';
    import type { ContractFieldSchema, ContractFieldValue } from '@/entities/contracts/lib/types';
    import { useUserStore } from '@/entities/users/models/store';
    import Input from '@/shared/ui/Input.vue';
    import TextArea from '@/shared/ui/TextArea.vue';

    import ContractUploadField from './ContractUploadField.vue';

    const props = defineProps<{
        field: ContractFieldSchema;
        modelValue: ContractFieldValue;
    }>();

    const emit = defineEmits<{
        (e: 'update:modelValue', value: ContractFieldValue): void;
    }>();

    const userStore = useUserStore();
    const fieldContainerRef = ref<HTMLElement | null>(null);
    const isFieldActive = ref(false);
    const isSuggestionDismissed = ref(false);

    const stringValue = computed(() => {
        return typeof props.modelValue === 'string' ? props.modelValue : '';
    });

    const fileValue = computed(() => {
        return props.modelValue instanceof File ? props.modelValue : null;
    });

    const normalizedProfile = computed(() => {
        const rawProfile = userStore.myProfile as {
            firstName?: string;
            lastName?: string;
            profile?: {
                firstName?: string;
                lastName?: string;
            };
        };

        return rawProfile.profile ?? rawProfile;
    });

    const suggestedFullName = computed(() => {
        const parts = [
            normalizedProfile.value.firstName?.trim(),
            normalizedProfile.value.lastName?.trim(),
        ].filter(Boolean);

        return parts.join(' ');
    });

    const showProfileSuggestion = computed(() => {
        return props.field.key === 'firstParty'
            && isFieldActive.value
            && !isSuggestionDismissed.value
            && !stringValue.value.trim()
            && Boolean(suggestedFullName.value);
    });

    const emitValue = (value: ContractFieldValue) => {
        emit('update:modelValue', value);
    };

    const handleFocusIn = () => {
        isFieldActive.value = true;
    };

    const handleFocusOut = (event: FocusEvent) => {
        const nextTarget = event.relatedTarget as Node | null;

        if (nextTarget && fieldContainerRef.value?.contains(nextTarget)) {
            return;
        }

        isFieldActive.value = false;
    };

    const applyProfileSuggestion = () => {
        if (!suggestedFullName.value) {
            return;
        }

        emitValue(suggestedFullName.value);
        isSuggestionDismissed.value = true;
        isFieldActive.value = false;
    };

    const dismissProfileSuggestion = () => {
        isSuggestionDismissed.value = true;
        isFieldActive.value = false;
    };
</script>

<style scoped>
    .profile-suggestion-enter-active,
    .profile-suggestion-leave-active {
        transition: opacity 220ms ease, transform 220ms ease;
    }

    .profile-suggestion-enter-from,
    .profile-suggestion-leave-to {
        opacity: 0;
        transform: translateY(-8px) scale(0.98);
    }

    .profile-suggestion-enter-to,
    .profile-suggestion-leave-from {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
</style>
