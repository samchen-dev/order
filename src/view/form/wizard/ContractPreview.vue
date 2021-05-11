<template>
  <!-- 合同预览 -->
  <div class="preview-div" ref="print">
    <el-row>
      <el-col :span="8">
        <div style="min-height: 1px;"></div>
      </el-col>
      <el-col :span="8">
        <div style="text-align:center; font-size:20px; font-weight:bold; min-height: 40px;">SALES CONTRACT</div>
      </el-col>
      <el-col :span="8">
        <div style="text-align:right;">
          <el-button-group>
            <el-button size="mini" disabled>PDF 导出</el-button>
            <el-button size="mini" @click="exportExcel()">Excel 导出</el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div>SELLER:{{ contract.seller }}</div>
        <div>ADDRESS:{{ contract.sellerAddress }}</div>
        <div style="word-spacing:10px">
          <span v-if="contract.sellerTEL !== ''">TEL:{{ contract.sellerTEL }}</span> <span v-if="contract.sellerFAX !== ''">FAX:{{ contract.sellerFAX }}</span>
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
        <div>BUYER:{{ contract.buyer }}</div>
        <div>ADDRESS:{{ contract.buyerAddress }}</div>
        <div style="word-spacing:10px">
          <span v-if="contract.buyerTEL !== ''">TEL:{{ contract.buyerTEL }}</span> <span v-if="contract.buyerFAX !== ''">FAX:{{ contract.buyerFAX }}</span>
        </div>
      </el-col>
      <el-col :span="12"></el-col>
    </el-row>
    <el-row>
      <el-col :span="24"><div class="grid-Blank-line"></div></el-col>
    </el-row>
    <el-row>
      <el-col :span="24"
        ><div class="preview-paragraph">
          THIS CONTRACT IS MADE BY AND AGREED BETWEEN THE SELLER AND BUYER, IN ACCORDANCE WITH THE TERMS AND CONDITIONS STIPULATED BELOW:
        </div></el-col
      >
    </el-row>
    <el-row>
      <el-col :span="24"><div class="preview-paragraph">1. SPECIFICATION, QUANTITY AND PRICE:</div></el-col>
    </el-row>
    <el-row class="preview-border-top">
      <el-col :span="6" class="preview-cell"><div>DESCRIPTIONS OF GOODS</div></el-col>
      <el-col :span="6" class="preview-cell"><div>QUANTITY</div></el-col>
      <el-col :span="6" class="preview-cell"><div>UNIT PRICE</div></el-col>
      <el-col :span="6" class="preview-cell"><div>TOTAL AMOUNT</div></el-col>
    </el-row>
    <el-row class="preview-border-left-right-bottom">
      <el-col :span="6" class="preview-cell">
        <div style="min-height: 1px;"></div>
      </el-col>
      <el-col :span="6" class="preview-cell">
        <div style="min-height: 1px;"></div>
      </el-col>
      <el-col :span="6" class="preview-cell">
        <div style="min-height: 1px;"></div>
      </el-col>
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
    <el-row>
      <el-col :span="24">
        <div class="preview-paragraph">
          2. INSURANCE: INVOICE VALUE PLUS 10% COVERING ALL RISKS TO BE COVERED BY THE SELLER.
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="preview-paragraph">3. PACKING:{{ contract.packaging }}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="preview-paragraph">
          4. MARKS: SELLER’S PACKING.THE MARKS WITHOUT “MADE IN CHINA” OR SPECIAL MARKS SHOWED ON PACKAGE AS THE BUYER'S REQUEST, THE BUYER SHALL BE
          LIABLE FOR ALL THE CONSEQUENCE AND EXPENSES IF ANY.
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="preview-paragraph">
          5. PORT OF LOADING: {{ contract.loading }}
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="preview-paragraph">
          6. PORT OF DESTINATION: {{ contract.destination }}.
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="preview-paragraph">
          7. TERMS OF PAYMENT: {{ contract.payment }}
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24"><div class="preview-paragraph">8. DELIVERY TIME: IN ABOUT 30 WORKING DAYS AFTER THE SIGNED SALES CONTRACT.</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="24"><div class="preview-paragraph">9. MORE OR LESS CLAUSE: 2% MORE OR LESS OF LOADING QUANTITY IS ALLOWED.</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="preview-paragraph">
          10. IF THE FLUCTUATION OF SEA FREIGHT IS ABOVE 30% BETWEEN THE CONTRACT DATE AND THE DELIVERY DATE, THE FREIGHT COST SHOULD BE SETTLED
          THROUGH NEGOTIATION.
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="preview-paragraph">
          11. SHIPPING DOCS: THE REQUESTED CUSTOM CLEARANCE DOCS SHOULD BE INFORMED BEFORE THE SHIPMENT. IF BUYER PROPOSE TO MODIFY OR REQUEST
          ADDITATIONAL DOCS AFTER THE SHIPMENT, THE ADDITIONAL COSTS AND RESPONSIBILITY SHALL BE BORNE BY THE BUYER. THE SHIPPING DOCUMENTS SHALL NOT
          BE SENT OUT DUE TO THE DELAY PAYMENT FROM THE BUYER, THE BUYER SHALL BE LIABLE FOR ALL THE CONSEQUENCE AND EXPENSES IF ANY.
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="preview-paragraph">
          12. FORCE MAJEURE: THE DELAYS OF DELIVERY OR NON-DELIVERY CAUSED BY THE FORCE MAJEURE OCCURRED DURING PRODUCTION OR SHIPMENT TRANSSHIPMENT
          PROCESS (INCLUDING WAR, SERIOUS FIRE, FLOOD, TYPHOON, EARTHQUAKE, STRIKES, WEATHER CONDITION, ENVIRONMENTAL PROTECTION CONDITION,
          GOVERNMENTAL ACTION AND THE OTHER INDIRECT THIRD PARTY EFFECT), THE SELLERS ARE NOT RESPONSIBLE FOR THE DELAYS OR NON-DELIVERY IN THE EVENT
          OF FORCE MAJEURE AND ANY CONTIGENCIES BEYOND THE SELLERS’ CONTROL. THE SELLER SHALL HAVE THE ADDITIONAL TIME NEEDED TO COMPLETE THE ORDER
          AND /OR THE RIGHT TO ALLOCATE THE AVAILABLE SUPPLY IN ANY MANNER IF SELECTS.
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="preview-paragraph">
          13. CLAIM: CLAIMS FOR DAMAGE, QUANTITY AND QUALITY ISSUES SHOULD BE FILED BY THE BUYERS WITH THE SELLERS WITHIN 21 DAYS AFTER THE ARRIVAL OF
          THE GOODS AT DESTINATION PORT OR PLACE SUBJECT TO ITEM 6, AND SUPPORTED BY SUFFICIENT EVIDENCE FOR SELLERS REFERENCE. OTHERWISE, SUCH CLAIMS
          SHALL BE DEEMED WAIVED. ANY SHIPPING COSTS RELATED TO ANY APPROVED EXCHANGE OR REPLACEMENT OF PRODUCTS WILL BE AT THE EXPENSE OF THE BUYER.
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="preview-paragraph">
          14. ARBITRATION: ALL DISPUTES ARISING FROM THE EXECUTION OF OR IN CONNECTION WITH THIS CONTRACT, SHALL BE SETTLED AMICABLY THROUGH FRIENDLY
          NEGOTIATION. IN CASE NO SETTLEMENT CAN BE REACHED THROUGH NEGOTIATION, THE CASE SHALL THEN BE SUBMITTED TO CHINA INTERNATIONAL ECONOMIC AND
          TRADE ARBITRATION COMMISSION (CIETAC) IN ACCORDANCE WITH ITS PROVISIONAL RULES OF PROCEDURE. THE ARBITRAL AWARD IS FINAL AND BINDING UPON
          BOTH PARTIES. THE ARBITRATION FEES SHALL BE BORNE BY THE LOSING PARTY.
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24"><div style="min-height:30px;"></div></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"><div>SIGNED BY THE SELLER</div></el-col>
      <el-col :span="12"><div>SIGNED BY THE BUYER</div></el-col>
    </el-row>
  </div>
</template>
<script>
import Contract from './Contract'

export default {
  name: 'CP',
  props: {
    contract: {
      type: Object,
      required: true
    }
  },
  methods: {
    // 导出 SALES CONTRACT Excel
    exportExcel() {
      Contract.exportContract(this.contract)
    },
    printPDF() {
      this.$Print(this.$refs.print)
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
