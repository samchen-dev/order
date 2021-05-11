<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="14">
        <el-form-item
          label="包装"
          prop="packaging"
          :rules="[{ required: true, message: '请选择合适的包装类型！'}]">
          <el-autocomplete
            v-model="contract.packaging"
            :fetch-suggestions="packagQuerySearch"
            placeholder="输入包装"
            @select="packagHandleSelect"
            style="width:100%">
          </el-autocomplete>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label-width="0px">(如果没有合适的包装列表，请自己填写)</el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="起运" prop="loading" :rules="[{ required: true, message: '请选择合适的起运港！'}]">
          <el-select v-model="contract.loading" allow-create filterable default-first-option placeholder="起运港" style="width:100%">
            <el-option
              v-for="item of loading.entries()"
              :key="item[0]"
              :label="item[0]"
              :value="item[0]">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="目的" prop="destination" :rules="[{ required: true, message: '请填写目的港！', trigger: 'blur' }]">
          <el-input v-model="contract.destination" placeholder="目的港"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>交货方式</span>
          </div>
          <div class="div-radio-group">
            <el-radio-group v-model="contract.locationsType" @change="locationsChange">
              <el-radio label="FOB">FOB</el-radio>
              <el-radio label="CIF">CIF</el-radio>
              <el-radio label="DDU">CFR</el-radio>
              <el-radio label="DDP">DDU</el-radio>
              <el-radio label="CFR">DDP</el-radio>
              <el-radio label="FDA">FDA</el-radio>
              <el-radio label="OTHER">OTHER</el-radio>
            </el-radio-group>
          </div>
          <el-form-item label="条款" prop="locations">
            <el-input v-model="contract.locations" type="textarea" :rows="3"></el-input>
          </el-form-item>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>付款方式</span>
          </div>
          <div class="div-radio-group">
            <el-radio-group v-model="contract.paymentType" @change="paymentChange">
              <el-radio label="T/T">T/T</el-radio>
              <el-radio label="D/A">D/A</el-radio>
              <el-radio label="D/P">D/P</el-radio>
              <el-radio label="LC">LC</el-radio>
              <el-radio label="OTHER">OTHER</el-radio>
            </el-radio-group>
          </div>
          <el-form-item label="条款:" prop="payment">
            <el-input v-model="contract.payment" type="textarea" :rows="3"></el-input>
          </el-form-item>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import OrderInfo from '../OrderInfo'

export default {
  name: 'TwoForm',
  props: {
    contract: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 包装列表
      packagingAll: [],
      // 港口列表
      loading: null,
    }
  },
  methods: {
    // 包装查询
    packagQuerySearch(queryString, cb) {
      console.log('packagquerySearch', queryString)
      const packaging = this.packagingAll
      const results = queryString ? packaging.filter(this.packagCreateFilter(queryString)) : packaging
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    // 包装过滤
    packagCreateFilter(queryString) {
      console.log('packagCreateFilter', queryString)
      return restaurant => restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
    },
    packagHandleSelect(item) {
      console.log('packagHandleSelect')
      console.log(item)
    },
    // 修改交易条款
    paymentChange(paymentType) {
      console.log('paymentChange', paymentType)
      // 默认的付款类型
      this.contract.payment = OrderInfo.payment.get(paymentType)
    },
    // 修改交货方式
    locationsChange(locationsType) {
      console.log('locationsChange', locationsType)
      if (locationsType === 'FOB') {
        this.contract.locations = `${locationsType} ${this.contract.loading}`
      } else if (locationsType === 'OTHER') {
        this.contract.locations = ''
      } else {
        this.contract.locations = `${locationsType} ${this.contract.destination}`
      }
    }
  },
  created() {
    // 默认的交货方式
    this.locationsChange(this.contract.locationsType)
    // 默认的付款方式
    this.paymentChange(this.contract.paymentType)
    // 加载港口列表
    this.loading = OrderInfo.Loading
    // 加载包装列表
    for (const item of OrderInfo.PackagingChineseToEnglish.entries()) {
      this.packagingAll.push({ value: item[0], address: item[0] })
    }
    console.log(this.packaging)
  }
}
</script>

<style lang="less" scoped>
.div-radio-group {
  padding-bottom: 10px;
}
</style>
