<template>
    <div class="template__cards h-full rounded-[10px] bg-white !p-[20px] max-md:!p-[16px]">
        <div class="template__cards-top">
            <RouterLink :to="path" class="template__cards-link-wrapper block overflow-hidden rounded-[10px]">
                <img :src="previewPath" :alt="title" class="templates__cards-img aspect-[16/10] w-full object-cover">
            </RouterLink>
        </div>
        <div class="templates__cards-center !mt-[20px] max-md:!mt-[16px]">
            <h4 class="template__cards-title font-semibold max-md:text-[20px] max-md:leading-[26px]">{{ title }}</h4>
            <p class="templates__cards-text text !mt-[10px] !text-[14px] !text-[#596065] max-md:!mt-[8px] max-md:leading-[22px]">
                {{ text }}
            </p>
        </div>
        <div class="templates__cards-bottom !mt-[10px] max-md:!mt-[12px]">
            <RouterLink :to="path" class="templates__cards-link flex items-center gap-[10px] font-semibold !text-[#76592C] !text-[16px] max-md:!text-[15px]">
                <span>Использовать шаблон</span>
                <span>
                    <TemplatesArrow />
                </span>
            </RouterLink>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import TemplatesArrow from '@/shared/icons/templates/TemplatesArrow.vue';

    defineProps<{
        previewPath: string;
        title: string;
        text: string;
        path: string;
    }>();
</script>
