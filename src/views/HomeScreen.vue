<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const isLoading = ref<boolean>(false)

const router = useRouter()
const toCamera = (): void => {
  isLoading.value = true
  router.push({ name: 'camera' })
}

onBeforeUnmount(() => {
  isLoading.value = false
})
</script>
<template>
  <div class="home-screen" v-loading="isLoading">
    <el-card @click="toCamera">
      <template #header>
        <el-text type="success">Запустить камеру</el-text>
      </template>
      <el-icon :size="200" color="#0c0ca3">
        <Camera />
      </el-icon>
    </el-card>
  </div>
</template>
<style scoped lang="scss">
.home-screen {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 180px);
  .el-card {
    cursor: pointer;
  }
}
</style>
