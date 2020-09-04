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
          <el-form ref="contractFormRef" :model="contract" label-width="50px" size="mini">
            <!-- 公司信息 -->
            <div v-if="active === 0">
              <zero v-bind:contract="contract"></zero>
            </div>
            <!-- 产品报价 -->
            <div v-else-if="active === 1">
              <One v-bind:contract="contract"></One>
            </div>
            <div v-else-if="active === 2">
              <Two v-bind:contract="contract"></Two>
            </div>
            <!-- 预览合同和发票 -->
            <div id="preview" v-else-if="active === 3" class="preview-div">
              <Three v-bind:contract="contract"></Three>
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
import OrderInfo from './OrderInfo'
import Zero from './wizard/ZeroForm'
import One from './wizard/OneForm'
import Two from './wizard/TwoForm'
import Three from './wizard/ThreeForm'
import fs from 'fs'

export default {
  name: 'orderWizard',
  // 注册子组件
  components: {
    Zero,
    One,
    Two,
    Three
  },
  data() {
    return {
      // 激活步骤
      active: 0,
      // 订单
      contract: {
        // 合同编号
        orderID: 'SBM20123',
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
        // 银行信息
        bank: '',
        // 客户名称
        buyer: 'ATEN ASINDIRICI TASLAR END.VE TIC.A.S.',
        //  客户地址
        buyerAddress: 'AKCABURGAZ MAH.2.CAD.117.SOK.NO:7 34500 ESENYURT-ISTANBUL/TURKEY.',
        // 客户电话
        buyerTEL: '+90(212)8865026',
        // 客户传真
        buyerFAX: '+90(212)8865030',
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
        packaging: 'IN 25KG PP BAGS ON PALLET.',
        // 起运港
        loading: 'XINGANG, CHINA.',
        destination: 'AMBARLI, TURKEY',
        // 付款类型
        paymentType: 0,
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
      --this.active
      if (this.active < 0) this.active = 0
    },
    // 下一步
    next() {
      console.log('nexe:', this.active)
      let flag = true
      switch (this.active) {
        case 0:
          // 验证公司信息
          this.$refs.contractFormRef.validateField(
            ['orderID', 'orderDate', 'location', 'seller', 'sellerAddress', 'bank', 'buyer', 'buyerAddress'],
            val => {
              if (val) {
                flag = false
              }
            }
          )
          if (flag) this.active++
          break
        case 1:
          // 验证产品价格
          if (flag) this.active++
          break
        case 2:
          // 验证交易条款
          this.$refs.contractFormRef.validateField(['packaging', 'loading', 'destination'], val => {
            if (val) {
              flag = false
            }
          })
          if (flag) this.active++
          break
        case 3:
          // 验证预览
          if (flag) this.active++
          break
      }
      if (this.active > 3) this.active = 0
    }
  }
}
</script>

<style lang="less" scoped>

</style>
