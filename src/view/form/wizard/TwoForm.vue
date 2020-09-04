<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="包装" prop="packaging" :rules="[{ required: true, message: '请选择合适的包装类型！', trigger: 'blur' }]">
          <el-select v-model="contract.packaging" allow-create filterable default-first-option placeholder="选择包装" style="width:100%">
            <el-option label="IN 25KG PP BAGS ON PALLET." value="IN 25KG PP BAGS ON PALLET." selected></el-option>
            <el-option label="IN 55LB PAPER BAG*40 BAGS ON ONE PALLET." value="IN 55LB PAPER BAG*40 BAGS ON ONE PALLET."></el-option>
            <el-option label="IN 1MT BIG BAGS." value="IN 1MT BIG BAGS."></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="起运" prop="loading" :rules="[{ required: true, message: '请选择合适的起运港！', trigger: 'blur' }]">
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
              <el-radio :label="0">T/T</el-radio>
              <el-radio :label="1">D/A</el-radio>
              <el-radio :label="2">D/P</el-radio>
              <el-radio :label="3">LC</el-radio>
              <el-radio :label="4">OTHER</el-radio>
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
  methods: {
    // 修改交易条款
    paymentChange(paymentType) {
      console.log('paymentChange', paymentType)
      // 默认的付款类型
      this.contract.payment = OrderInfo.payment[paymentType]
    },
    // 修改交货方式
    locationsChange(locationsType) {
      console.log('locationsChange', locationsType)
      if (locationsType === 'FOB') {
        this.contract.locations = locationsType + ' ' + this.contract.loading
      } else if (locationsType === 'OTHER') {
        this.contract.locations = ''
      } else {
        this.contract.locations = locationsType + ' ' + this.contract.destination
      }
    }
  },
  mounted() {
    // 默认的交货方式
    this.contract.locations = this.contract.locationsType + ' ' + this.contract.loading
  }
}
</script>

<style lang="less" scoped>
.div-radio-group {
  padding-bottom: 10px;
}
</style>
