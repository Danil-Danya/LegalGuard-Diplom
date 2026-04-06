<template>
    <p class="error-message">{{ text }}</p>
</template>

<script setup lang="ts">

    const props = defineProps<{
        text: string;
    }>();

</script>