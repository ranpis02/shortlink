<template>
  <div class="common-layout">
    <el-container>
      <el-header height="72px" style="padding: 0">
        <div class="header">
          <div @click="toMySpace" class="brand" aria-label="返回短链空间">
            <span class="brand-mark"><el-icon><Link /></el-icon></span>
            <span class="brand-copy">
              <strong>SaaS 短 链 接 平 台</strong>
              <small>Link management workspace</small>
            </span>
          </div>
          <div class="header-actions">
            <ThemeSwitcher />
            <el-dropdown>
              <div class="user-trigger">
                <span class="user-avatar">{{ username?.slice(0, 1)?.toUpperCase() }}</span>
                <span class="name-span">{{ username }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="toMine">个人信息</el-dropdown-item>
                  <el-dropdown-item divided @click="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-main style="padding: 0">
        <div class="content-box">
          <RouterView class="content-space" />
        </div>
      </el-main>
      <!-- <el-container>
        <el-aside width="180px">
          <el-menu
            active-text-color="#073372"
            background-color="#0e5782"
            class="el-menu-vertical-demo"
            :default-active="getLasteRoute(route.path)"
            text-color="#fff"
            @select="handleSelect"
          >
            <template v-for="item in menuInfos" :key="item.name">
              <el-menu-item :index="item.path">
                <el-icon><icon-menu /></el-icon>
                <span>{{ item.name }}</span>
              </el-menu-item>
            </template>
          </el-menu></el-aside
        >

      </el-container> -->
    </el-container>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { removeKey, removeUsername, getToken, getUsername } from '@/core/auth.js'
import { ElMessage } from 'element-plus'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
const { proxy } = getCurrentInstance()
const API = proxy.$API
// 当当前路径和菜单不匹配时，菜单不会被选中
const router = useRouter()
const toMine = () => {
  router.push('/home' + '/account')
}
// 登出
const logout = async () => {
  const token = getToken()
  const username = getUsername()
  // 请求登出的接口
  await API.user.logout({ token, username })
  // 删除cookies中的token和username
  removeUsername()
  removeKey()
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  router.push('/login')
  ElMessage.success('成功退出！')
}
// 点击左上方的图片跳转到我的空间
const toMySpace = () => {
  router.push('/home' + '/space')
}
const username = ref('')
onMounted(async () => {
  const actualUsername = getUsername() || '用户'
  await API.user.queryUserInfo(actualUsername)
  username.value = truncateText(actualUsername, 8)
})

// 辅助函数，用于截断文本
const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}
</script>

<style lang="scss" scoped>
.el-container {
  height: 100vh;

  .el-aside {
    border: 0;
    background-color: #0e5782;

    ul {
      border: 0px;
    }
  }

  .el-main {
    background-color: var(--page-background);
  }
}

.header {
  color: var(--text-primary);
  background: color-mix(in srgb, var(--surface-color) 88%, transparent);
  border-bottom: 1px solid var(--border-color);
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(18px);
  box-shadow: var(--shadow-sm);

  .block {
    cursor: pointer;
    display: flex;
    align-items: center;
    border: 0px;
  }
}

.content-box {
  height: calc(100vh - 72px);
  background-color: var(--page-background);
}

:deep(.el-tooltip__trigger:focus-visible) {
  outline: unset;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  color: #fff;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
  box-shadow: 0 8px 20px var(--brand-shadow);
  font-size: 19px;
}

.brand-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand-copy strong {
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.brand-copy small {
  margin-top: 4px;
  color: var(--text-tertiary);
  font-size: 10px;
  letter-spacing: 0.06em;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 40px;
  padding: 4px 10px 4px 5px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-secondary);
  background: var(--surface-muted);
  cursor: pointer;
}

.user-avatar {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  color: #fff;
  background: linear-gradient(135deg, #8b5cf6, #4f46e5);
  font-size: 12px;
  font-weight: 700;
}

.name-span {
  max-width: 100px;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

@media (max-width: 680px) {
  .header {
    padding: 0 12px;
  }

  .brand-copy small,
  .name-span {
    display: none;
  }

  .header-actions {
    gap: 8px;
  }
}
</style>
