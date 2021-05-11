<template>
  <div>
    <el-tabs v-model="id" tab-position="bottom">
      <el-tab-pane
        v-for="(item, index) in make.factory" :key="index" :label="item.orderID" :name="item.orderID"
      >
        <!-- <Preview :contract="contract" :handover="handover" :makeProp="make" :factoryIndex="index"></Preview> -->
        <el-divider content-position="left" v-if="make.factory.lenght > 1">预览切换</el-divider>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Preview from './ProducePreview.vue'

export default {
  name: 'ProducePreviewArray',
  components: {
    Preview,
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
  },
  data() {
    return {
      id: 0,
    }
  },
  created() {
    console.log('created...')
  }
}
</script>
