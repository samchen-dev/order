<template>
  <div>
    <el-row :gutter="10" v-for="(item, index) in contract.offerSheet.products" :key="index">
      <el-col :span="21">
        <el-row>
          <el-col :span="12">
            <el-form-item class="offerSheet-el-form-item" label="产品" :prop="'offerSheet.products.' + index + '.name'">
              <el-input v-model="item.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="offerSheet-el-form-item" label="单位" :prop="'offerSheet.products.' + index + '.unit'">
              <el-select v-model="item.unit" allow-create filterable default-first-option placeholder="选择单位">
                <el-option label="MT" value="MT" selected></el-option>
                <el-option label="PCS" value="PCS"></el-option>
                <el-option label="KGS" value="KGS"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="offerSheet-el-form-item" label="金额" :prop="'offerSheet.products.' + index + '.amount'">
              <el-input-number v-model="item.amount" style="width:100%" :precision="2" :controls="false" :disabled="true"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-for="(quotation, cIndex) in item.quotations" :key="cIndex">
          <el-col :span="5">
            <el-form-item class="offerSheet-el-form-item" label="粒度" :prop="'offerSheet.products.' + index + '.quotations.' + cIndex + '.size'">
              <el-input v-model="quotation.size"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item class="offerSheet-el-form-item" label="数量" :prop="'offerSheet.products.' + index + '.quotations.' + cIndex + '.quantity'">
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
            <el-form-item class="offerSheet-el-form-item" label="单价" :prop="'offerSheet.products.' + index + '.quotations.' + cIndex + '.price'">
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
            <el-form-item class="offerSheet-el-form-item" label="金额" :prop="'offerSheet.products.' + index + '.quotations.' + cIndex + '.total'">
              <el-input-number style="width:100%" v-model="quotation.total" :precision="2" :disabled="true" :controls="false"></el-input-number>
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
    <el-row :gutter="10" v-for="(item, index) in contract.offerSheet.attachs" :key="index">
      <el-col :span="21">
        <el-row>
          <el-col :span="18">
            <el-form-item class="offerSheet-el-form-item" label="附加" :prop="'offerSheet.attachs.' + index + '.title'">
              <el-input v-model="item.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="offerSheet-el-form-item" label="金额" :prop="'offerSheet.attachs.' + index + '.amount'">
              <el-input-number style="width:100%" v-model="item.amount" :precision="2" controls-position="right" :controls="false"></el-input-number>
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
                <span>USD {{ contract.offerSheet.sum }}</span>
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
</template>

<script>
import XEUtils from 'xe-utils'

export default {
  name: 'OneForm',
  props: {
    contract: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
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
          countStr += item[1] + ' ' + item[0] + ' '
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

.offerSheet-el-form-item {
  margin-bottom: 8px;
}
</style>
