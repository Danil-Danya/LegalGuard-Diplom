<template>
    <section class="service">
        <div class="container">
            <div class="service__content grid grid-cols-1 items-center gap-[40px] py-[50px] md:grid-cols-2 md:gap-[80px] md:py-[100px]">
                <div class="service__info">
                    <h2 class="title mb-[20px] max-w-[520px]">
                        Доступно на всех ваших устройствах
                    </h2>

                    <p class="text text-text-secondary mb-[32px] max-w-[560px]">
                        Синхронизируйте ваши документы и задачи между устройствами.
                        Быстрый доступ и стабильная работа на любой платформе.
                    </p>

                    <div class="flex flex-wrap gap-[12px]">
                        <div class="px-[16px] py-[10px] rounded-[10px] bg-text-primary text-white text-[14px]">
                            Android
                        </div>

                        <div class="px-[16px] py-[10px] rounded-[10px] bg-text-primary text-white text-[14px]">
                            iOS
                        </div>

                        <div class="px-[16px] py-[10px] rounded-[10px] bg-text-primary text-white text-[14px]">
                            Windows
                        </div>
                    </div>
                </div>

                <div class="service__preview flex justify-center md:justify-end">
                    <div class="w-full max-w-[360px]">
                        <slot name="phone" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">

</script>