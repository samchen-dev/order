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
              <el-row>
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
              <hr />
              <el-row>
                <el-col :span="6">
                  <div>卖方</div>
                  <el-radio-group v-model="sellerType" type="vertical" @change="sellerChange">
                    <el-radio :label="0">HK</el-radio>
                    <el-radio :label="1">ZH</el-radio>
                    <el-radio :label="2">其它</el-radio>
                  </el-radio-group>
                </el-col>
                <el-col :span="18">
                  <el-form-item label="卖方名称" prop="seller">
                    <el-input placeholder="公司名称" v-model="contract.seller"></el-input>
                  </el-form-item>
                  <el-form-item label="卖方地址" prop="seller">
                    <el-input placeholder="公司地址" v-model="contract.seller" type="textarea" :rows="3"></el-input>
                  </el-form-item>
                  <el-form-item label="卖方银行" prop="seller">
                    <el-input placeholder="银行信息" v-model="contract.seller" type="textarea" :rows="2"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <hr />
              <el-row>
                <el-col :span="6">
                  <div>买方</div>
                </el-col>
                <el-col :span="18">
                  <el-form-item label="买方名称" prop="seller">
                    <el-input placeholder="买方名称" v-model="contract.seller"></el-input>
                  </el-form-item>
                  <el-form-item label="买方地址" prop="seller">
                    <el-input placeholder="买方地址" v-model="contract.seller" type="textarea" :rows="2"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <!-- 产品报价 -->
            <div v-else-if="active === 1">
              <el-row :gutter="10" v-for="(product, index) in contract.offerSheet.products" :key="index">
                <el-col :span="21">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="产品:" :prop="'product.' + index + '.name'">
                        <el-input v-model="product.name"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="单位:" :prop="'product.' + index + '.unit'">
                        <el-select v-model="product.unit" allow-create filterable default-first-option placeholder="选择单位">
                          <el-option label="MT" value="MT" selected></el-option>
                          <el-option label="PCS" value="PCS"></el-option>
                          <el-option label="KGS" value="KGS"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="金额:" :prop="'product.' + index + '.amount'">
                        <el-input-number
                          v-model="product.amount"
                          style="width:100%"
                          :precision="2"
                          :controls="false"
                          :disabled="true"
                        ></el-input-number>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-for="(quotation, cIndex) in product.quotations" :key="cIndex">
                    <el-col :span="5">
                      <el-form-item label="粒度:" :prop="'quotation.' + cIndex + '.size'">
                        <el-input v-model="quotation.size"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item label="数量:" :prop="'quotation.' + cIndex + '.quantity'">
                        <el-input-number
                          style="width:100%"
                          v-model="quotation.quantity"
                          :precision="3"
                          controls-position="right"
                          :controls="false"
                        ></el-input-number>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item label="单价:" :prop="'quotation.' + cIndex + '.price'">
                        <el-input-number
                          style="width:100%"
                          v-model="quotation.price"
                          :precision="2"
                          controls-position="right"
                          :controls="false"
                        ></el-input-number>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item label="金额:" :prop="'quotation.' + cIndex + '.total'">
                        <el-input-number
                          style="width:100%"
                          v-model="quotation.total"
                          :precision="2"
                          :disabled="true"
                          :controls="false"
                        ></el-input-number>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4" style="text-align:right">
                      <el-button-group>
                        <el-button icon="el-icon-plus" @click="addQuotation(index, cIndex)" size="mini"></el-button>
                        <el-button icon="el-icon-minus" @click="delQuotation(index, cIndex)" size="mini"></el-button>
                      </el-button-group>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="3">
                  <el-button-group>
                    <el-button type="primary" icon="el-icon-plus" @click="addQuotation(index, 0)" size="mini"></el-button>
                    <el-button type="primary" icon="el-icon-minus" @click="delProduct(index)" size="mini"></el-button>
                  </el-button-group>
                </el-col>
              </el-row>
              <el-row :gutter="10" v-for="(attach, index) in contract.offerSheet.attachs">
                <el-col :span="21">
                  <el-row>
                    <el-col :span="18">
                      <el-form-item label="附加:" :prop="'attach.' + index + '.title'">
                        <el-input v-model="attach.title"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="金额:" :prop="'attach.' + index + '.amount'">
                        <el-input-number
                          style="width:100%"
                          v-model="attach.amount"
                          :precision="2"
                          controls-position="right"
                          :controls="false"
                        ></el-input-number>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="3">
                  <el-button type="primary" icon="el-icon-minus" @click="delAttach(index)" size="mini"></el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="5"><div class="bg-purple-dark"></div></el-col>
                    <el-col :span="13">
                      <div class="bg-purple-dark">
                        <el-form-item label="总量:">
                          <span>{{ contract.offerSheet.count }}</span>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="bg-purple-dark">
                        <el-form-item label="共计:">
                          <span>{{ contract.offerSheet.sum }}</span>
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="3">
                  <div class="bg-purple-dark"></div>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="24">
                  <el-button-group>
                    <el-button type="primary" @click="addProduct()" size="mini">添加产品</el-button>
                    <el-button type="primary" @click="addAttach()" size="mini">添加条款</el-button>
                  </el-button-group>
                </el-col>
              </el-row>
            </div>
            <div v-else-if="active === 2">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="包装:" :prop="packaging">
                    <el-select v-model="contract.packaging" allow-create filterable default-first-option placeholder="选择包装" style="width:100%">
                      <el-option label="IN 25KG PP BAGS ON PALLET" value="IN 25KG PP BAGS ON PALLET" selected></el-option>
                      <el-option label="IN 55LB PAPER BAG*40 BAGS ON ONE PALLET" value="IN 55LB PAPER BAG*40 BAGS ON ONE PALLET"></el-option>
                      <el-option label="IN 1MT BIG BAGS" value="IN 1MT BIG BAGS"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="起运:" :prop="loading">
                    <el-select v-model="contract.loading" allow-create filterable default-first-option placeholder="起运港" style="width:100%">
                      <el-option label="XINGANG, CHINA" value="XINGANG, CHINA" selected></el-option>
                      <el-option label="QINGDAO, CHINA" value="QINGDAO, CHINA"></el-option>
                      <el-option label="SHANGHAI, CHINA" value="SHANGHAI, CHINA"></el-option>
                      <el-option label="XINGANG, CHINA / QINGDAO, CHINA" value="XINGANG, CHINA / QINGDAO, CHINA"></el-option>
                      <el-option label="ANY PORT IN CHINA" value="ANY PORT IN CHINA"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="目的:" :prop="destination">
                    <el-input v-model="contract.destination" placeholder="目的港"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="付款:" :prop="paymentType">
                    <el-radio-group v-model="contract.paymentType">
                      <el-radio :label="0">T/T</el-radio>
                      <el-radio :label="1">D/A</el-radio>
                      <el-radio :label="3">D/P</el-radio>
                      <el-radio :label="4">LC</el-radio>
                      <el-radio :label="5">其它</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="条款:" :prop="payment">
                    <el-input v-model="contract.payment"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="交货:" :prop="locationsType">
                    <el-radio-group v-model="contract.locationsType">
                      <el-radio :label="0">CIF</el-radio>
                      <el-radio :label="1">FOB</el-radio>
                      <el-radio :label="3">DDU</el-radio>
                      <el-radio :label="4">DDP</el-radio>
                      <el-radio :label="3">CFR</el-radio>
                      <el-radio :label="5">FDA</el-radio>
                      <el-radio :label="6">其它</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="条款:" :prop="locations">
                    <el-input v-model="contract.locations"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div v-else-if="active === 3">
              交易条款
            </div>
            <div v-else-if="active === 4">
              完成！
            </div>
          </el-form>
          <el-button style="margin-top: 12px;" @click="up()" size="mini">上一步</el-button>
          <el-button style="margin-top: 12px;" @click="next()" size="mini">下一步</el-button>
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
          locations: '',
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
</style>
