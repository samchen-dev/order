<template>
  <div>
    <div class="preview" v-if="renderFlag">
      <el-row>
        <el-col :span="23">
          <div style="text-align:right;">
            <el-button size="mini" @click="exportExcel">Excel - 导出</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div style="text-align:center; font-size:20px; font-weight:bold; min-height: 40px;">
            采购合同
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <div style="min-height: 1px;"></div>
        </el-col>
        <el-col :span="18">
          <el-row>
            <el-col>
              <div style="float: right;">
                <div class="preview-text">合同编号:{{make.current.orderID}}</div>
                <div class="preview-text">合同日期:{{make.current.signingDate}}</div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12"><div class="preview-text">卖方:<span v-text="make.current.factoryName"></span></div></el-col>
            <el-col :span="12"><div style="float: right;" class="preview-text">买方:<span v-text="make.current.purchaser"></span></div></el-col>
          </el-row>
          <el-row class="preview-border-top">
            <el-col :span="cellWidth[0]" class="preview-cell"><div>1、产品</div></el-col>
            <el-col :span="cellWidth[1]" class="preview-cell"><div class="preview-digital-cell">2、数量</div></el-col>
            <el-col :span="cellWidth[2]" class="preview-cell"><div class="preview-digital-cell">3、价格{{roadTransportPrint(make.current.purchaser, make.current.roadTransport, make.current.currencyType, make.current.loading)}}</div></el-col>
            <el-col :span="cellWidth[3]" class="preview-cell"><div class="preview-digital-cell">4、总值</div></el-col>
          </el-row>
          <el-row class="preview-border-left-right-bottom">
            <el-col :span="cellWidth[0]" class="preview-cell"><div style="min-height: 1px;"></div></el-col>
            <el-col :span="cellWidth[1]" class="preview-cell"><div style="min-height: 1px;"></div></el-col>
            <el-col :span="cellWidth[2]" class="preview-cell"><div style="min-height: 1px;"></div></el-col>
            <el-col :span="cellWidth[3]" class="preview-cell"><div style="min-height: 1px;"></div></el-col>
          </el-row>
          <el-row v-for="(product, index) of make.target.offerSheet.products" :key="index">
            <el-col :span="24" class="preview-border-left-right">
              <el-row>
                <el-col :span="cellWidth[0]">
                  <div>
                    <div class="preview-cell" v-text="product.chineseName"></div>
                    <div class="preview-norm-cell" v-text="product.norm"></div>
                  </div>
                </el-col>
              </el-row>
              <el-row v-for="(quotation, qIndex) of product.quotations" :key="qIndex">
                <el-col :span="cellWidth[0]" class="preview-cell"><div class="preview-digital-cell">{{`${quotation.size}  ${quotation.norm}`}}</div></el-col>
                <el-col :span="cellWidth[1]" class="preview-cell"><div class="preview-digital-cell">{{`${quotation.quantity}${getUnit(product.unit, make.current.currencyType)}`}}</div></el-col>
                <el-col :span="cellWidth[2]" class="preview-cell"><div class="preview-digital-cell" v-text="unitPricePrint(make.current.currencyType, quotation.purchasing, product.unit)"></div></el-col>
                <el-col :span="cellWidth[3]" class="preview-cell"><div class="preview-digital-cell" v-text="unitTotalPricePrint(make.current.currencyType, quotation.purchasePrice)"></div></el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row class="preview-border-top-left-right-bottom">
            <el-col :span="cellWidth[0]" class="preview-cell"><div>共计:</div></el-col>
            <el-col :span="cellWidth[1]" class="preview-cell"><div class="preview-digital-cell" v-text="countToString(make.current.currencyType, make)"></div></el-col>
            <el-col :span="cellWidth[2]" class="preview-cell"></el-col>
            <el-col :span="cellWidth[3]" class="preview-cell"><div class="preview-digital-cell" v-text="unitTotalPricePrint(make.current.currencyType, make.target.offerSheet.productPurchasing)"></div></el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="preview-package-cell">
              5、包装:{{packagePrint(make)}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              6、唛头:
              <el-row v-for="(item, index) of make.current.markInfo" :key="index">
                <el-col :span="24">
                  <el-row>
                    <el-col :span="24">
                      <div v-for="(mark, mIndex) of item.mark" :key="mIndex">
                        <el-col :span="8">
                          <div class="preview-mark-title-cell" v-text="mark.title"></div>
                          <div class="preview-mark-cell" v-text="mark.info"></div>
                        </el-col>
                        <el-col :span="4">
                          <div style="min-height: 1px;"></div>
                        </el-col>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="padding-top: 10px;" class="preview-cell">
              7、装运期限:<span>{{`${make.current.deliveryDate}前货发港口`}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="preview-cell">
              8、起运港口:<span v-text="make.current.loading"></span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="preview-cell">
              9、付款条件:<span v-text="make.current.paymentMethod.description"></span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="preview-cell">
              10、卖方必须提供与合同要求相符的货物给买方,如卖方提供的货物质量与合同要求不符,买方有权提出索赔。货物备好后，卖方应及时通知买方，买方检验人员到供方工厂抽样检测，检测合格后, 供方再发货港口。
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="preview-cell">
              11、本合同一经双方签字即生效，不得更改或撤消
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12"><div class="preview-contractor-cell">卖方:</div></el-col>
            <el-col :span="12"><div class="preview-contractor-cell">买方:</div></el-col>
          </el-row>
        </el-col>
        <el-col :span="3">
          <div style="min-height: 1px;"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Supply from './Supply'

export default {
  name: 'ProducePreivew',
  props: {
    contract: {
      type: Object,
      required: false
    },
    handover: {
      type: Object,
      required: false
    },
    makeProp: {
      type: Object,
      required: true
    },
    // 未完成采购合同预览undone、完成采购合同预览complete
    previewMode: {
      type: String,
      required: true,
      default: 'undone'
    }
  },
  data() {
    return {
      // 采购合同中文名
      chineseName: '',
      // 单元格宽度
      cellWidth: [9, 4, 6, 5],
      // 设置预览变量
      make: {
        current: null,
        target: null,
      },

      // 子组件渲染标记
      renderFlag: false,
    }
  },
  methods: {
    // 初始化加载的数据
    loadData() {
      console.log('loadData')
      console.log(this.make)
      console.log(this.make.target.offerSheet)
      const name = []
      for (const produce of this.make.target.offerSheet.products) {
        name.push(produce.chineseName)
      }
      console.log(name)
      this.chineseName = name.join(',')
    },

    // 获取订单产品的单位中文
    getUnit(key, type) {
      console.log('getUnit', key, type)
      return Supply.getUnit(key, type)
    },
    // 总数量转换字符串
    countToString(type, make) {
      console.log('countToString', type, make)
      return Supply.countToString(type, make)
    },
    // 货币类型显示单价
    unitPricePrint(type, price, unit) {
      console.log('unitPricePrint', type, price, unit)
      return Supply.unitPricePrint(type, price, unit)
    },
    // 货币类型显示总价
    unitTotalPricePrint(type, price) {
      console.log('unitTotalPricePrint', type, price)
      return Supply.unitTotalPricePrint(type, price)
    },
    // 包装
    packagePrint(make) {
      console.log('packagePrint')
      return Supply.packagePrint(make)
    },
    // 显示单价
    roadTransportPrint(purchaser, val, type, loading) {
      return Supply.roadTransportPrint(purchaser, val, type, loading)
    },
    // 导出合同
    exportExcel() {
      console.log('exportExcel')
      Supply.exportSupply(this.make)
    }
  },
  created() {
    console.log('created')
    if (this.previewMode === 'undone') {
      this.make.current = this.makeProp.factory[0]
      this.make.target = this.make.current.target
    } else {
      this.make = this.makeProp
    }
    this.loadData()

    this.renderFlag = true
    console.log('ProducePreview数据加载完毕')
  }
}
</script>

<style lang="less" scoped>
.preview {
  font-size: 12px;
  font-weight: 500;
}
.preview-text {
  padding-top: 2px;
  padding-left: 2px;
  padding-bottom: 5px;
}
.span-text {
  padding-left: 4px;
  padding-right: 4px;
}
.annex-button {
  padding-top: 0px;
  padding-bottom: 0px;
}

.preview-border-top {
  border-top-color: #000;
  border-top-width: 1px;
  border-top-style: solid;

  border-left-color: #000;
  border-left-width: 1px;
  border-left-style: solid;

  border-right-color: #000;
  border-right-width: 1px;
  border-right-style: solid;
}

.preview-border-all {
  border-top-color: #000;
  border-top-width: 1px;
  border-top-style: solid;

  border-left-color: #000;
  border-left-width: 1px;
  border-left-style: solid;

  border-right-color: #000;
  border-right-width: 1px;
  border-right-style: solid;

  border-bottom-color: #000;
  border-bottom-width: 1px;
  border-bottom-style: solid;
}

.preview-border-left-right-bottom {
  border-left-color: #000;
  border-left-width: 1px;
  border-left-style: solid;

  border-right-color: #000;
  border-right-width: 1px;
  border-right-style: solid;

  border-bottom-color: #000;
  border-bottom-width: 1px;
  border-bottom-style: solid;
}

.preview-border-left-right {
  border-left-color: #000;
  border-left-width: 1px;
  border-left-style: solid;

  border-right-color: #000;
  border-right-width: 1px;
  border-right-style: solid;
}

.preview-border-top-left-right-bottom {
  border-top-color: #000;
  border-top-width: 1px;
  border-top-style: solid;

  border-left-color: #000;
  border-left-width: 1px;
  border-left-style: solid;

  border-right-color: #000;
  border-right-width: 1px;
  border-right-style: solid;

  border-bottom-color: #000;
  border-bottom-width: 1px;
  border-bottom-style: solid;
}
.preview-cell {
  padding-left: 2px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.preview-contractor-cell {
  padding-left: 2px;
  padding-top: 30px;
}


.preview-norm-cell {
  padding-left: 2px;
  padding-right: 2px;
  padding-top: 2px;
  padding-bottom: 2px;
  white-space: pre-line;
}
.preview-mark-title-cell {
  padding-left: 2px;
  padding-right: 2px;
  padding-top: 10px;
}

.preview-mark-cell {
  margin-left: 4px;
  padding-left: 2px;
  padding-right: 2px;
  padding-top: 2px;
  padding-bottom: 2px;
  white-space: pre-line;

  border-top-color: #000;
  border-top-width: 1px;
  border-top-style: solid;

  border-left-color: #000;
  border-left-width: 1px;
  border-left-style: solid;

  border-right-color: #000;
  border-right-width: 1px;
  border-right-style: solid;

  border-bottom-color: #000;
  border-bottom-width: 1px;
  border-bottom-style: solid;
}
.preview-digital-cell {
  float: left;
  padding-left: 10px;
}
</style>
