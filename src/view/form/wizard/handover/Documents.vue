<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>单证要求</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="发票份数:">
            <el-input-number v-model="documents.invoiceQuantity"  :min="1" :max="9" label="发票份数1~9中间，默认4份"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="装箱单份数:">
            <el-input-number v-model="documents.packingListQuantity"  :min="1" :max="9" label="装箱单数1~9中间，默认3份"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="保险单份数:">
            <el-input-number v-model="documents.insuranceQuantity"  :min="1" :max="9" label="保险单数1~9中间，默认3份"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="16">
          <el-form-item label="原产地证:">
            <el-radio-group v-model="documents.certificateOfOrigin">
              <el-radio label="CO">CO</el-radio>
              <el-radio label="CCPIT">CCPIT</el-radio>
              <el-radio label="FORM A">FORM A</el-radio>
              <el-radio label="FORM B">FORM B</el-radio>
              <el-radio label="FORM E">FORM E</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="REACH:">
            <el-radio-group v-model="documents.reach">
              <el-radio label="不提供">不提供</el-radio>
              <el-radio label="提供">提供</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="15">
          <el-form-item label="检测报告:">
            <el-radio-group
              v-model="documents.certificateOfAnalysis.genre">
              <el-radio label="我司">我司</el-radio>
              <el-radio label="三磨所">三磨所</el-radio>
              <el-radio label="洛耐院">洛耐院</el-radio>
              <el-radio label="其它检测机构">其它检测机构</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="检测报告份数:" label-width="100px">
            <el-input-number
              v-model="documents.certificateOfAnalysis.Quantity"
              :min="1"
              :max="9"
              label="检测报告份数1~9中间，默认3份"
              :disabled="documents.certificateOfAnalysis.genre === '我司' ? false : true">
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
    <div style="height:10px;"></div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>订单付款方式:{{ contract.paymentType }}</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="交单类型">
            <el-radio-group
              @change="billTypeChange"
              v-model="documents.bill.genre">
              <div><el-radio label="寄单客户">寄单客户</el-radio></div>
              <div><el-radio label="银行交单">银行交单</el-radio></div>
              <div><el-radio label="寄单代理">寄单代理</el-radio></div>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item
            label="寄单地址:"
            prop="documents.bill.address"
            :rules="[{ required: true, message: '寄单地址不能为空！', trigger: 'blur' }]"
          >
            <el-input
              type="textarea"
              :placeholder="billPlaceholder"
              :rows="4"
              v-model="documents.bill.address">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
// 交接单-海运信息
export default {
  name: 'Documents',
  props: {
    contract: {
      type: Object,
      required: true
    },
    documents: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      // 地址栏提示信息
      billPlaceholder: ''
    }
  },
  methods: {
    // 改变寄单模式，同时修改寄单地址等信息
    billTypeChange(type) {
      console.log('billTypeChange', type)
      if (type === 'D/A' || type === 'D/P' || type === '银行交单' || type === '寄单代理') {
        this.documents.bill.address = ''
        this.billPlaceholder = type === 'D/A' || type === 'D/P' || type === '银行交单' ? '请输入交单银行信息' : '请输入寄单代理信息'
      } else {
        const address = `${this.contract.buyer}\n${this.contract.buyerAddress}\n${this.contract.buyerTEL}  ${this.contract.buyerFAX}`
        this.documents.bill.address = address
      }
    }
  },
  created() {
    // 更具订单的付款方式，设置交接单上寄单的方式
    this.billTypeChange(this.contract.paymentType)
  }
}
</script>
<style lang="less" scoped>
.box-card {
  font-size: 14px;

  .el-card__header {
    padding: 14px 14px !important;
  }
}
.el-radio {
  margin-right: 10px;
}
</style>
