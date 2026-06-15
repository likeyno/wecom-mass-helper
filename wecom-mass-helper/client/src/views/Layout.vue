<template>
  <div class="app-layout">
    <div class="app-sidebar">
      <div class="sidebar-logo">
        <Promotion />
        群发助手
      </div>
      <div class="sidebar-menu">
        <el-menu
          :default-active="route.path"
          background-color="#1d1e1f"
          text-color="rgba(255,255,255,0.7)"
          active-text-color="#409eff"
          router
        >
          <el-menu-item index="/dashboard">
            <el-icon><DataBoard /></el-icon>
            <span>工作台</span>
          </el-menu-item>
          <el-menu-item index="/templates">
            <el-icon><Document /></el-icon>
            <span>消息模板</span>
          </el-menu-item>
          <el-menu-item index="/tasks">
            <el-icon><List /></el-icon>
            <span>群发任务</span>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
    <div class="app-main">
      <div class="app-header">
        <h3>{{ route.meta.title }}</h3>
        <div>
          <el-tag type="info">企业微信群发助手</el-tag>
        </div>
      </div>
      <div class="app-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
