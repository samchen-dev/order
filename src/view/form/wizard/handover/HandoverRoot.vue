<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="21">
        <el-form ref="handoverFormRef" :model="handover" label-width="90px" size="mini">
          <div v-show="active === 0">
            <OrderSummary :contract="contract" :handover="handover" :serverURL="serverURL"></OrderSummary>
          </div>
          <div v-show="active === 1">
            <Produce :contract="contract" :handover="handover" :serverURL="serverURL"></Produce>
          </div>
          <div v-show="active === 2">
            <Shipping :contract="contract" :shipping="handover.shipping"></Shipping>
          </div>
          <div v-show="active === 3">
            <Documents :contract="contract" :documents="handover.documents"></Documents>
          </div>
        </el-form>
        <div style="float:right;">
          <el-button ref="upButton" style="margin-top: 12px;" @click="up()" size="mini" :disabled="active === 0 ? true : false">上一步</el-button>
          <el-button ref="nextButton" style="margin-top: 12px;" @click="next()" size="mini" :disabled="active === 3 ? true : false">下一步</el-button>
          <el-button ref="createOrder" style="margin-top: 12px;" @click="submitHandover()" size="mini" :disabled="active === 3 ? false : true"
            >提交订单</el-button
          >
        </div>
      </el-col>
      <el-col :span="3">
        <el-steps :active="active" direction="vertical" :space="100" finish-status="success">
          <el-step title="步骤 1" description="订单信息"></el-step>
          <el-step title="步骤 2" description="生产信息"></el-step>
          <el-step title="步骤 3" description="海运信息"></el-step>
          <el-step title="步骤 4" description="单证信息"></el-step>
        </el-steps>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import OrderSummary from './OrderSummary.vue'
import Produce from './Produce.vue'
import Shipping from './Shipping.vue'
import Documents from './Documents.vue'
import OrderInfo from '../../OrderInfo'

export default {
  name: 'HandoverRoot',
  components: {
    // 交接单-订单信息
    OrderSummary,
    // 交接单-生产信息
    Produce,
    // 交接单-海运信息
    Shipping,
    // 交接单-单证信息
    Documents
  },
  props: {
    // 合同内容
    contract: {
      type: Object,
      required: true
    },
    // 交接单
    handover: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      // 激活步骤
      active: 0,
      // 上传文件serverURL
      serverURL: `${this.$http.defaults.baseURL}order/upload/v1`,
    }
  },
  methods: {
    // 上一步
    up() {
      console.log('up', this.active)
      this.active -= 1
      if (this.active < 0) this.active = 0
    },
    // 下一步
    next() {
      let validateFlag = true
      console.log('next', this.active)
      // 验证订单信息
      if (this.active === 0) {
        this.$refs.handoverFormRef.validateField(
          ['order.description', 'order.deliveryDate'],
          val => {
            if (val) {
              console.log('next: validateField', val)
              validateFlag = false
            }
          }
        )
      }
      // 生产包装验证
      if (this.active === 1) {
        this.$refs.handoverFormRef.validateField(
          ['produce.packaging'],
          val => {
            if (val) {
              console.log('next: validateField', val)
              validateFlag = false
            }
          }
        )
      }
      // 海运信息验证
      if (this.active === 2) {
        this.$refs.handoverFormRef.validateField(
          ['shipping.consignee', 'shipping.notify'],
          val => {
            if (val) {
              console.log('next: validateField', val)
              validateFlag = false
            }
          }
        )
      }
      // 单证信息验证
      if (this.active === 3) {
        this.$refs.handoverFormRef.validateField(
          ['documents.bill.address'],
          val => {
            if (val) {
              console.log('next: validateField', val)
              validateFlag = false
            }
          }
        )
      }
      if (validateFlag) {
        if (this.active < 3) this.active += 1
      }
      return validateFlag
    },
    // 提交交接单
    async submitHandover() {
      console.log('submitHandover')
      // 提交交接单之前先检查数据完整性
      if (!this.next()) { return this.$message({
        message: '信息填写不完整',
        type: 'warning'
      }) }
      // 判断是创建交接单，还是更新交接单
      console.log('orderStatus', this.contract.orderStatus)
      console.log('DRAFT', OrderInfo.OrderStatus.get('DRAFT'))
      if (this.contract.orderStatus === OrderInfo.OrderStatus.get('DRAFT')) {
        // 创建交接单
        // 更新订单状态,从草稿到货源
        this.contract.orderStatus = OrderInfo.OrderStatus.get('RUN-SUPPLY')
        // 交接单创建时间
        this.handover.handoverDate = this.$moment(new Date()).format('YYYY-MM-DD')
        // 交接单创建人
        this.handover.user = window.sessionStorage.getItem('user')

        const { data: res } = await this.$http.post('/handover/create/v1', { handover: this.handover, contract: this.contract })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
      } else {
        // 更新交接单
        const { data: res } = await this.$http.post('/handover/update/v1', { handover: this.handover })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
      }
      console.log('closed')
      this.$emit('handoverClosed')
    },
  },
  // 初始化
  created() {
  }
}
</script>

<style lang="less" scoped></style>
