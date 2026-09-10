<template>
  <main class="login-page">
    <div class="ambient ambient-one"></div>
    <div class="ambient ambient-two"></div>

    <header class="login-header">
      <div class="brand">
        <span class="brand-mark"><el-icon><Link /></el-icon></span>
        <span>SaaS 短 链 接 平 台</span>
      </div>
      <ThemeSwitcher />
    </header>

    <section class="login-shell">
      <div class="intro-panel">
        <div class="eyebrow"><span></span> SIMPLE · FAST · RELIABLE</div>
        <h1>让每一次链接分享<br />都更简单、更清晰</h1>
        <p>一站式创建、管理与分析短链接，帮助你轻松掌握每一次访问。</p>
        <div class="feature-list">
          <div class="feature-item">
            <el-icon><MagicStick /></el-icon>
            <div><strong>快捷创建</strong><span>几秒钟生成专属短链接</span></div>
          </div>
          <div class="feature-item">
            <el-icon><DataAnalysis /></el-icon>
            <div><strong>数据洞察</strong><span>清晰了解访问趋势与来源</span></div>
          </div>
          <div class="feature-item">
            <el-icon><Lock /></el-icon>
            <div><strong>稳定可靠</strong><span>专注每一次安全跳转</span></div>
          </div>
        </div>
      </div>

      <div class="auth-panel">
        <div class="auth-heading">
          <span class="welcome-tag">欢迎使用</span>
          <h2>{{ isLogin ? '登录你的账号' : '创建新账号' }}</h2>
          <p>{{ isLogin ? '继续管理你的短链接与访问数据' : '填写信息，开始使用短链接服务' }}</p>
        </div>

        <div class="auth-tabs" role="tablist">
          <button type="button" :class="{ active: isLogin }" @click="isLogin = true">登录</button>
          <button type="button" :class="{ active: !isLogin }" @click="isLogin = false">注册</button>
        </div>

        <el-form
          v-if="isLogin"
          ref="loginFormRef"
          class="auth-form"
          :model="loginForm"
          :rules="loginFormRule"
          @keyup.enter="login(loginFormRef)"
        >
          <el-form-item prop="username">
            <label>用户名</label>
            <el-input v-model="loginForm.username" placeholder="请输入用户名" size="large" clearable>
              <template #prefix><el-icon><User /></el-icon></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <label>密码</label>
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" size="large" show-password>
              <template #prefix><el-icon><Lock /></el-icon></template>
            </el-input>
          </el-form-item>
          <div class="form-meta">
            <el-checkbox v-model="checked">记住账号</el-checkbox>
          </div>
          <el-button class="submit-button" type="primary" size="large" :loading="loading" @click="login(loginFormRef)">
            登录
            <el-icon class="button-icon"><Right /></el-icon>
          </el-button>
        </el-form>

        <el-form
          v-else
          ref="registerFormRef"
          class="auth-form register-form"
          :model="addForm"
          :rules="addFormRule"
          @keyup.enter="addUser(registerFormRef)"
        >
          <div class="form-grid">
            <el-form-item prop="username">
              <label>用户名</label>
              <el-input v-model="addForm.username" placeholder="设置用户名" size="large" clearable />
            </el-form-item>
            <el-form-item prop="realName">
              <label>姓名</label>
              <el-input v-model="addForm.realName" placeholder="请输入姓名" size="large" clearable />
            </el-form-item>
            <el-form-item prop="mail">
              <label>邮箱</label>
              <el-input v-model="addForm.mail" placeholder="name@example.com" size="large" clearable />
            </el-form-item>
            <el-form-item prop="phone">
              <label>手机号</label>
              <el-input v-model="addForm.phone" placeholder="请输入手机号" size="large" clearable />
            </el-form-item>
          </div>
          <el-form-item prop="password">
            <label>密码</label>
            <el-input v-model="addForm.password" type="password" placeholder="请输入 8–15 位密码" size="large" show-password />
          </el-form-item>
          <el-button class="submit-button" type="primary" size="large" :loading="loading" @click="addUser(registerFormRef)">
            创建账号
            <el-icon class="button-icon"><Right /></el-icon>
          </el-button>
        </el-form>
      </div>
    </section>

    <footer>高效管理 · 清晰分析 · 安全跳转</footer>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getUsername, setToken, setUsername } from '@/core/auth.js'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import API from '@/api/index'

const router = useRouter()
const loginFormRef = ref()
const registerFormRef = ref()
const isLogin = ref(true)
const loading = ref(false)
const checked = ref(true)

const loginForm = reactive({
  username: localStorage.getItem('rememberedUsername') || 'admin',
  password: 'admin123456'
})

const addForm = reactive({ username: '', password: '', realName: '', phone: '', mail: '' })

const loginFormRule = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 15, message: '密码长度需为 8–15 位', trigger: 'blur' }
  ]
}

const addFormRule = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  mail: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 15, message: '密码长度需为 8–15 位', trigger: 'blur' }
  ]
}

const saveSession = (token, username) => {
  setToken(token)
  setUsername(username)
  localStorage.setItem('token', token)
  localStorage.setItem('username', username)
}

const login = async (formEl) => {
  if (!formEl || loading.value) return
  const valid = await formEl.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const response = await API.user.login(loginForm)
    const { code, data, message } = response.data
    if (code === '0' && data?.token) {
      saveSession(data.token, loginForm.username)
      checked.value
        ? localStorage.setItem('rememberedUsername', loginForm.username)
        : localStorage.removeItem('rememberedUsername')
      ElMessage.success('登录成功！')
      router.push('/home')
    } else if (message === '用户已登录' && getUsername() === loginForm.username) {
      router.push('/home')
    } else {
      ElMessage.error(message || '用户名或密码错误')
    }
  } finally {
    loading.value = false
  }
}

const addUser = async (formEl) => {
  if (!formEl || loading.value) return
  const valid = await formEl.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const existsResponse = await API.user.hasUsername({ username: addForm.username })
    if (existsResponse.data.success === false) {
      ElMessage.warning('用户名已存在')
      return
    }
    const registerResponse = await API.user.addUser(addForm)
    if (registerResponse.data.success === false) {
      ElMessage.warning(registerResponse.data.message)
      return
    }
    const loginResponse = await API.user.login({ username: addForm.username, password: addForm.password })
    const token = loginResponse.data?.data?.token
    if (token) saveSession(token, addForm.username)
    ElMessage.success('注册成功！')
    router.push('/home')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
  color: var(--text-primary);
  background:
    radial-gradient(circle at 12% 15%, var(--brand-soft) 0, transparent 28%),
    radial-gradient(circle at 88% 82%, var(--accent-soft) 0, transparent 30%),
    var(--page-background);
}

.ambient {
  position: absolute;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
  pointer-events: none;
}

.ambient-one { top: -180px; left: 26%; background: #818cf8; }
.ambient-two { right: -180px; bottom: -180px; background: #2dd4bf; }

.login-header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding: 28px 0;
}

.brand { display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 700; letter-spacing: 0.1em; }
.brand-mark { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 13px; color: #fff; background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary)); box-shadow: 0 10px 24px var(--brand-shadow); font-size: 20px; }

.login-shell {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(430px, 0.82fr);
  width: min(1180px, calc(100% - 48px));
  min-height: 620px;
  margin: auto;
  border: 1px solid var(--border-color);
  border-radius: 30px;
  background: color-mix(in srgb, var(--surface-color) 90%, transparent);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  backdrop-filter: blur(22px);
}

.intro-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 70px;
  color: #fff;
  background: linear-gradient(145deg, #312e81 0%, #4f46e5 48%, #0f766e 120%);
  overflow: hidden;
}

.intro-panel::after { content: ''; position: absolute; width: 360px; height: 360px; right: -140px; bottom: -150px; border: 70px solid rgba(255,255,255,.07); border-radius: 50%; }
.eyebrow { display: flex; align-items: center; gap: 10px; margin-bottom: 26px; color: rgba(255,255,255,.72); font-size: 11px; font-weight: 700; letter-spacing: .14em; }
.eyebrow span { width: 26px; height: 2px; background: #5eead4; }
.intro-panel h1 { position: relative; z-index: 1; font-size: clamp(34px, 3.4vw, 50px); line-height: 1.24; font-weight: 750; letter-spacing: -.04em; }
.intro-panel > p { max-width: 480px; margin-top: 24px; color: rgba(255,255,255,.72); font-size: 16px; line-height: 1.8; }
.feature-list { display: grid; gap: 24px; margin-top: 50px; }
.feature-item { display: flex; align-items: center; gap: 14px; }
.feature-item > .el-icon { display: grid; place-items: center; flex: 0 0 42px; width: 42px; height: 42px; border: 1px solid rgba(255,255,255,.16); border-radius: 13px; background: rgba(255,255,255,.1); font-size: 19px; }
.feature-item div { display: flex; flex-direction: column; gap: 3px; }
.feature-item strong { font-size: 14px; font-weight: 650; }
.feature-item span { color: rgba(255,255,255,.62); font-size: 12px; }

.auth-panel { display: flex; flex-direction: column; justify-content: center; padding: 54px 58px; background: var(--surface-color); }
.auth-heading .welcome-tag { color: var(--brand-primary); font-size: 12px; font-weight: 700; letter-spacing: .1em; }
.auth-heading h2 { margin-top: 8px; color: var(--text-primary); font-size: 29px; line-height: 1.4; font-weight: 750; }
.auth-heading p { margin-top: 7px; color: var(--text-tertiary); font-size: 13px; }
.auth-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin: 28px 0 24px; padding: 5px; border-radius: 13px; background: var(--surface-muted); }
.auth-tabs button { height: 38px; border: 0; border-radius: 9px; color: var(--text-secondary); background: transparent; font-size: 13px; font-weight: 600; cursor: pointer; transition: .2s; }
.auth-tabs button.active { color: var(--brand-primary); background: var(--surface-color); box-shadow: var(--shadow-sm); }
.auth-form label { display: block; width: 100%; margin-bottom: 7px; color: var(--text-secondary); font-size: 12px; font-weight: 650; }
.auth-form :deep(.el-form-item) { display: block; margin-bottom: 18px; }
.auth-form :deep(.el-form-item__content) { display: block; }
.auth-form :deep(.el-input__wrapper) { min-height: 46px; border-radius: 11px; background: var(--input-background); box-shadow: 0 0 0 1px var(--border-color) inset; }
.auth-form :deep(.el-input__wrapper.is-focus) { box-shadow: 0 0 0 1px var(--brand-primary) inset, 0 0 0 3px var(--brand-soft); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12px; }
.form-meta { display: flex; justify-content: space-between; margin: -4px 0 20px; }
.submit-button { width: 100%; min-height: 48px; border: 0; border-radius: 12px; background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary)); box-shadow: 0 10px 24px var(--brand-shadow); font-weight: 650; }
.button-icon { margin-left: 8px; }
footer { position: relative; z-index: 1; padding: 24px; color: var(--text-tertiary); text-align: center; font-size: 11px; letter-spacing: .12em; }

@media (max-width: 900px) {
  .login-shell { grid-template-columns: 1fr; max-width: 560px; }
  .intro-panel { display: none; }
}

@media (max-width: 560px) {
  .login-header, .login-shell { width: calc(100% - 28px); }
  .login-header { padding: 18px 0; }
  .brand { font-size: 13px; }
  .login-shell { min-height: auto; border-radius: 22px; }
  .auth-panel { padding: 34px 24px; }
  .form-grid { grid-template-columns: 1fr; }
  footer { padding: 18px; }
}
</style>
