<template>
    <section class="login min-h-screen">
        <div class="login__content flex min-h-screen items-stretch justify-between max-md:block">
            <div class="login__left w-1/2 max-md:hidden">
                <img src="@/assets/images/site/login.png" alt="login" class="h-[100vh] w-full object-cover">
            </div>
            <div class="login__right flex h-[100vh] w-1/2 items-center justify-center bg-[#F2F4F6] p-10 max-md:min-h-screen max-md:h-auto max-md:w-full max-md:p-4">
                <div class="w-full max-w-[860px]">
                    <slot />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
</script>
