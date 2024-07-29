<template>
  <div class="without-header-layout">
    <el-container>
      <el-main>
        <slot />
      </el-main>
    </el-container>
  </div>
</template>
<style scoped lang="scss">
.el-main {
  --el-main-padding: 0;
}
</style>
