<template>
  <div class="account-layout">
    <aside class="account-sidebar">
      <div class="sidebar-title">账户中心</div>
      <div class="sidebar-item active">
        <el-icon><User /></el-icon>
        <span>个人信息</span>
      </div>
    </aside>

    <main class="account-main">
      <div class="page-heading">
        <div>
          <h1>个人信息</h1>
          <p>查看和维护你的基础账户资料</p>
        </div>
      </div>

      <section class="profile-card">
        <div class="profile-banner">
          <div class="profile-summary">
            <div class="avatar">{{ initials }}</div>
            <div>
              <h2>{{ profile.realName || profile.username || '用户' }}</h2>
              <p>@{{ profile.username || '—' }}</p>
            </div>
          </div>
          <el-button class="edit-button" type="primary" @click="dialogVisible = true">
            <el-icon><EditPen /></el-icon>
            编辑资料
          </el-button>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="info-icon"><el-icon><User /></el-icon></span>
            <div><label>用户名</label><strong>{{ profile.username || '—' }}</strong></div>
          </div>
          <div class="info-item">
            <span class="info-icon"><el-icon><Iphone /></el-icon></span>
            <div><label>手机号</label><strong>{{ profile.phone || '—' }}</strong></div>
          </div>
          <div class="info-item">
            <span class="info-icon"><el-icon><Postcard /></el-icon></span>
            <div><label>姓名</label><strong>{{ profile.realName || '—' }}</strong></div>
          </div>
          <div class="info-item">
            <span class="info-icon"><el-icon><Message /></el-icon></span>
            <div><label>邮箱</label><strong>{{ profile.mail || '—' }}</strong></div>
          </div>
        </div>
      </section>
    </main>
  </div>

  <el-dialog
    v-model="dialogVisible"
    class="profile-dialog"
    title="编辑个人信息"
    width="560px"
    align-center
    destroy-on-close
  >
    <p class="dialog-description">更新你的联系方式和基本资料，用户名暂不支持修改。</p>
    <el-form
      ref="userInfoFormRef"
      :model="userInfoForm"
      class="profile-form"
      label-position="top"
      :rules="formRule"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userInfoForm.username" size="large" disabled>
          <template #prefix><el-icon><User /></el-icon></template>
        </el-input>
      </el-form-item>
      <div class="form-row">
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="userInfoForm.realName" placeholder="请输入姓名" size="large" clearable />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userInfoForm.phone" placeholder="请输入手机号" size="large" clearable />
        </el-form-item>
      </div>
      <el-form-item label="邮箱" prop="mail">
        <el-input v-model="userInfoForm.mail" placeholder="name@example.com" size="large" clearable />
      </el-form-item>
      <el-form-item label="新密码（可选）" prop="password">
        <el-input
          v-model="userInfoForm.password"
          type="password"
          placeholder="如需修改，请输入 8–15 位新密码"
          size="large"
          show-password
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-actions">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="changeUserInfo(userInfoFormRef)">保存修改</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, getCurrentInstance, reactive, ref } from 'vue'
import { getUsername } from '@/core/auth'
import { cloneDeep } from 'lodash'
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance()
const API = proxy.$API
const userInfoFormRef = ref()
const userInfo = ref()
const userInfoForm = ref({ username: '', phone: '', realName: '', mail: '', password: '' })
const dialogVisible = ref(false)
const submitting = ref(false)

const profile = computed(() => userInfo.value?.data?.data || {})
const initials = computed(() => {
  const name = profile.value.realName || profile.value.username || 'U'
  return name.slice(0, 1).toUpperCase()
})

const getUserInfo = async () => {
  const response = await API.user.queryUserInfo(getUsername())
  userInfo.value = response
  userInfoForm.value = { ...cloneDeep(response.data?.data), password: '' }
}

const formRule = reactive({
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
  password: [{ min: 8, max: 15, message: '密码长度需为 8–15 位', trigger: 'blur' }]
})

const changeUserInfo = async (formEl) => {
  if (!formEl || submitting.value) return
  const valid = await formEl.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const response = await API.user.editUser(userInfoForm.value)
    if (response?.data?.code !== '0') {
      ElMessage.error(response.data.message)
      return
    }
    await getUserInfo()
    dialogVisible.value = false
    ElMessage.success('个人信息已更新')
  } finally {
    submitting.value = false
  }
}

getUserInfo()
</script>

<style lang="scss">
.account-layout {
  display: flex;
  width: 100%;
  height: 100%;
  color: var(--text-primary);
  background: var(--page-background);
}

.account-sidebar {
  flex: 0 0 190px;
  padding: 22px 14px;
  border-right: 1px solid var(--border-color);
  background: var(--surface-color);
}

.sidebar-title {
  padding: 0 12px 18px;
  color: var(--text-tertiary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 42px;
  padding: 0 12px;
  border-radius: 10px;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
}

.sidebar-item.active {
  color: var(--brand-primary);
  background: var(--brand-soft);
}

.account-main {
  flex: 1;
  min-width: 0;
  padding: 38px clamp(24px, 5vw, 72px);
  overflow-y: auto;
}

.page-heading {
  display: flex;
  justify-content: space-between;
  max-width: 960px;
  margin: 0 auto 24px;
}

.page-heading h1 {
  color: var(--text-primary);
  font-size: 28px;
  line-height: 1.4;
  font-weight: 750;
}

.page-heading p {
  margin-top: 5px;
  color: var(--text-tertiary);
  font-size: 13px;
}

.profile-card {
  max-width: 960px;
  margin: 0 auto;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  background: var(--surface-color);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.profile-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 34px;
  border-bottom: 1px solid var(--border-color);
  background:
    radial-gradient(circle at 85% 10%, var(--accent-soft), transparent 38%),
    linear-gradient(135deg, var(--brand-soft), transparent 55%);
}

.profile-summary {
  display: flex;
  align-items: center;
  gap: 17px;
}

.avatar {
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  border: 3px solid color-mix(in srgb, var(--surface-color) 80%, transparent);
  border-radius: 18px;
  color: #fff;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
  box-shadow: 0 10px 24px var(--brand-shadow);
  font-size: 22px;
  font-weight: 750;
}

.profile-summary h2 {
  color: var(--text-primary);
  font-size: 20px;
  line-height: 1.5;
  font-weight: 700;
}

.profile-summary p {
  color: var(--text-tertiary);
  font-size: 12px;
}

.edit-button {
  height: 40px;
  padding: 0 17px;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
  box-shadow: 0 8px 20px var(--brand-shadow);
  font-weight: 600;
}

.edit-button .el-icon {
  margin-right: 7px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  padding: 28px 34px 34px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  padding: 18px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: var(--surface-muted);
  transition: border-color 0.2s, transform 0.2s;
}

.info-item:hover {
  border-color: color-mix(in srgb, var(--brand-primary) 45%, var(--border-color));
  transform: translateY(-1px);
}

.info-icon {
  display: grid;
  place-items: center;
  flex: 0 0 38px;
  width: 38px;
  height: 38px;
  border-radius: 11px;
  color: var(--brand-primary);
  background: var(--brand-soft);
  font-size: 17px;
}

.info-item div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
}

.info-item label {
  color: var(--text-tertiary);
  font-size: 11px;
}

.info-item strong {
  overflow: hidden;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dialog-description {
  margin: -8px 0 22px;
  color: var(--text-tertiary);
  font-size: 12px;
}

.profile-form :deep(.el-form-item__label) {
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
}

.profile-form :deep(.el-input__wrapper) {
  min-height: 44px;
  border-radius: 10px;
  background: var(--input-background);
  box-shadow: 0 0 0 1px var(--border-color) inset;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

@media (max-width: 720px) {
  .account-sidebar { display: none; }
  .account-main { padding: 24px 14px; }
  .profile-banner { align-items: flex-start; gap: 22px; padding: 24px 20px; }
  .profile-summary { align-items: flex-start; }
  .info-grid { grid-template-columns: 1fr; padding: 20px; }
  .edit-button { padding: 0 12px; }
  .edit-button .el-icon { margin: 0; }
  .edit-button span { font-size: 0; }
  .form-row { grid-template-columns: 1fr; gap: 0; }
  :global(.profile-dialog) { width: calc(100% - 28px) !important; }
}
</style>
