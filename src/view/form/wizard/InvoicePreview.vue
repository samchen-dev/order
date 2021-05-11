<template>
  <!-- 发票预览 -->
  <div class="preview-div">
    <el-row>
      <el-col :span="6">
        <div style="min-height: 1px;"></div>
      </el-col>
      <el-col :span="12">
        <div style="text-align:center; font-size:20px; font-weight:bold; min-height: 40px;">{{ contract.seller }}</div>
      </el-col>
      <el-col :span="6">
        <div style="text-align:right;">
          <el-button-group>
            <el-button size="mini" disabled>PDF 导出</el-button>
            <el-button size="mini" @click="exportInvoiceExcel()">Excel 导出</el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <div style="min-height: 1px;"></div>
      </el-col>
      <el-col :span="12">
        <div style="text-align:center; font-size:20px; font-weight:bold; min-height: 40px;">PROFORMA INVOICE</div>
      </el-col>
      <el-col :span="6"></el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div>SELLER:{{ contract.seller }}</div>
        <div>ADDRESS:{{ contract.sellerAddress }}</div>
        <div style="word-spacing:10px">
          <span v-if="contract.sellerTEL !== ''">TEL:{{contract.sellerTEL}}</span>&nbsp;
          <span v-if="contract.sellerFAX !== ''">FAX:{{contract.sellerFAX}}</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div style="min-height: 1px;"></div>
      </el-col>
      <el-col :span="6">
        <div>S/C NO.:{{ contract.orderID }}</div>
        <div v-if="contract.PO !== ''">PO.:{{ contract.PO }}</div>
        <div>DATE:{{ contract.orderDate }}</div>
        <div>PLACE:{{ contract.location }}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24"><div class="grid-Blank-line"></div></el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div>SELLER’S BANK INFO:</div>
        <div style="white-space: pre-wrap;">{{ contract.bank }}</div>
      </el-col>
      <el-col :span="6"></el-col>
      <el-col :span="6"></el-col>
    </el-row>
    <el-row>
      <el-col :span="24"><div class="grid-Blank-line"></div></el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div>BUYER:{{ contract.buyer }}</div>
        <div>ADDRESS:{{ contract.buyerAddress }}</div>
        <div style="word-spacing:10px">
          <span v-if="contract.buyerTEL !== ''">TEL:{{ contract.buyerTEL }}</span>&nbsp;
          <span v-if="contract.buyerFAX !== ''">FAX:{{ contract.buyerFAX }}</span>
        </div>
      </el-col>
      <el-col :span="12"></el-col>
    </el-row>
    <el-row>
      <el-col :span="24"><div class="grid-Blank-line"></div></el-col>
    </el-row>
    <el-row class="preview-border-top">
      <el-col :span="6" class="preview-cell"><div>DESCRIPTIONS OF GOODS</div></el-col>
      <el-col :span="6" class="preview-cell"><div>QUANTITY</div></el-col>
      <el-col :span="6" class="preview-cell"><div>UNIT PRICE</div></el-col>
      <el-col :span="6" class="preview-cell"><div>TOTAL AMOUNT</div></el-col>
    </el-row>
    <el-row class="preview-border-left-right-bottom">
      <el-col :span="6" class="preview-cell"><div style="min-height: 1px;"></div></el-col>
      <el-col :span="6" class="preview-cell"><div style="min-height: 1px;"></div></el-col>
      <el-col :span="6" class="preview-cell"><div style="min-height: 1px;"></div></el-col>
      <el-col :span="6" class="preview-cell">
        <div>{{ contract.locations }}</div>
      </el-col>
    </el-row>
    <el-row v-for="(item, index) in contract.offerSheet.products" :key="index">
      <el-col :span="24" class="preview-border-left-right">
        <div class="preview-cell">{{ item.name }}</div>
        <el-row v-for="(quotation, cIndex) in item.quotations" :key="cIndex">
          <el-col :span="6" class="preview-cell">
            <div>{{ quotation.size }}</div>
          </el-col>
          <el-col :span="6" class="preview-cell">
            <div>{{ quotation.quantity + ' ' + item.unit }}</div>
          </el-col>
          <el-col :span="6" class="preview-cell">
            <div>{{ 'USD ' + quotation.price + ' / ' + item.unit }}</div>
          </el-col>
          <el-col :span="6" class="preview-cell">
            <div>{{ 'USD ' + quotation.total }}</div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="preview-border-left-right" v-for="(item, index) in contract.offerSheet.attachs" :key="index">
      <el-col :span="18" class="preview-cell">
        <div>{{ item.title }}</div>
      </el-col>
      <el-col :span="6" class="preview-cell">
        <div>{{ 'USD ' + item.amount }}</div>
      </el-col>
    </el-row>
    <el-row class="preview-border-top">
      <el-col :span="6" class="preview-cell">
        <div>TOTAL:</div>
      </el-col>
      <el-col :span="6" class="preview-cell">
        <div>{{ contract.offerSheet.count }}</div>
      </el-col>
      <el-col :span="6" class="preview-cell">
        <div style="min-height: 1px;"></div>
      </el-col>
      <el-col :span="6" class="preview-cell">
        <div style="word-spacing:2px">USD {{ contract.offerSheet.sum }}</div>
      </el-col>
    </el-row>
    <el-row class="preview-border-left-right-bottom">
      <el-col :span="24" class="preview-cell"><div>PLEASE FILL IN THE AMOUNT IN CAPITALS!</div></el-col>
    </el-row>
    <el-row class="preview-border-left-right">
      <el-col :span="24" class="preview-cell"><div>TERM OF PAYMENT: {{ contract.payment }}</div></el-col>
    </el-row>
    <el-row class="preview-border-left-right">
      <el-col :span="24" class="preview-cell"><div>COUNTRY OF ORIGIN: P.R. CHINA.</div></el-col>
    </el-row>
    <el-row class="preview-border-left-right">
      <el-col :span="24" class="preview-cell"><div>PACKING: {{ contract.packaging }}</div></el-col>
    </el-row>
    <el-row class="preview-border-left-right">
      <el-col :span="24" class="preview-cell"><div>PORT OF LOADING: {{ contract.loading }}</div></el-col>
    </el-row>
    <el-row class="preview-border-left-right">
      <el-col :span="24" class="preview-cell"><div>PORT OF DESTINATION: {{ contract.destination }}</div></el-col>
    </el-row>
    <el-row class="preview-border-left-right">
      <el-col :span="24" class="preview-cell"><div>VALIDITY OF OFFER: BY {{ getInvoiceValidity() }}</div></el-col>
    </el-row>
    <el-row class="preview-border-left-right">
      <el-col :span="24" class="preview-cell"><div>DELIVERY TIME:  IN ABOUT 2-3 WEEKS AFTER RECEIVE THE DEPOSIT.</div></el-col>
    </el-row>
    <el-row class="preview-border-left-right">
      <el-col :span="24" class="preview-cell"><div>INSURANCE: INVOICE VALUE PLUS 10% COVERING ALL RISKS TO BE COVERED BY THE SELLER.</div></el-col>
    </el-row>
    <el-row class="preview-border-left-right-bottom">
      <el-col :span="24" class="preview-cell"><div>MORE OR LESS CLAUSE: 2% MORE OR LESS OF LOADING QUANTITY IS ALLOWED.</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="preview-cell"><div>WE HEREBY CERTIFY THAT THE ABOVE MENTIONED GOODS ARE OF CHINESE ORIGIN.</div></el-col>
    </el-row>
  </div>
</template>
<script>
import Contract from './Contract'

export default {
  name: 'IP',
  props: {
    contract: {
      type: Object,
      required: true
    }
  },
  methods: {
    // 导出发票
    exportInvoiceExcel() {
      console.log('exportInvoiceExcel')
      Contract.exportInvoice(this.contract, this.$XEUtils)
    },
    // 获取发票的有效期
    getInvoiceValidity() {
      console.log('getInvoiceValidity')
      Contract.getValidity(this.contract, this.$XEUtils)
    }
  }
}
</script>
<style lang="less" scoped>
.grid-Blank-line {
  min-height: 16px;
}

.preview-div {
  font-size: 12px;
  font-weight: 500;
}

// 边框
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

.preview-border-left-right {
  border-left-color: #000;
  border-left-width: 1px;
  border-left-style: solid;

  border-right-color: #000;
  border-right-width: 1px;
  border-right-style: solid;
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
.preview-border-top {
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

.preview-right {
  border-right-color: #000;
  border-right-width: 1px;
  border-right-style: solid;
}

.preview-left {
  border-left-color: #000;
  border-left-width: 1px;
  border-left-style: solid;
}

// 段落
.preview-paragraph {
  padding-bottom: 4px;
}

// 表格
.preview-cell {
  padding-left: 2px;
  padding-top: 2px;
  padding-bottom: 2px;
}
</style>
