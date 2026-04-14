<template>
    <section class="breadcrumbs !m-[30px_0] max-md:!m-[20px_0_10px]">
        <div class="container">
            <div class="breadcrumbs__container flex flex-wrap items-center gap-y-[6px]">
                <template v-for="(link, index) in links" :key="index">
                    
                    <RouterLink
                        :to="link.path"
                        class="!text-[#76592C] font-[Inter] text-[14px] font-medium leading-[16px] tracking-[2.4px] uppercase max-sm:text-[12px] max-sm:leading-[14px] max-sm:tracking-[1.8px]"
                    >
                        {{ link.text }}
                    </RouterLink>

                    <span
                        v-if="index < links.length - 1"
                        class="breadcrumbs__separator !m-[0_10px] !text-[#76592C] max-sm:!m-[0_6px]"
                    >
                        |
                    </span>

                </template>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">

    type Breadcrumb = {
        text: string;
        path: string;
    };

    const props = defineProps<{
        links: Breadcrumb[];
    }>();

</script>
