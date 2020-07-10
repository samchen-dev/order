<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>创建订单</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片显示区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="21">
          <el-form ref="form" :model="contract" label-width="50px" size="mini">
            <!-- 公司信息 -->
            <div v-if="active === 0">
              <el-row :gutter="10">
                <el-col :span="6">
                  <el-form-item label="编号">
                    <el-input placeholder="合同编号(SBM开头)" v-model="contract.orderID"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="PO">
                    <el-input placeholder="客户PO编号" v-model="contract.PO"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="日期">
                    <el-date-picker
                      v-model="contract.orderDate"
                      align="right"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="pickerOptions"
                      size="mini"
                      style="width:100%"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="地点">
                    <el-input v-model="contract.place"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="24"> </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <span>卖方</span>
                      <el-radio-group style="float: right;" v-model="sellerType" type="vertical" @change="sellerChange">
                        <el-radio :label="0">HK</el-radio>
                        <el-radio :label="1">ZH</el-radio>
                        <el-radio :label="2">其它</el-radio>
                      </el-radio-group>
                    </div>
                    <el-form-item label="名称" prop="seller">
                      <el-input placeholder="公司名称" v-model="contract.seller"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="seller">
                      <el-input placeholder="公司地址" v-model="contract.seller" type="textarea" :rows="2"></el-input>
                    </el-form-item>
                    <el-form-item label="银行" prop="seller">
                      <el-input placeholder="银行信息" v-model="contract.seller" type="textarea" :rows="2"></el-input>
                    </el-form-item>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <span>买方</span>
                    </div>
                    <el-form-item label="名称" prop="seller">
                      <el-input placeholder="名称" v-model="contract.seller"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="seller">
                      <el-input placeholder="买方地址" v-model="contract.seller" type="textarea" :rows="2"></el-input>
                    </el-form-item>
                  </el-card>
                </el-col>
              </el-row>
            </div>
            <!-- 产品报价 -->
            <div v-else-if="active === 1"></div>
            <div v-else-if="active === 2"></div>
            <div v-else-if="active === 3">
              交易条款
            </div>
            <div v-else-if="active === 4">
              完成！
            </div>
          </el-form>
          <div style="float: right;">
            <el-button style="margin-top: 12px;" @click="up()" size="mini">上一步</el-button>
            <el-button style="margin-top: 12px;" @click="next()" size="mini">下一步</el-button>
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
    </el-card>
  </div>
</template>

<script>
import XEUtils from 'xe-utils'
export default {
  name: 'orderWizard',
  data() {
    return {
      // 日期快捷键
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      // 激活步骤
      active: 0,
      // 公司类型
      sellerType: 0,
      // 订单
      contract: {
        // 公司名称
        seller: '',
        // 公司地址
        sellerAddress: '',
        // 客户名称
        buyer: '',
        //  客户地址
        buyerAddress: '',
        // 合同创建时间
        orderDate: '',
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
            {
              title: '',
              amount: 0
            }
          ],
          // 共计数量
          count: '',
          // 共计金额
          sum: 0,
          // 包装
          packaging: 'IN 25KG PP BAGS ON PALLET',
          // 起运港
          loading: 'XINGANG, CHINA',
          destination: '',
          // 付款类型
          paymentType: 0,
          // 付款明细
          payment: '',
          // 交货类型
          locationsType: 0,
          // 交货地点
          locations: ''
        }
      }
    }
  },
  methods: {
    // 上一步
    up() {
      console.log('up', this.active)
      --this.active
      if (this.active < 0) this.active = 0
    },
    // 下一步
    next() {
      console.log('nexe:', this.active)
      if (this.active++ > 3) this.active = 0
    },
    // 改变卖方类型
    sellerChange(val) {
      console.log('sellerChange', val)
    },
    // 添加产品
    addProduct() {
      console.log('addProduct')
      this.contract.offerSheet.products.push({ name: '', amount: 0, unit: 'MT', quotations: [] })
    },
    // 删除产品
    delProduct(index) {
      console.log('delProduct')
      this.contract.offerSheet.products.splice(index, 1)
    },
    // 添加报价
    addQuotation(index, cIndex) {
      console.log('addQuotation')
      if (cIndex === 0) {
        this.contract.offerSheet.products[index].quotations.push({ size: '', quantity: 0, price: 0, total: 0 })
      } else {
        this.contract.offerSheet.products[index].quotations.splice(cIndex + 1, 0, { size: '', quantity: 0, price: 0, total: 0 })
      }
    },
    // 删除报价
    delQuotation(index, cIndex) {
      console.log('delQuotation')
      this.contract.offerSheet.products[index].quotations.splice(cIndex, 1)
    },
    // 添加附加条款
    addAttach() {
      console.log('addAttach')
      this.contract.offerSheet.attachs.push({ title: '', amount: 0 })
    },
    // 删除附加条款
    delAttach(index) {
      console.log('delAttach')
      this.contract.offerSheet.attachs.splice(index, 1)
    },
    // 计算产品总价
    productsSum(quotations) {
      console.log('productsSum')
      let count = 0
      let amount = 0
      for (const quotation of quotations) {
        // 计算价格
        const { quantity, price } = quotation
        quotation.total = Math.round(XEUtils.multiply(quantity, price) * 100) / 100
        amount = XEUtils.add(amount, quotation.total)
        count += quantity
      }
      return { amount, count }
    },
    // 合同总价总价
    contractSum() {
      console.log('contractSum')
      const { products, attachs } = this.contract.offerSheet
      let sum = 0.0
      const countMap = new Map()
      // 产品价格
      for (const product of products) {
        const { quotations } = product
        const { amount, count } = this.productsSum(quotations)
        product.amount = amount
        product.count = count
        sum = XEUtils.add(sum, product.amount)
        if (countMap.get(product.unit)) {
          countMap.set(product.unit, countMap.get(product.unit) + count)
        } else {
          countMap.set(product.unit, count)
        }
      }
      // 附加条款价格
      for (const attach of attachs) {
        const { amount } = attach
        sum = XEUtils.add(sum, amount)
      }
      return { sum, countMap }
    }
  },
  mounted() {
    // 创建订单的默认日期
    this.contract.orderDate = XEUtils.toDateString(new Date(), 'yyyy-MM-dd')
  },
  // 监听
  watch: {
    // 监听合同产品报价的变化，计算总价等信息
    'contract.offerSheet': {
      handler() {
        console.log('watch-contract.offerSheet')
        // 计算合同总价
        const { sum, countMap } = this.contractSum()
        this.contract.offerSheet.sum = sum
        // 计算合同总数量
        let countStr = ''
        for (const item of countMap.entries()) {
          countStr += item[0] + ':' + item[1] + ' '
        }
        this.contract.offerSheet.count = countStr
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.bg-purple-dark {
  min-height: 28px;
}

.box-card {
  font-size: 14px;

  .el-card__header {
    padding: 14px 14px !important;
  }
}
</style>
