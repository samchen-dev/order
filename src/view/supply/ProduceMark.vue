<template>
  <div>
    <el-card shadow="always">
      <el-divider content-position="left">交期</el-divider>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-form-item label="工厂名称:" label-width="80px">
            <el-input v-model="make.current.factoryName" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
            prop="current.deliveryDate"
            :rules="[{ required: true, message: '生产交期不能为空！', trigger: 'blur' }]"
            label="生产交期:"
            label-width="85px">
            <el-date-picker
              v-model="make.current.deliveryDate"
              type="date"
              style="width:100%"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="预计交期:" label-width="90px">
            <el-input v-model="handover.order.deliveryDate" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="9">
          <span style="min-height:1px; padding-left: 5px;"></span>
        </el-col>
        <el-col :span="15">
          <span style="float: right;">(生产交期默认比预计交期早7天)</span>
        </el-col>
      </el-row>
      <el-divider content-position="left">付款</el-divider>
      <el-row :gutter="10">
        <el-col :span="11">
          <el-form-item label="付款方式:" label-width="80px">
            <el-radio-group v-model="make.current.paymentMethod.genre" @change="paymentChange">
              <el-radio label="发货前付款">发货前付款</el-radio>
              <el-radio label="月结">月结</el-radio>
              <el-radio label="其它">其它</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
         <el-col :span="13">
          <el-form-item
            prop="current.paymentMethod.description"
            :rules="[{ required: true, message: '付款描述不能为空！', trigger: 'blur' }]"
            label="付款描述:"
            label-width="85px">
            <el-input v-model="make.current.paymentMethod.description"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
         <el-col :span="16">
          <span style="min-height:1px; padding-left: 5px;"></span>
        </el-col>
        <el-col :span="8">
          <span style="float: right;" v-text="numberToCurrency"></span>
        </el-col>
      </el-row>
      <el-divider content-position="left">运输</el-divider>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="运输条款:" label-width="80px">
            <el-radio-group v-model="make.current.roadTransport">
              <el-radio label="出厂价">出厂价</el-radio>
              <el-radio label="到港价">到港价</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="起运港:" label-width="80px">
            <el-select v-model="make.current.loading" placeholder="请选择">
              <el-option
                v-for="item of loading.entries()"
                :key="item[1]"
                :label="item[1]"
                :value="item[1]">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <span style="float: right;">(提示：订单中的起运港是{{contract.loading}})</span>
        </el-col>
      </el-row>
      <el-divider content-position="left">唛头</el-divider>
      <div v-for="(markInfo, mIndex) in make.current.markInfo" :key="mIndex">
        <div v-for="(item, index) in markInfo.mark" :key="index">
          <el-row :gutter="10" >
            <el-col :span="12">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="唛头标题:" label-width="80px">
                    <el-input v-model="item.title"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="唛头正文:" label-width="80px">
                    <el-input v-model="item.info" type="textarea" :rows="5"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="包装提供:" label-width="80px">
                    <el-radio-group v-model="item.provider" @change="val => {changePackageProvide(val, markInfo, item)}">
                      <el-radio label="我方">我方</el-radio>
                      <el-radio label="工厂">工厂</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-radio-group v-model="item.genre" @change="(val) => {createMarkBody(val, markInfo.name, item)}">
                    <div v-for="item of markAllType.entries()" :key="item[0]"><el-radio :label="item[0]">{{item[0]}}</el-radio></div>
                  </el-radio-group>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="20">
            <el-form-item label="包装描述:" label-width="80px">
              <el-input v-model="markInfo.description" type="textarea" :rows="2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center" v-if="mIndex < make.current.markInfo.length - 1">产品</el-divider>
      </div>
    </el-card>
  </div>
</template>
<script>
import OrderInfo from '../form/OrderInfo'

export default {
  name: 'ProduceMark',
  props: {
    contract: {
      type: Object,
      required: true
    },
    handover: {
      type: Object,
      required: true
    },
    make: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 起运港信息翻译成中文
      loading: null,
      // 加载所有唛头类型
      markAllType: null,
    }
  },
  methods: {
    // 付款方式改变
    paymentChange(val) {
      console.log('paymentChange:', val)
      const payment = new Map([
        ['发货前付款', '发货前支付货款'],
        ['月结', '发货后三十天支付货款'],
        ['其它', '发货前给工厂支付30%，发货后30天给工厂支付70%'],
      ])
      this.make.current.paymentMethod.description = payment.get(val)
    },
    // 设置默认发货港口
    setLoading(val) {
      console.log('setLoading', val)
      this.make.current.loading = this.loading.get(val) === undefined ? val : this.loading.get(val)
    },
    // 获取交接单中关于唛头的信息
    getMarkInfo(productName, val) {
      console.log('getMarkInfo', val)
      const packaging = OrderInfo.PackagingAllInfo.get(val) === undefined
        ? JSON.parse(JSON.stringify(OrderInfo.PackagingAllInfo.get('default'))) : JSON.parse(JSON.stringify(OrderInfo.PackagingAllInfo.get(val)))
      packaging.name = productName
      // 添加包装对应的产品名称
      packaging.description = `${productName}:${packaging.description}`
      this.make.current.markInfo.push(packaging)
    },
    // 生成唛头正文
    createMarkBody(val, productName, item) {
      console.log('createMarkBody', val, productName, item)
      const nw = item.netWeight === 'undefined' ? 'N.W.: 25KG / 1000KG' : item.netWeight === '25KG' ? 'N.W.: 25KG' : `N.W.: ${item.netWeight}`
      item.info = this.markAllType.get(val)(productName, this.make.current.orderID, nw)
    },
    // 包装供应商提供，还是我方提供
    changePackageProvide(val, markInfo, item) {
      console.log('changePackageProvide', val, markInfo, item)
      // 匹配中括号，中括号中的内容是关于包装由谁提供
      const regex = /\[(.+?)\]/g
      const insertStr = `${item.title}:我方提供`
      const str = markInfo.description.match(regex)
      if (val === '我方') {
        // 添加我放提供包装
        // 如果之前是工厂提供包装
        if (str === null) {
          // 添加买方提供包装
          markInfo.description = `${markInfo.description}[${insertStr}]`
        } else {
          const index = markInfo.description.lastIndexOf(']')
          console.log(`${markInfo.description.slice(0, index - 1)}${insertStr}]`)
          markInfo.description = `${markInfo.description.slice(0, index)};${insertStr}]`
        }
      } else if (str !== null) {
        // 删除我方提供包装
        const text = markInfo.description.slice(0, markInfo.description.lastIndexOf('['))
        const quiteStr = insertStr
        const providerString = str[0].toString()
        const subString = providerString.slice(providerString.lastIndexOf('[') + 1, providerString.lastIndexOf(']'))
        const subArray = subString.split(';')
        // 删除包装买方提供信息
        console.log(subArray, subArray.length)
        if (subArray.length === 1) {
          // 一种包装，连同[]一起删除
          markInfo.description = `${text}`
        } else {
          markInfo.description = `${text}[${subArray.splice(subArray.lastIndexOf(quiteStr), 1).join(';')}]`
        }
      }
    },
  },
  computed: {
    // 数字转货币
    numberToCurrency() {
      console.log('numberToCurrency')
      return this.make.current.currencyType === 'RMB'
        ? `(采购金额:${this.make.target.offerSheet.productPurchasing.toFixed(2)}RMB)`
        : `(采购金额:USD ${this.make.target.offerSheet.productPurchasing.toFixed(2)})`
    }
  },
  filters: {
    // 唛头设置标题
    getMarkTitle(val) {
      return `${val}正文:`
    }
  },
  created() {
    console.log('ProduceMark-created')
    // 组件初始化时候加载
    // 默认付款方式加载
    this.paymentChange(this.make.current.paymentMethod.genre)
    // 加载港口列表信息
    this.loading = OrderInfo.Loading
    // 根据订单中起运港设置给工厂的合同中的发货港口信息
    this.setLoading(this.contract.loading)
    // 清空后，加载唛头信息
    this.make.current.markInfo.splice(0, this.make.current.markInfo.length)
    for (const product of this.make.target.offerSheet.products) {
      console.log(product.name, this.handover.produce.packaging)
      this.getMarkInfo(product.name, this.handover.produce.packaging)
    }
    // 唛头类型（中性唛头、我司唛头等信息）
    for (const markInfo of this.make.current.markInfo) {
      for (const mark of markInfo.mark) {
        mark.genre = this.handover.produce.mark
        console.log('mark:', mark)
        this.changePackageProvide(mark.provider, markInfo, mark)
      }
    }

    // 加载所有唛头类型
    this.markAllType = OrderInfo.markAllType

    // 初始化唛头info信息
    for (const markInfo of this.make.current.markInfo) {
      for (const item of markInfo.mark) {
        this.createMarkBody(item.genre, markInfo.name, item)
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
