<script setup>
import WindowBar from '@/components/WindowBar.vue'
import SideMenu from '@/components/SideMenu.vue'
</script>

<template>
  <div class="flex h-screen w-screen flex-col">
    <WindowBar />
    <div class="relative flex flex-1 overflow-y-hidden" id="layout">
      <SideMenu id="aside" />
      <main class="relative flex-1" id="main">
        <RouterView v-slot="{ Component }">
          <KeepAlive>
            <component :is="Component" />
          </KeepAlive>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<style scoped></style>
