<template>
  <el-popover
    placement="bottom"
    trigger="click"
    :width="220"
    :show-arrow="true"
    popper-class="qr-popover"
  >
    <div class="qr-card">
      <div class="qr-heading">
        <strong>链接二维码</strong>
        <span>扫码即可访问短链接</span>
      </div>
      <div class="qr-canvas-wrap">
        <canvas ref="canvas"></canvas>
      </div>
      <el-button class="download-button" type="primary" @click="download">
        <el-icon><Download /></el-icon>
        下载二维码
      </el-button>
    </div>
    <template #reference>
      <button
        class="qr-trigger"
        type="button"
        aria-label="查看二维码"
        title="查看二维码"
        style="width: 30px; height: 30px; min-width: 30px; padding: 0; overflow: hidden"
      >
        <el-icon style="font-size: 17px; color: var(--brand-primary)"><Grid /></el-icon>
      </button>
    </template>
  </el-popover>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import QRCode from 'qrcode'

const props = defineProps({
  url: {
    type: String,
    default: ''
  }
})

const canvas = ref()

const createQrCode = async () => {
  if (!canvas.value || !props.url) return
  await QRCode.toCanvas(canvas.value, props.url, {
    width: 172,
    margin: 1,
    color: { dark: '#111827', light: '#ffffff' }
  })
}

const download = () => {
  if (!canvas.value) return
  const link = document.createElement('a')
  link.href = canvas.value.toDataURL('image/png')
  link.download = '短链接二维码.png'
  link.click()
  ElMessage.success('二维码已下载')
}

onMounted(createQrCode)
watch(() => props.url, createQrCode)
</script>

<style lang="scss" scoped>
:global(.qr-popover.el-popover) {
  padding: 14px !important;
  border: 1px solid var(--border-color) !important;
  border-radius: 16px !important;
  background: var(--surface-color) !important;
  box-shadow: var(--shadow-lg) !important;
}

.qr-card {
  display: flex;
  width: 190px;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
}

.qr-heading {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.qr-heading strong {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 700;
}

.qr-heading span {
  color: var(--text-tertiary);
  font-size: 11px;
}

.qr-canvas-wrap {
  display: grid;
  place-items: center;
  width: 190px;
  height: 190px;
  padding: 9px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: #fff;
  box-sizing: border-box;
  overflow: hidden;
}

.qr-canvas-wrap canvas {
  display: block;
  width: 172px !important;
  height: 172px !important;
}

.download-button {
  width: 190px;
  height: 36px;
  margin: 0;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
  font-weight: 600;
  box-sizing: border-box;
}

.download-button .el-icon {
  margin-right: 7px;
}

.qr-trigger {
  display: grid;
  place-items: center;
  flex: 0 0 30px;
  width: 30px;
  min-width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.qr-trigger:hover {
  background: var(--brand-soft);
  transform: translateY(-1px);
}
</style>
