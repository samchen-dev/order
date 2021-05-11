<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-form-item
          label="编号"
          prop="orderID"
          :rules="[
            { required: true, message: '合同编号不能为空！', trigger: 'blur' },
            { pattern: /^SBM[0-9]{5}$/, message: '订单号不符合名目规则' }
          ]"
        >
          <el-select
            placeholder="合同编号(SBM开头)"
            :disabled="orderIDisabled"
            v-model="contract.orderID"
            filterable
            allow-create
            default-first-option>
            <el-option
              v-for="item in orderIDS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="PO">
          <el-input placeholder="客户PO编号" v-model="contract.PO"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="日期" prop="orderDate" :rules="[{ required: true, message: '合同日期不能为空！', trigger: 'blur' }]">
          <el-date-picker
            v-model="contract.orderDate"
            align="left"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            size="mini"
            style="width:100%"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="地点" prop="location" :rules="[{ required: true, message: '合同地点不能为空！', trigger: 'blur' }]">
          <el-input v-model="contract.location"></el-input>
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
            <el-radio-group style="float: right;" v-model="contract.sellerType" type="vertical" @change="sellerChange">
              <el-radio :label="0">HK</el-radio>
              <el-radio :label="1">ZH</el-radio>
              <el-radio :label="2">其它</el-radio>
            </el-radio-group>
          </div>
          <el-form-item label="名称" prop="seller" :rules="[{ required: true, message: '卖方名称不能为空！', trigger: 'blur' }]">
            <el-input placeholder="公司名称" v-model="contract.seller"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="sellerAddress" :rules="[{ required: true, message: '卖方地址不能为空！', trigger: 'blur' }]">
            <el-input placeholder="公司地址" v-model="contract.sellerAddress" type="textarea" :rows="2"></el-input>
          </el-form-item>
          <el-form-item label="银行" prop="bank" :rules="[{ required: true, message: '银行信息不能为空！', trigger: 'blur' }]">
            <el-input placeholder="银行信息" v-model="contract.bank" type="textarea" :rows="3"></el-input>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="电话" prop="sellerTEL">
                <el-input v-model="contract.sellerTEL"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="传真" prop="sellerFAX">
                <el-input v-model="contract.sellerFAX"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>买方</span>
          </div>
          <el-form-item label="名称" prop="buyer" :rules="[{ required: true, message: '买方名称不能为空！', trigger: 'blur' }]">
            <el-input placeholder="名称" v-model="contract.buyer"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="buyerAddress" :rules="[{ required: true, message: '买方地址不能为空！', trigger: 'blur' }]">
            <el-input placeholder="买方地址" v-model="contract.buyerAddress" type="textarea" :rows="2"></el-input>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="电话" prop="buyerTEL">
                <el-input v-model="contract.buyerTEL"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="传真" prop="buyerFAX">
                <el-input v-model="contract.buyerFAX"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import OrderInfo from '../OrderInfo'

export default {
  name: 'ZeroForm',
  props: {
    contract: {
      type: Object,
      required: true
    },
    openType: {
      type: String,
      default: 'new'
    }
  },
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
      // 在更新订单情况下，订单号不能修改
      orderIDisabled: this.openType === 'update',
      // 潜在订单号数组
      orderIDS: []
    }
  },
  methods: {
    // 转换大小写
    buyerUpperCase (value) {
      console.log('upperCase', value)
      if (!value) return ''
      this.contract.buyer = value.toUpperCase()
    },
    buyerAddressUpperCase (value) {
      console.log('upperCase', value)
      if (!value) return ''
      this.contract.buyerAddress = value.toUpperCase()
    },
    // 改变卖方类型
    sellerChange(sellerType) {
      console.log('sellerChange', sellerType)
      // 修改公司类型
      this.contract.seller = OrderInfo.seller[sellerType]
      // 修改地址类型
      this.contract.sellerAddress = OrderInfo.sellerAddress[sellerType]
      // 修改银行类型
      this.contract.bank = OrderInfo.bank[sellerType]
    },
    // 获取潜在订单号
    async getPotentialOrderID() {
      console.log('getPotentialOrderID')
      const { data: res } = await this.$http.get('/order/potentialOrderID/v1')
      if (res.meta.status === 200) {
        console.log(res.data.orderIDS)
        this.orderIDS = res.data.orderIDS
      }
    }
  },
  mounted() {
    // 创建订单的默认日期
    this.contract.orderDate = this.$XEUtils.toDateString(new Date(), 'yyyy-MM-dd')
    // 公司默认类型
    this.contract.seller = OrderInfo.seller[this.contract.sellerType]
    // 地址默认类型
    this.contract.sellerAddress = OrderInfo.sellerAddress[this.contract.sellerType]
    // 默认银行类型
    this.contract.bank = OrderInfo.bank[this.contract.sellerType]
    // 默认的付款类型
    this.contract.payment = OrderInfo.payment[this.contract.paymentType]
  },
  // 初始化
  created() {
    // 加载获取潜在订单号
    if (this.openType !== 'update') {
      this.getPotentialOrderID()
    }
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
</style>
