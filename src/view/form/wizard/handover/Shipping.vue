<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>发货要求</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="16">
          <el-form-item label="货柜类型:">
            <el-radio-group v-model="shipping.container.genre" @change="containerChange">
              <div>
                <el-radio class="container-el-radio" label="拼柜">拼柜</el-radio>
                <el-radio class="container-el-radio" label="整柜20GP">整柜20GP</el-radio>
                <el-radio class="container-el-radio" label="整柜40GP">整柜40GP</el-radio>
                <el-radio class="container-el-radio" label="散装">散装</el-radio>
                <el-radio class="container-el-radio" label="其它">其它</el-radio>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="核算运费:">
            <el-input-number v-model="shipping.accountingShipping"  label="核算运费"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="16">
          <el-form-item label="货柜描述:">
            <el-input
              v-model="shipping.container.description"
              placeholder="货柜类型是其它，请填写描述"
              :disabled="shipping.container.genre === '其它' ? false : true">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8"></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-form-item label="提单要求:">
            <el-radio-group v-model="shipping.billOfLading.shape" @change="shapeChange">
              <el-radio label="正本提单">正本提单</el-radio>
              <el-radio label="电放提单">电放提单</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="正本数量:">
            <el-input-number
              :min="0"
              :max="9"
              v-model="shipping.billOfLading.original"
              :disabled="shipping.billOfLading.shape === '正本提单' ? false : true">
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="副本数量:">
            <el-input-number
            :min="0"
            :max="9"
            v-model="shipping.billOfLading.copy"
            :disabled="shipping.billOfLading.shape === '正本提单' ? false : true">
          </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>
                收货人与买方:
                <el-switch
                  v-model="consigneeFlag"
                  @change="consigneeChange"
                  :active-value="true"
                  active-text="相同"
                  :inactive-value="false"
                  inactive-text="不同">
                </el-switch>
              </span>
            </div>
            <el-row>
              <el-col>
                <el-form-item
                  label-width="20px"
                  label=" "
                  prop="shipping.consignee"
                  :rules="[{ required: true, message: '海运发货人信息不能为空！', trigger: 'blur' }]">
                  <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入提单显示的收货人"
                    @input="consigneeInput"
                    v-model="shipping.consignee">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>
                通知人与收货人:
                <el-switch
                  v-model="notifyFlag"
                  @change="notifyChange"
                  :active-value="true"
                  active-text="相同"
                  :inactive-value="false"
                  inactive-text="不同">
                </el-switch>
              </span>
            </div>
            <el-row>
              <el-col>
                <el-form-item label-width="20px"
                  label=" "
                  prop="shipping.notify"
                  :rules="[{ required: true, message: '海运通知人信息不能为空！', trigger: 'blur' }]">
                  <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入提单显示的通知人"
                    v-model="shipping.notify">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
      <div style="height:10px;"></div>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>海运附加信息:</span>
            </div>
            <div>
              <span style="margin-right:10px;">海运编码:</span>
              <el-radio-group v-model="shipping.showHSCode">
                <el-radio label="不显示">不显示</el-radio>
                <el-radio label="显示">显示</el-radio>
              </el-radio-group>
              <div>
                <span>附加信息:</span>
                <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="客户产品HSCODE信息、对订船的要求、是否要求快船、客户约号、限制某些船公司等信息"
                  v-model="shipping.description">
                </el-input>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>签订订单条款:{{ contract.locationsType }}</span>
            </div>
            <div>
              <span>货代信息:</span>
              <el-input
                type="textarea"
                :rows="5"
                placeholder="FOB条款下客户订船的代理信息"
                :disabled="contract.locationsType === 'FOB' ? false : true "
                v-model="shipping.shippingAgent">
              </el-input>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
// 交接单-海运信息
export default {
  name: 'Shipping',
  props: {
    contract: {
      type: Object,
      required: true
    },
    shipping: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 收货人是否和订单买方一致标记，默认为一致
      consigneeFlag: true,
      // 通知人是否和收货人一致标记，默认为一致
      notifyFlag: true,
    }
  },
  methods: {
    // 收货人监听
    consigneeChange() {
      console.log('consigneeChange')
      // 判断提单收货人信息是否和订单买方信息一致
      if (this.consigneeFlag === true) {
        const value = `${this.contract.buyer}\n${this.contract.buyerAddress}\n${this.contract.buyerTEL}  ${this.contract.buyerFAX}`
        this.shipping.consignee = value
        // 判断通知人和收货人是否一致
        if (this.notifyFlag === true) this.shipping.notify = value
      } else {
        this.shipping.consignee = ''
        this.shipping.notify = ''
      }
    },
    // 通知人监听
    notifyChange() {
      console.log('notifyChange')
      // 判断通知人和收货人是否一致
      if (this.notifyFlag === true) {
        this.shipping.notify = this.shipping.consignee
      } else {
        this.shipping.notify = ''
      }
    },
    // 集装箱监听
    containerChange(item) {
      console.log('containerChange', item)
      if (item !== '其它') this.shipping.container.description = ''
    },
    // 提单监听
    shapeChange(item) {
      console.log('shapeChange', item)
      if (item === '电放提单') {
        // 修改正部分提单数量
        this.shipping.billOfLading.original = 0
        this.shipping.billOfLading.copy = 0
      } else {
        // 修改正部分提单数量
        this.shipping.billOfLading.original = 3
        this.shipping.billOfLading.copy = 3
      }
    },
    // 输入收货人信息时监听
    consigneeInput() {
      console.log('consigneeInput')
      // 监听consignee文本框,在notifyFlag === true的情况下，同时修改通知人文本
      if (this.notifyFlag === true) this.shipping.notify = this.shipping.consignee
    }
  },
  // 组件初始
  created() {
    console.log('Shipping--created')
    // 加载提单相关的默认值
    this.consigneeChange()
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

.container-el-radio {
  margin-right: 10px;
}
</style>
