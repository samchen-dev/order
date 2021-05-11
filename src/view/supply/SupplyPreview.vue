<template>
  <div class="root">
    <div style="text-align:right;">
      <el-button size="mini" @click="exportSupply()">海运交接单 - 导出</el-button>
    </div>
    <div id="supplyPreview" class="body preview">
      <div class="title">货源、海运交接单</div>
      <div class="hander">
        <div class="item-top-left-bottom">合同编号:{{ make.current.orderID }}</div>
        <div class="item-top-left-bottom">预计交期:{{ make.current.deliveryDate }}</div>
        <div class="item-all">业 务 员:{{ handover.user }}</div>
        <div class="item-left-bottom">供 应 商:{{ make.current.factoryName }}</div>
        <div class="item-left-bottom">联 系 人:</div>
        <div class="item-left-right-bottom">联系电话:</div>
      </div>
      <div class="products">
        <div class="product" v-for="(product, index) of make.target.offerSheet.products" :key="index">
          <div class="chineseName item-left-bottom">产品名称:{{ product.chineseName }}</div>
          <div class="product-norm item-left-bottom">产品指标:{{ product.norm }}</div>
          <div class="item-left-right-bottom">
            <div class="quotations-title">
              <div>粒度</div>
              <div>数量</div>
              <div>抽检</div>
              <div>留样</div>
            </div>
            <div class="quotations-body" v-for="(quotation, qIndex) of product.quotations" :key="qIndex">
              <div>{{ `${quotation.size}  ${quotation.norm}` }}</div>
              <div>{{ `${quotation.quantity}${getUnit(product.unit, make.current.currencyType)}` }}</div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
      <div class="columns-width2-8 item-left-right-bottom">
        <div class="columns-title item-right">报关备注:</div>
        <div class="columns-width-auto">
          <div v-for="item of printCustomsType(make).entries()" :key="item[0]">{{ `${item[1].title}( ${item[1].value ? '√' : ''} )` }}</div>
        </div>
      </div>
      <div class="columns-width2-8 item-left-right-bottom">
        <div class="columns-title item-right">到港运费:</div>
        <div class="columns-width-auto">
          <div>发货前和工厂确认( {{ make.current.roadTransport === '出厂价' ? '√' : '' }} )</div>
          <div>工厂报价包含运费( {{ make.current.roadTransport === '到港价' ? '√' : '' }} )</div>
        </div>
      </div>
      <div class="columns-width2-8 item-left-right-bottom">
        <div class="columns-title item-right">包装唛头:</div>
        <div class="columns-width10">
          <div
            :class="make.current.markInfo.length - 1 === index ? 'columns-width10' : 'columns-width10 item-bottom'"
            v-for="(item, index) of make.current.markInfo"
            :key="index"
          >
            <div class="columns-width5-5">
              <div v-for="(mark, mIndex) of item.mark" :key="mIndex">
                <div style=" text-align: center; margin-top:10px;">{{ mark.title }}</div>
                <div class="columns-width5-5" style="margin:10px;">
                  <div class="item-all" style="padding:4px; white-space:pre-wrap;">{{ mark.info }}</div>
                  <div class="columns-title" style="text-align: center;">包装提供:{{ mark.provider }}</div>
                </div>
              </div>
            </div>
            <div style="padding-left:10px; padding-right:10px; padding-bottom:10px;">
              包装：{{ item.description }}
            </div>
          </div>
        </div>
      </div>
      <div class="item-left-right-bottom columns-inspection">
        <div class="item-right">验货时间:</div>
        <div class="item-right" style="text-align:center;">_____年____月____日 </div>
        <div class="item-right">取样拍照:</div>
        <div class="columns-width5-5">
          <div style="text-align:center;white-space: pre;">是( &nbsp;&nbsp;&nbsp;)</div>
          <div style="text-align:center;">否( )</div>
        </div>
      </div>
      <div class="item-left-right-bottom" style="height:80px">
      </div>
    </div>
  </div>
</template>
<script>
import SupplyPreview from './SupplyPreview'
import Supply from './Supply'

export default {
  name: 'SupplyPreview',
  props: {
    make: {
      type: Object,
      required: true
    },
    handover: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      customsType: null
    }
  },
  methods: {
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
    // 包装
    packagePrint(make) {
      console.log('packagePrint')
      return Supply.packagePrint(make)
    },
    // 报关类型
    printCustomsType(make) {
      console.log('printCustomsType', make)
      return SupplyPreview.printCustomsType(this.make)
    },
    // 交接单打印
    exportSupply() {
      console.log('printSupply')
      SupplyPreview.exportSupply(this.make, this.handover)
    }
  },
  created() {
    console.log('created')
  }
}
</script>

<style lang="less" scoped>
.root {
  display: grid;
  grid-template-columns: 100%;
}

.body {
  display: grid;
  grid-template-columns: 100%;
}
.title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  min-height: 40px;
}
.hander {
  display: grid;
  grid-template-columns: 40% 30% 30%;
}
.preview {
  font-size: 10px;
  font-weight: 500;
}

.products {
  display: grid;
  grid-template-columns: 100%;
}

.product {
  display: grid;
  grid-template-columns: 20% 20% 60%;
}

.chineseName {
  display: grid;
  align-items: center;
}

.product-norm {
  display: grid;
  align-items: center;
  word-wrap: break-word;
}

.quotations-title {
  display: grid;
  grid-template-columns: 50% 20% 15% 15%;
}

.quotations-body {
  display: grid;
  grid-template-columns: 50% 20% 15% 15%;
}

.columns-width2-8 {
  display: grid;
  grid-template-columns: 20% 80%;
}

.columns-width-auto {
  display: grid;
  grid-template-columns: repeat(auto-fill, 150px);
}

.columns-width5-5 {
  display: grid;
  grid-template-columns: 50% 50%;
}

.columns-width10 {
  display: grid;
  grid-template-columns: 100%;
}

.columns-title {
  display: grid;
  align-items: center;
}

.columns-inspection {
  display: grid;
  grid-template-columns: 20%  20%  30%  30%;
}

.item-all {
  border: 1px solid rgb(0, 0, 0);
}

.item-top-left-bottom {
  border: 1px solid rgb(0, 0, 0);
  border-right: none;
}

.item-left-bottom {
  border: 1px solid rgb(0, 0, 0);
  border-right: none;
  border-top: none;
}

.item-left-right-bottom {
  border: 1px solid rgb(0, 0, 0);
  border-top: none;
}

.item-right {
  border: 1px solid rgb(0, 0, 0);
  border-top: none;
  border-left: none;
  border-bottom: none;
}

.item-bottom {
  border: 1px solid rgb(0, 0, 0);
  border-top: none;
  border-left: none;
  border-right: none;
}
</style>
