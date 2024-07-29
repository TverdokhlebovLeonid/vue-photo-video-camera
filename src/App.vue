<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <component :is="route.meta.layoutComponent">
    <RouterView />
  </component>
</template>
