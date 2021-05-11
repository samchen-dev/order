<template>
  <div>
    <el-row :gutter="10" v-for="(product, index) in make.target.offerSheet.products" :key="index">
      <el-col :span="24">
        <el-row>
          <el-col :span="8">
            <div class="product-div">
              名称：<span v-text="product.name"></span>
            </div>
          </el-col>
          <el-col :span="5">
            单位：<span v-text="getUnit(product.unit)"></span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="产品中文:"
              label-width="80px"
              :prop="'target.offerSheet.products.' + index + '.chineseName'"
              :rules="[
                { required: true, message: '产品中文名称不能为空' },
              ]"
            >
              <el-input v-model="product.chineseName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品指标:" label-width="80px">
              <el-input v-model="product.norm" type="textarea" :rows="2" placeholder="产品技术指标"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-for="(quotation, cIndex) in product.quotations" :key="cIndex">
           <el-col :span="4">
              <el-form-item label="粒度:" class="offerSheet-el-form-item">
                <span v-text="quotation.size" class="size__text"></span>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="数量:" class="offerSheet-el-form-item">
                <span v-text="quotation.quantity + getUnit(product.unit)" class="size_text"></span>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label-width="80px" :label="currencyType" class="offerSheet-el-form-item">
                <el-input-number
                  style="width:90%"
                  :controls="false"
                  v-model="quotation.purchasing"
                  :precision="2"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label-width="80px" :label="totalCurrencyType" class="offerSheet-el-form-item">
                <el-input-number
                  style="width:100%"
                  :controls="false"
                  v-model="quotation.purchasePrice"
                  :precision="2"
                  :disabled="true"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="描述:" class="offerSheet-el-form-item">
                <el-input v-model="quotation.norm"></el-input>
              </el-form-item>
            </el-col>
        </el-row>
        <el-divider content-position="left" v-if="index < make.target.offerSheet.products.length - 1 ">产品</el-divider>
      </el-col>
    </el-row>
    <el-divider content-position="left">共计</el-divider>
    <el-row>
      <el-col :span="4">
        <span style="min-height:1px; padding-left: 5px;"></span>
      </el-col>
      <el-col :span="3">
        <el-form-item label="总量:" class="offerSheet-el-form-item">
          <span v-text="make.target.offerSheet.count" class="size__text"></span>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <span style="min-height:1px; padding-left: 5px;"></span>
      </el-col>
      <el-col :span="5">
        <el-form-item label-width="80px" :label="totalCurrencyType" class="offerSheet-el-form-item">
          <el-input-number
            style="width:100%"
            :controls="false"
            v-model="make.target.offerSheet.productPurchasing"
            :precision="2"
            :disabled="true"
          >
          </el-input-number>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import OrderInfo from '../form/OrderInfo'

export default {
  name: 'ProducePrice',
  props: {
    contract: {
      type: Object,
      required: true
    },
    make: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
    // 获取订单产品的单位中文
    getUnit(key) {
      console.log('getUnit')
      return OrderInfo.UnitInfo.get(key)
    },
    // 计算产品采购价格
    quotationPurchasing(quotations) {
      console.log('quotationSum', quotations)
      let purchasePrice = 0.00
      for (const quotation of quotations) {
        quotation.purchasePrice = quotation.purchasing * quotation.quantity
        purchasePrice += quotation.purchasePrice
      }
      return purchasePrice
    },
    // 计算给工厂的采购总价格
    productPurchasing() {
      console.log('productSum')
      let purchasePrice = 0.00
      const { products } = this.make.target.offerSheet
      for (const product of products) {
        const { quotations } = product
        const purchasing = this.quotationPurchasing(quotations)
        product.purchasePrice = purchasing
        purchasePrice += purchasing
      }
      return purchasePrice
    },
  },
  computed: {
    currencyType() {
      return `单价:${this.make.current.currencyType}`
    },
    totalCurrencyType() {
      return `总价:${this.make.current.currencyType}`
    }
  },
  watch: {
    // 监听工厂采购金额的变化
    'make.target.offerSheet': {
      handler() {
        console.log('watch-make.target.offerSheet')
        this.make.target.offerSheet.productPurchasing = this.productPurchasing()
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
.box-card {
  font-size: 14px;
}
&/deep/.el-card__header {
  padding: 5px 5px !important;
}
&/deep/.el-card__body {
  padding-top: 10px;
  padding-left: 8px;
  padding-right: 8px;
}
.product-div {
  padding-bottom: 5px;
}
.offerSheet-el-form-item {
  margin-bottom: 5px;
}
&/deep/.el-form-item__label {
  font-size: 10px;
}
&/deep/.size__text {
  font-size: 10px;
}
</style>
