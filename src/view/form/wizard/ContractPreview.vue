<template>
  <!-- 合同预览 -->
  <div>
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
    <el-row v-for="(item, index) in contract.offerSheet.products">
      <el-col :span="24" class="preview-border-left-right">
        <div class="preview-cell">{{ item.name }}</div>
        <el-row v-for="(quotation, cIndex) in item.quotations">
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
    <el-row class="preview-border-left-right" v-for="(item, index) in contract.offerSheet.attachs">
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
import OrderInfo from '../OrderInfo'

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
      const borderAll = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      }
      const borderLeft = {
        left: { style: 'thin' }
      }
      const borderRight = {
        right: { style: 'thin' }
      }
      const borderLeftRight = {
        left: { style: 'thin' },
        right: { style: 'thin' }
      }
      const borderLeftTop = {
        top: { style: 'thin' },
        left: { style: 'thin' },
      }
      const borderTop = {
        top: { style: 'thin' }
      }
      const borderTopRight = {
        top: { style: 'thin' },
        right: { style: 'thin' }
      }
      const borderLeftRightBottom = {
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrap_text: true
        }
      }
      const borderFontRed = {
        color: { rgb: 'FF0000' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
      }
      let SBM = ''
      if (this.contract.PO === '') {
        SBM = `S/C NO.:${this.contract.orderID}\nDATE:${this.contract.orderDate}\nPLACE:${this.contract.location}`
      } else {
        SBM = `S/C NO.:${this.contract.orderID}\nPO.:${this.contract.PO}\nDATE:${this.contract.orderDate}\nPLACE:${this.contract.location}`
      }
      const ws_data = [
        // 添加合同条款
        ['SALES CONTRACT'],
        [''],
        [`SELLER: ${this.contract.seller}`, '', '', SBM],
        [`ADDRESS: ${this.contract.sellerAddress}`],
        [`TEL: ${this.contract.sellerTEL} FAX: ${this.contract.sellerFAX}`],
        [''],
        [`BUYER: ${this.contract.buyer}`],
        [`ADDRESS: ${this.contract.buyerAddress}`],
        [`TEL: ${this.contract.buyerTEL} FAX: ${this.contract.buyerFAX}`],
        [''],
        [OrderInfo.Terms[0]],
        [OrderInfo.Terms[1]],
        [
          { v: 'DESCRIPTIONS OF GOODS', s: borderAll },
          { v: 'QUANTITY', s: borderAll },
          { v: 'UNIT PRICE', s: borderAll },
          { v: 'TOTAL AMOUNT (USD)', s: borderAll }
        ]
      ]
      // 添加合同产品价格
      // 计算合并的偏移量
      let i = 0
      console.log('this.contract.offerSheet.products:', this.contract.offerSheet.products.length)
      for (const product of this.contract.offerSheet.products) {
        if (product.name.length > 0) {
          if (i === 0) {
            ws_data.push(
              [
                { v: product.name, s: borderLeftRight },
                { v: '', s: borderLeftRight },
                { v: this.contract.locations, s: borderLeftRightBottom },
                { v: '', s: borderLeftRightBottom }]
            )
          } else {
            ws_data.push(
              [
                { v: product.name, s: borderLeftRight },
                { v: '', s: borderLeftRight },
                { v: '', s: borderLeftRight },
                { v: '', s: borderLeftRight }
              ]
            )
          }
          i += 1
        }
        for (const quotation of product.quotations) {
          console.log('quotation.total:', quotation.total)
          ws_data.push(
            [
              { v: quotation.size, s: borderLeftRight },
              { v: `${quotation.quantity} ${product.unit}`, s: borderLeftRight },
              { v: `USD ${quotation.price} / ${product.unit}`, s: borderLeftRight },
              { v: quotation.total, t: 'n', z: '#,##0.00', s: borderLeftRight }
            ]
          )
          i += 1
        }
      }
      // 添加合同附加条款
      for (const attach of this.contract.offerSheet.attachs) {
        ws_data.push(
          [
            { v: attach.title, s: borderLeftTop },
            { v: '', s: borderTop },
            { v: '', s: borderTopRight },
            { v: attach.amount, t: 'n', z: '#,##0.00', s: borderTopRight }
          ]
        )
        i += 1
      }
      // 添加总价总数量
      ws_data.push(
        [
          { v: 'TOTAL:', s: borderAll },
          { v: this.contract.offerSheet.count, s: borderAll },
          { v: '', s: borderAll },
          { v: `${this.contract.offerSheet.sum}`, t: 'n', z: '#,##0.00', s: borderAll }
        ],
        [
          { v: 'PLEASE FILL IN THE AMOUNT IN CAPITALS!', s: borderFontRed },
          { v: '', s: borderAll },
          { v: '', s: borderAll },
          { v: '', s: borderAll }
        ]
      )
      // 添加合同条款
      ws_data.push([OrderInfo.Terms[2]])
      ws_data.push([OrderInfo.Terms[3] + this.contract.packaging])
      ws_data.push([OrderInfo.Terms[4]])
      ws_data.push([OrderInfo.Terms[5] + this.contract.loading])
      ws_data.push([OrderInfo.Terms[6] + this.contract.destination])
      ws_data.push([OrderInfo.Terms[7] + this.contract.payment])
      ws_data.push([OrderInfo.Terms[8]])
      ws_data.push([OrderInfo.Terms[9]])
      ws_data.push([OrderInfo.Terms[10]])
      ws_data.push([OrderInfo.Terms[11]])
      ws_data.push([OrderInfo.Terms[12]])
      ws_data.push([OrderInfo.Terms[13]])
      ws_data.push([OrderInfo.Terms[14]])
      ws_data.push([''])
      ws_data.push([OrderInfo.Terms[15], '', OrderInfo.Terms[16], ''])
      ws_data.push([''])
      ws_data.push([''])
      const ws = this.$XLSX.utils.aoa_to_sheet(ws_data)
      const merges = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // 合并标题
        { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } }, // 合并卖方名称
        { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } }, // 合并卖方地址
        { s: { r: 4, c: 0 }, e: { r: 4, c: 1 } }, // 合并卖方联系方式
        { s: { r: 6, c: 0 }, e: { r: 6, c: 1 } }, // 合并买方名称
        { s: { r: 7, c: 0 }, e: { r: 7, c: 1 } }, // 合并买方地址
        { s: { r: 8, c: 0 }, e: { r: 8, c: 1 } }, // 合并买方联系方式
        { s: { r: 2, c: 3 }, e: { r: 4, c: 3 } }, // 合并合同时间、编号、地点、PO编号单元格
        { s: { r: 10, c: 0 }, e: { r: 10, c: 3 } },
        { s: { r: 11, c: 0 }, e: { r: 11, c: 3 } },
        { s: { r: 14 + i, c: 0 }, e: { r: 14 + i, c: 3 } },
        { s: { r: 15 + i, c: 0 }, e: { r: 15 + i, c: 3 } },
        { s: { r: 16 + i, c: 0 }, e: { r: 16 + i, c: 3 } },
        { s: { r: 17 + i, c: 0 }, e: { r: 17 + i, c: 3 } },
        { s: { r: 18 + i, c: 0 }, e: { r: 18 + i, c: 3 } },
        { s: { r: 19 + i, c: 0 }, e: { r: 19 + i, c: 3 } },
        { s: { r: 20 + i, c: 0 }, e: { r: 20 + i, c: 3 } },
        { s: { r: 21 + i, c: 0 }, e: { r: 21 + i, c: 3 } },
        { s: { r: 22 + i, c: 0 }, e: { r: 22 + i, c: 3 } },
        { s: { r: 23 + i, c: 0 }, e: { r: 23 + i, c: 3 } },
        { s: { r: 24 + i, c: 0 }, e: { r: 24 + i, c: 3 } },
        { s: { r: 25 + i, c: 0 }, e: { r: 25 + i, c: 3 } },
        { s: { r: 26 + i, c: 0 }, e: { r: 26 + i, c: 3 } },
        { s: { r: 27 + i, c: 0 }, e: { r: 27 + i, c: 3 } },
        { s: { r: 28 + i, c: 0 }, e: { r: 28 + i, c: 3 } }
      ]
      // 合并交货方式需要的空间
      if (i > 0) {
        merges.push({ s: { r: 13, c: 2 }, e: { r: 13, c: 3 } })
      }
      ws['!merges'] = merges
      ws['!sheetFormat'] = {
        row: {
          hpx: 20
        }
      }
      ws['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 20 }]
      const rows = []
      rows[3] = { hpx: 30 }
      rows[7] = { hpx: 30 }
      rows[10] = { hpx: 30 }
      rows[17 + i] = { hpx: 30 }
      rows[20 + i] = { hpx: 45 }
      rows[23 + i] = { hpx: 30 }
      rows[24 + i] = { hpx: 75 }
      rows[25 + i] = { hpx: 105 }
      rows[26 + i] = { hpx: 75 }
      rows[27 + i] = { hpx: 90 }
      ws['!rows'] = rows
      this.$XLSX.utils.sheet_set_range_style(ws, 'A1:D1', {
        name: 'Times New Roman',
        sz: 14,
        bold: true,
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: true
        }
      })
      this.$XLSX.utils.sheet_set_range_style(ws, 'A2:D100', {
        name: 'Times New Roman',
        sz: 8,
        bold: true,
        alignment: {
          vertical: 'center',
          wrapText: true
        }
      })
      this.$XLSX.utils.sheet_set_range_style(ws, 'D3:D5', {
        alignment: {
          horizontal: 'left',
          vertical: 'top',
          wrapText: true
        }
      })
      const wb = this.$XLSX.utils.book_new()
      this.$XLSX.utils.book_append_sheet(wb, ws, 'sheet1')
      this.$XLSX.writeFile(
        wb,
        `SALES CONTRACT -${this.contract.orderID}.xlsx`,
        { bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true }
      )
      console.log('ws', ws)
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
