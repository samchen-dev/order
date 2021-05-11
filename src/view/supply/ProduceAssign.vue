<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="生产安排">
        <div>
          <el-row>
            <el-col :span='21'>
              <el-form ref="makeFormRef" :model="make" label-width="60px" size="mini" v-if="renderFlag">
                <div v-if="active === 0">
                  <PF :contract="contract" :make="make" v-if="renderFlag"></PF>
                </div>
                <div v-if="active === 1">
                  <PP :contract="contract" :make="make" v-if="renderFlag"></PP>
                </div>
                <div v-if="active === 2">
                  <PM :contract="contract" :handover="handover" :make="make" v-if="renderFlag"></PM>
                </div>
                <div v-if="active === 3">
                  <Preview :contract="contract" :handover="handover" :make="make" v-if="renderFlag"></Preview>
                </div>
              </el-form>
              <div style="float: right;">
                <el-button
                  ref="upButton"
                  @click="up()"
                  style="margin-top: 12px;"
                  size="mini"
                  :disabled="this.active === 0 ? true : false"
                >上一步
                </el-button>
                <el-button
                  ref="nextButton"
                  @click="next()"
                  style="margin-top: 12px;"
                  size="mini"
                  :disabled="this.active === 3 ? true : false"
                >下一步</el-button>
                <el-button
                  ref="createOrder"
                  @click="submitMark()"
                  style="margin-top: 12px;"
                  size="mini" :disabled="this.active === 3 ? false : true"
                >提交订单</el-button>
              </div>
            </el-col>
            <el-col :span="3">
              <el-steps :active="active" direction="vertical" :space="100" finish-status="success">
                <el-step title="步骤 1" description="产品分配"></el-step>
                <el-step title="步骤 2" description="设置价格"></el-step>
                <el-step title="步骤 3" description="唛头交期"></el-step>
                <el-step title="步骤 4" description="订单预览"></el-step>
              </el-steps>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="工厂采购预览">
        <PPA :contract="contract" :handover="handover" :make="make" v-if="renderFlag"></PPA>
      </el-tab-pane> -->
      <el-tab-pane label="合同预览">
        <CP :contract="contract" v-if="renderFlag"></CP>
      </el-tab-pane>
      <el-tab-pane label="发票预览">
        <IP :contract="contract" v-if="renderFlag"></IP>
      </el-tab-pane>
      <el-tab-pane label="交接单预览">
        <HP :contract="contract" :handover="handover" v-if="renderFlag"></HP>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import CP from '../form/wizard/ContractPreview.vue'
import IP from '../form/wizard/InvoicePreview.vue'
import HP from '../form/wizard/handover/HandoverPreview.vue'
import PF from './ProduceFactory.vue'
import PP from './ProducePrice.vue'
import PM from './ProduceMark.vue'
import Preview from './Preview.vue'

export default {
  name: 'ProduceAssign',
  components: {
    CP,
    IP,
    HP,
    PF,
    PP,
    PM,
    Preview,
  },
  props: {
    orderID: {
      type: String
    }
  },
  data() {
    return {
      // active步骤控制标记
      active: 0,
      // 订单
      contract: null,
      // 交接单
      handover: null,
      // 子组件渲染标记
      renderFlag: false,
      // 工厂编号
      factoryIndex: 0,
      // 生产安排
      make: {
        current: {
          // 采购合同的创建人
          user: window.sessionStorage.getItem('user'),
          // 订单ID
          contractID: '',
          // 采购合同编号
          orderID: '',
          // 签单日期
          signingDate: '',
          // 采购方名称
          purchaser: '华友矿产有限公司',
          // 工厂名称
          factoryName: '',
          // 货币类型
          currencyType: 'RMB',
          // 采购总金额
          purchaseAmount: 0.00,
          // 交货期 一般比预计交期早7天
          deliveryDate: '',
          // 付款方式
          paymentMethod: {
            // 付款类型
            genre: '月结',
            // 付款描述
            description: '',
          },
          // 价格是否包含运输（出厂价、到港价）
          roadTransport: '出厂价',
          // 起运港
          loading: '',
          // 唛头
          markInfo: [
          ]
        },
        // contract 中关于订单
        source: {
          offerSheet: null
        },
        original: {
          offerSheet: null
        },
        target: {
          offerSheet: {
            products: []
          }
        },
        factory: [
        ]
      }
    }
  },
  methods: {
    // 更具orderID参数加载内容
    async loadOrderAndHandover() {
      console.log('loadOrderAndHandover')
      if (!this.orderID) return this.$message.error('缺少必要参数orderID,无法执行生产安排！')
      const { data: res } = await this.$http.get('/order/getOrder/v1', {
        params: {
          orderID: this.orderID
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.contract = res.data.order
      this.contract.orderDate = this.$XEUtils.toDateString(this.contract.orderDate, 'yyyy-MM-dd')
      this.handover = res.data.handover
      this.handover.handoverDate = this.$XEUtils.toDateString(this.handover.handoverDate, 'yyyy-MM-dd')
      this.handover.order.deliveryDate = this.$XEUtils.toDateString(this.handover.order.deliveryDate, 'yyyy-MM-dd')

      // 关联订单
      this.make.current.contractID = this.contract.orderID

      // 拷贝订单细节
      this.make.source.offerSheet = JSON.parse(JSON.stringify(this.contract.offerSheet))
      this.make.original.offerSheet = JSON.parse(JSON.stringify(this.contract.offerSheet))
      this.make.current.orderID = this.contract.orderID
      this.make.current.signingDate = this.$XEUtils.toDateString(new Date(), 'yyyy-MM-dd')
      // 比交接单的交期提前一周
      this.make.current.deliveryDate = this.$moment(this.handover.order.deliveryDate).subtract(7, 'days').format('YYYY-MM-DD')
      // 开始渲染子组件
      this.renderFlag = true
    },
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
      const sizeMap = new Map()
      // eslint-disable-next-line default-case
      switch (this.active) {
        case 0:
          // 生产商信息
          console.log('生产商信息')
          this.$refs.makeFormRef.validateField(
            ['current.orderID', 'current.purchaser', 'current.signingDate', 'current.factoryName'],
            val => {
              console.log(val)
              if (val) flag = false
            }
          )
          if (flag) {
            if (this.make.target.offerSheet.products.length === 0) {
              this.$message({
                message: `没有给${this.make.current.factoryName}分配订单`, type: 'warning'
              })
            } else {
              this.active += 1
            }
          }
          break
        case 1:
          // 数量分配
          console.log('数量分配')
          this.make.target.offerSheet.products.forEach((product, index) => {
            this.$refs.makeFormRef.validateField([`target.offerSheet.products.${index}.chineseName`], val => {
              if (val) {
                console.log(val)
                flag = false
              }
            })
            const sizeArray = []
            for (const quotation of product.quotations) {
              console.log(quotation.purchasing)
              if (quotation.purchasing === 0) {
                sizeArray.push(quotation.size)
              }
            }
            if (sizeArray.length > 0) sizeMap.set(product.name, sizeArray)
          })
          if (!flag || sizeMap.size > 0) {
            for (const item of sizeMap.entries()) {
              setTimeout(() => {
                this.$message({
                  message: `${item[0]}的这些粒度没有设置单价：${item[1].join(',')}`,
                  type: 'warning'
                })
              }, 50)
            }
          } else {
            this.active += 1
          }
          break
        case 2:
          // 价格信息
          console.log('价格信息')
          this.$refs.makeFormRef.validateField(
            ['current.deliveryDate', 'current.paymentMethod.description'],
            val => {
              console.log(this.make.current.deliveryDate)
              if (val) {
                console.log(val)
                flag = false
              }
            }
          )
          if (flag) this.active += 1
          break
        case 3:
          // 提交订单
          console.log('提交订单')
          break
      }
      return flag
    },
    // 创建采购合同
    async submitMark() {
      console.log('submitMark')
      const { data: res } = await this.$http.post('/make/create/v1', { make: this.make.current })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.$emit('supplyAgentClosed')
    }
  },
  created() {
    console.log('created')
    // 加载订单、交接单变量内容
    this.loadOrderAndHandover()

    this.make.factory[this.factoryIndex] = this.make.current
    this.make.factory[this.factoryIndex].target = this.make.target
  }
}
</script>
<style lang="less" scoped>
.bg-purple-dark {
  min-height: 28px;
}

.offerSheet-el-form-item {
  margin-bottom: 5px;
}

.box-card {
  font-size: 14px;

  .el-card__header {
    padding: 14px 14px !important;
  }
  .el-card__body {
    padding-top: 10px !important;
  }
}
.product-div {
  padding-bottom: 5px;
}
</style>
