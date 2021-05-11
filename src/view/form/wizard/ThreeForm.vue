<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="合同预览">
        <CP v-bind:contract="contract"></CP>
      </el-tab-pane>
      <el-tab-pane label="发票预览">
        <IP v-bind:contract="contract"></IP>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import CP from './ContractPreview.vue'
import IP from './InvoicePreview.vue'

export default {
  name: 'ThreeForm',
  components: {
    CP,
    IP
  },
  props: {
    contract: {
      type: Object,
      required: true
    }
  }
}
</script>
