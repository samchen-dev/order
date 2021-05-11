<template>
  <div>
    <Preview :contract="contract" :handover="handover" :make="make" :previewMode="previewMode" v-if="renderFlag"></Preview>
  </div>
</template>
<script>

import Preview from './Preview.vue'

export default {
  name: 'PreviewSheel',
  props: {
    makeProp: {
      type: Object,
      required: true
    },
    orderID: {
      type: String,
      required: true
    }
  },
  components: {
    Preview,
  },
  data() {
    return {
      // 合同
      contract: null,
      // 交接单
      handover: null,
      // 采购合同
      make: {
        current: {
        },
        target: {
        }
      },
      // 子组件渲染标记
      renderFlag: false,
      // 未完成采购合同预览undone、完成采购合同预览complete
      previewMode: 'complete',
    }
  },
  methods: {
    // 格式化采购合同数据
    formatMake() {
      console.log('loadMake')

      // 时间格式化
      this.make.current.signingDate = this.$XEUtils.toDateString(this.make.current.signingDate, 'yyyy-MM-dd')
      this.make.current.deliveryDate = this.$XEUtils.toDateString(this.make.current.deliveryDate, 'yyyy-MM-dd')
    },
    // 加载订单数据、交接单数据
    async loadOrderAndHandoverAndMake() {
      console.log('loadOrderAndHandoverAndMake')
      // 读取订单、交接单
      if (!this.orderID || !this.makeProp) return this.$message.error('缺少必要参数orderID或makeID,无法执行生产安排！')
      const { data: res } = await this.$http.get('/order/getOrder/v1', {
        params: {
          orderID: this.orderID
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 订单、交接单数据格数处理
      this.contract = res.data.order
      this.contract.orderDate = this.$XEUtils.toDateString(this.contract.orderDate, 'yyyy-MM-dd')
      this.handover = res.data.handover
      this.handover.handoverDate = this.$XEUtils.toDateString(this.handover.handoverDate, 'yyyy-MM-dd')
      this.handover.order.deliveryDate = this.$XEUtils.toDateString(this.handover.order.deliveryDate, 'yyyy-MM-dd')

      {
        // 读取采购合同
        const { data: res } = await this.$http.get('/make/getMake/v1', {
          params: {
            orderID: this.makeProp.orderID
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        // 数据库中读取的数据包括current标签，符合预览组件需要
        this.make.current = res.data.make
        this.make.target = this.make.current.target
        console.log(this.make)
      }

      // 加载采购合同
      this.formatMake()
      // 加载完毕后，开始渲染子组件
      this.renderFlag = true
      console.log('previewSheel数据加载完毕', this.make)
    }
  },
  created() {
    console.log('created')
    this.loadOrderAndHandoverAndMake()
  }
}
</script>
