<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="交接单填写">
        <HR :contract="contract" :handover="handover"  v-on="$listeners" v-if="contractFlag" />
      </el-tab-pane>
      <el-tab-pane label="交接单预览">
        <HP :contract="contract" :handover="handover" v-if="contractFlag" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Vue from 'vue'
import HP from './handover/HandoverPreview.vue'
import HR from './handover/HandoverRoot.vue'
import OrderInfo from '../OrderInfo'

export default {
  name: 'handoverOrder',
  props: {
    orderID: {
      type: String
    }
  },
  components: {
    HP,
    HR
  },
  data() {
    return {
      // 控制组件初始化的标记,需要在交接单组件初始化完毕后，在子组件内把handoverPreviewFlag:true
      cpnLoadFlag: false,
      // 客户订单数据加载完毕，才能初始化HandoverRoot.vue组件
      contractFlag: false,
      // 客户签订的订单
      contract: null,
      // 交接单内容
      handover: {
        // 交接单生成时间
        handoverDate: '',
        // 交接单创建人
        user: '',
        // 关联交接单和订单的订单号
        orderID: null,
        order: {
          // 预计交货期
          deliveryDate: '',
          // 订单概要信息
          remark: {
            // 产品描述
            products: []
          },
          // 整体描述
          description: '',
          // 上传附件列表
          fileListServer: [],
        },
        // 生产信息
        produce: {
          // 包装
          packaging: '',
          // 唛头
          mark: '中性唛头',
          // 包装附件列表
          fileListServer: [],
        },
        // 海运信息
        shipping: {
          // 核算运费
          accountingShipping: 0,
          // 货柜
          container: {
            // 货柜类型
            genre: '整柜20GP',
            // 货柜描述
            description: '',
          },
          // 提单要求
          billOfLading: {
            // 提单形式，正本提单，还是电放提单
            shape: '正本提单',
            // 正本数量
            original: 3,
            // 副本数量
            copy: 3,
          },
          // 收货人
          consignee: '',
          // 通知人
          notify: '',
          // 海运代理
          shippingAgent: '',
          // 海关编码
          showHSCode: '不显示',
          // 整体描述
          description: '',
        },
        // 单证信息
        documents: {
          // 发票份数
          invoiceQuantity: 4,
          // 装箱单份数
          packingListQuantity: 3,
          // 保险单份数
          insuranceQuantity: 3,
          // 原产地证类型
          certificateOfOrigin: 'CO',
          // REACH
          reach: '不提供',
          // 检测报告
          certificateOfAnalysis: {
            genre: '我司',
            Quantity: 3
          },
          // 交单
          bill: {
            // 交单类型，寄单给客户，还是直接给客户寄单
            // {'寄单客户', '银行交单', '寄单代理'}
            genre: '寄单客户',
            // 具体交单的地址
            address: ''
          }
        }
      },
    }
  },
  provide() {
    this.HPLoad = Vue.observable({
      cpnLoadFlag: false
    })
    return {
      HPLoad: this.HPLoad
    }
  },
  methods: {
    // 加载订单信息
    async loadOrderAndHandover() {
      console.log('loadOrder', this.$http.defaults.baseURL)
      const { data: res } = await this.$http.get('/order/getOrder/v1', {
        params: {
          orderID: this.orderID
        }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.contract = res.data.order
      // 显示之前格式化日期
      this.contract.orderDate = this.$XEUtils.toDateString(this.contract.orderDate, 'yyyy-MM-dd')
      // 订单处于草稿状态，订单和交接单关联
      if (this.contract.orderStatus === OrderInfo.OrderStatus.get('DRAFT')) {
        // 关联订单和交接单
        this.handover.orderID = this.contract.orderID
      } else {
        // 读取交接单
        this.handover = res.data.handover
        // 格式化交接单的创建时间
        this.handover.handoverDate = this.$XEUtils.toDateString(this.handover.handoverDate, 'yyyy-MM-dd')
        console.log('this.handover.handoverDate:', this.handover.handoverDate)
      }

      // 修改渲染标记为true
      this.contractFlag = true
    },
  },
  // 组件初始化
  created() {
    console.log('created')
    // 加载订单数据、交接单数据
    this.loadOrderAndHandover()
    // 打印传递的事件
    // console.log(this.$listeners)
  },
  // 销毁组件
  beforeDestroy() {
    console.log('beforeDestroy')
  }
}
</script>
