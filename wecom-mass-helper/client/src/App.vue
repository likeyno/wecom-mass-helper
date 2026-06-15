<template>
  <div id="app">
    <el-container style="min-height: 100vh;">
      <el-header style="background: #409eff; color: #fff; display: flex; align-items: center; padding: 0 20px;">
        <h2 style="margin: 0; font-size: 20px;">企业微信群发助手</h2>
        <div style="margin-left: 40px;">
          <el-menu mode="horizontal" :ellipsis="false" style="background: transparent; border: none;"
            text-color="#fff" active-text-color="#fff" router>
            <el-menu-item index="/tasks">任务管理</el-menu-item>
            <el-menu-item index="/templates">模板管理</el-menu-item>
          </el-menu>
        </div>
      </el-header>
      <el-main style="padding: 24px;">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
.el-menu--horizontal > .el-menu-item {
  color: rgba(255, 255, 255, 0.8) !important;
}
.el-menu--horizontal > .el-menu-item.is-active {
  color: #fff !important;
  background: rgba(255, 255, 255, 0.1) !important;
}
</style>
