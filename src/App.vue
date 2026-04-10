<script setup>
</script>

<template>
  <RouterView></RouterView>
</template>

<style>
:root {
  --app-bg: #f3f6fb;
  --app-surface: #ffffff;
  --app-surface-soft: #f8fafc;
  --app-surface-muted: #eef3f8;
  --app-border: #d8e0ea;
  --app-border-strong: #c4cfdb;
  --app-text: #0f172a;
  --app-text-muted: #475569;
  --app-text-subtle: #64748b;
  --app-primary: #1d4ed8;
  --app-primary-soft: #dbeafe;
  --app-primary-deep: #123a8c;
  --app-accent: #0f766e;
  --app-warning: #b45309;
  --app-danger: #b42318;
  --el-color-primary: var(--app-primary);
  --el-color-primary-light-3: #4f83f1;
  --el-color-primary-light-5: #7da7f5;
  --el-color-primary-light-7: #aec7fa;
  --el-color-primary-light-8: #c8dafd;
  --el-color-primary-light-9: #e3edff;
  --el-color-primary-dark-2: #1740a8;
  --el-color-success: var(--app-accent);
  --el-color-warning: var(--app-warning);
  --el-color-danger: var(--app-danger);
  --el-text-color-primary: var(--app-text);
  --el-text-color-regular: var(--app-text-muted);
  --el-border-color: var(--app-border);
  --el-border-color-light: #e5ecf4;
  --el-border-color-darker: #c0cada;
  --el-fill-color-light: var(--app-surface-soft);
  --el-fill-color-blank: var(--app-surface);
  --el-bg-color: var(--app-surface);
  --el-bg-color-page: var(--app-bg);
  --el-menu-bg-color: transparent;
  --el-menu-text-color: #cbd5e1;
  --el-menu-hover-text-color: #ffffff;
  --el-menu-active-color: #ffffff;
  --el-menu-hover-bg-color: rgba(255, 255, 255, 0.08);
}

body {
  background-color: var(--app-bg);
  color: var(--app-text);
}

* {
  margin: 0;
  padding: 0;
}
</style>
