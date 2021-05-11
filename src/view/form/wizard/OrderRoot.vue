<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="21">
        <el-form ref="contractFormRef" :model="contract" label-width="50px" size="mini">
          <!-- 公司信息 -->
          <div v-show="active === 0">
            <zero v-bind:contract="contract" v-bind:openType="openType"></zero>
          </div>
          <!-- 产品报价 -->
          <div v-show="active === 1">
            <One v-bind:contract="contract"></One>
          </div>
          <div v-show="active === 2">
            <Two v-bind:contract="contract"></Two>
          </div>
          <!-- 预览合同和发票 -->
          <div id="preview" v-show="active === 3" class="preview-div">
            <Three v-bind:contract="contract"></Three>
          </div>
        </el-form>
        <div style="float: right;">
          <el-button
            ref="upButton"
            style="margin-top: 12px;"
            @click="up()" size="mini"
            :disabled="this.active === 0 ? true : false"
          >上一步</el-button>
          <el-button
            ref="nextButton"
            style="margin-top: 12px;"
            @click="next()" size="mini"
            :disabled="this.active === 3 ? true : false"
          >下一步</el-button>
          <el-button
            ref="createOrder"
            style="margin-top: 12px;"
            @click="createUpdateOrder()"
            size="mini" :disabled="this.active === 3 ? false : true"
          >提交订单</el-button>
        </div>
      </el-col>
      <el-col :span="3">
        <el-steps :active="active" direction="vertical" :space="100" finish-status="success">
          <el-step title="步骤 1" description="公司信息"></el-step>
          <el-step title="步骤 2" description="产品价格"></el-step>
          <el-step title="步骤 3" description="交易条款"></el-step>
          <el-step title="步骤 4" description="合同预览"></el-step>
        </el-steps>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Zero from './ZeroForm.vue'
import One from './OneForm.vue'
import Two from './TwoForm.vue'
import Three from './ThreeForm.vue'
import OrderInfo from '../OrderInfo'

export default {
  name: 'OrderRoot',
  // 注册子组件
  components: {
    Zero,
    One,
    Two,
    Three
  },
  props: {
    orderID: {
      type: String
    },
    openType: {
      type: String,
      default: 'new'
    }
  },
  data() {
    return {
      // 激活步骤
      active: 0,
      // 订单
      contract: {
        // 用户ID
        userID: window.sessionStorage.getItem('userID'),
        // 合同编号
        orderID: '',
        // 客户PO编号
        PO: '',
        // 合同创建时间
        orderDate: '',
        // 地点
        location: 'ZHENGZHOU,CHINA',
        // 公司类型
        sellerType: 0,
        // 公司名称
        seller: '',
        // 公司地址
        sellerAddress: '',
        // 公司电话
        sellerTEL: '0086-371-55698532',
        // 公司传真
        sellerFAX: '0086-371-60153476',
        // 订单状态,草稿状态
        orderStatus: OrderInfo.OrderStatus.get('DRAFT'),
        // 银行信息
        bank: '',
        // 客户名称
        buyer: '',
        //  客户地址
        buyerAddress: '',
        // 客户电话
        buyerTEL: '',
        // 客户传真
        buyerFAX: '',
        // 报价单
        offerSheet: {
          // 产品
          products: [
            {
              // 产品名称
              name: '',
              // 该产品合计价格
              amount: 0,
              // 产品的单位（MT/PCS）
              unit: 'MT',
              // 该产品数量
              count: 0,
              // 该产品的粒度/数量/单价/单行合计价格
              quotations: []
            }
          ],
          // 附加协议
          attachs: [
            // {
            //   title: '',
            //   amount: 0
            // }
          ],
          // 共计数量
          count: '',
          // 共计金额
          sum: 0
        },
        // 包装
        packaging: '',
        // 起运港
        loading: '',
        // 目的港
        destination: '',
        // 付款类型
        paymentType: 'T/T',
        // 付款明细
        payment: '',
        // 交货类型
        locationsType: 'FOB',
        // 交货地点
        locations: ''
      }
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
      console.log('nexe:', this.active)
      // 验证标记
      let flag = true
      // eslint-disable-next-line default-case
      switch (this.active) {
        case 0:
          // 验证公司信息
          console.log('验证公司信息')
          this.$refs.contractFormRef.validateField(
            ['orderID', 'orderDate', 'location', 'seller', 'sellerAddress', 'bank', 'buyer', 'buyerAddress'],
            val => {
              if (val) {
                flag = false
              }
            }
          )
          if (flag) this.active += 1
          break
        case 1:
          // 验证产品价格
          console.log('验证产品价格')
          if (flag) this.active += 1
          break
        case 2:
          // 验证交易条款
          console.log('验证交易条款')
          this.$refs.contractFormRef.validateField(['packaging', 'loading', 'destination'], val => {
            if (val) {
              console.log(val)
              flag = false
            }
          })
          if (flag) this.active += 1
          break
        case 3:
          // 验证预览
          console.log('验证预览')
          break
      }
      return flag
    },
    // 创建、更新订单
    async createUpdateOrder() {
      console.log('createUpdateOrder')
      if (!this.next()) return
      // 判断是创建订单、还是更新订单
      if (this.openType === 'new') {
        // 创建新订单
        const { data: res } = await this.$http.post('/order/create/v1', { order: this.contract })
        console.log('res.meta.status:', res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        const { order } = res.data
        order.orderDate = this.$XEUtils.toDateString(order.orderDate, 'yyyy-MM-dd')
        this.contract = order
        // 跳转到个人订单列表
        this.$router.replace('/orderexpert')
      } else if (this.openType === 'update') {
        const { data: res } = await this.$http.post('/order/update/v1', { order: this.contract })
        console.log('res.meta.status:', res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        const { order } = res.data
        // 日期格式化
        order.orderDate = this.$XEUtils.toDateString(order.orderDate, 'yyyy-MM-dd')
        this.contract = order
        this.$emit('closed')
      } else if (this.openType === 'clone') {
        // 根据现有订单生成新订单
        // 新生成的订单的状态为草稿
        this.contract.orderStatus = OrderInfo.OrderStatus.get('DRAFT')
        const { data: res } = await this.$http.post('/order/create/v1', { order: this.contract })
        console.log('res.meta.status:', res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        const { order } = res.data
        order.orderDate = this.$XEUtils.toDateString(order.orderDate, 'yyyy-MM-dd')
        this.contract = order
        this.$emit('closed')
      }
    },
    // 在更改订单、复制订单的时候加载订单数据
    async loadOrder() {
      // 更新订单
      console.log('loadOrder')
      console.log('openType:', this.openType)
      if (this.openType === 'new') return
      if (!this.orderID) return this.$message.error('缺少必要参数orderID,无法更新订单！')
      const { data: res } = await this.$http.get('/order/getOrder/v1', {
        params: {
          orderID: this.orderID
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.contract = res.data.order
      if (this.openType === 'clone') {
        delete this.contract._id
        this.contract.orderID = ''
        // 克隆新订单的时候，日期设置为当前日期
        this.contract.orderDate = this.$XEUtils.toDateString(new Date(), 'yyyy-MM-dd')
      }
      this.contract.orderDate = this.$XEUtils.toDateString(this.contract.orderDate, 'yyyy-MM-dd')
    }
  },
  // 初始化
  created() {
    // 加载订单数据
    this.loadOrder()
  }
}
</script>
