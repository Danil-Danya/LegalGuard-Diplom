<template>
    <component
        :is="componentTag"
        :to="isRouter ? path : undefined"
        :href="!isRouter ? path : undefined"
        class="link uppercase !text-accent !underline"
    >
        {{ text }}
    </component>
</template>

<script setup lang="ts">

    import { computed } from 'vue';

    const props = withDefaults(defineProps<{
        isRouter?: boolean;
        path: string;
        text: string;
    }>(), {
        isRouter: true,
    });

    const componentTag = computed(() => {
        return props.isRouter ? 'RouterLink' : 'a';
    });
    
</script>
