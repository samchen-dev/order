<template>
  <div>
    <el-tabs type="border-card" :tab-position="previewMode === 'undone' ? 'bottom' : 'top' ">
      <el-tab-pane label="采购合同预览">
        <produce-preview :contract="contract" :handover="handover" :makeProp="make" :previewMode="previewMode"></produce-preview>
      </el-tab-pane>
      <el-tab-pane label="货源交接预览">
        <supply-preview :make="make" :handover="handover"></supply-preview>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ProducePreview from './ProducePreview.vue'
import SupplyPreview from './SupplyPreview.vue'

export default {
  name: 'Preview',
  components: {
    ProducePreview,
    SupplyPreview
  },
  props: {
    contract: {
      type: Object,
      required: true
    },
    handover: {
      type: Object,
      required: true
    },
    make: {
      type: Object,
      required: true
    },
    // 未完成采购合同预览undone、完成采购合同预览complete
    previewMode: {
      type: String,
      default: 'undone'
    }
  }
}
</script>
