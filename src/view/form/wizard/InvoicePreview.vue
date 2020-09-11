<template>
  <!-- 发票预览 -->
  <div>
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
          <span v-if="contract.buyerTEL !== ''">TEL:{{ contract.buyerTEL }}</span> <span v-if="contract.buyerFAX !== ''">FAX:{{ contract.buyerFAX }}</span>
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
      <el-col :span="24" class="preview-cell"><div>VALIDITY OF OFFER: BY {{ getValidity() }}</div></el-col>
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
export default {
  name: 'IP',
  props: {
    contract: {
      type: Object,
      required: true
    }
  },
  methods: {
    exportInvoiceExcel() {
      console.log('exportInvoice')
      const borderAll = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
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
      const borderLeftBottom = {
        color: { rgb: 'FF0000' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
      }
      const borderRightBottom = {
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      }
      const borderBottom = {
        bottom: { style: 'thin' },
      }
      let SBM = ''
      if (this.contract.PO === '') {
        SBM = `S/C NO.:${this.contract.orderID}\nDATE:${this.contract.orderDate}\nPLACE:${this.contract.location}`
      } else {
        SBM = `S/C NO.:${this.contract.orderID}\nPO.:${this.contract.PO}\nDATE:${this.contract.orderDate}\nPLACE:${this.contract.location}`
      }
      const ws_data = [
        // 添加发票条款
        [`${this.contract.seller}`],
        [''],
        ['PROFORMA INVOICE'],
        [''],
        [`SELLER: ${this.contract.seller}`, '', '', { v: SBM, s:{alignment: { horizontal: 'left', vertical: 'top' } } }],
        [`ADDRESS: ${this.contract.sellerAddress}`],
        [`TEL: ${this.contract.sellerTEL} FAX: ${this.contract.sellerFAX}`],
        [''],
        [`SELLER’S BANK INFO:\n${this.contract.bank}`],
        [''],
        [`BUYER: ${this.contract.buyer}`],
        [`ADDRESS: ${this.contract.buyerAddress}`],
        [`TEL: ${this.contract.buyerTEL} FAX: ${this.contract.buyerFAX}`],
        [''],
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
        ws_data.push([
          { v: attach.title, s: borderLeftTop },
          { v: '', s: borderTop },
          { v: '', s: borderTopRight },
          { v: attach.amount, t: 'n', z: '#,##0.00', s: borderTopRight }
        ])
        i += 1
      }
      // 添加总价总数量
      ws_data.push([
        { v: 'TOTAL:', s: borderAll },
        { v: this.contract.offerSheet.count, s: borderAll },
        { v: '', s: borderAll },
        { v: `${this.contract.offerSheet.sum}`, t: 'n', z: '#,##0.00', s: borderAll }
      ])
      ws_data.push(
        [{ v: 'PLEASE FILL IN THE AMOUNT IN CAPITALS!', s: borderLeftBottom }, { v: '', s: borderBottom }, { v: '', s: borderBottom }, { v: '', s: borderRightBottom }],
        [{ v: `TERM OF PAYMENT:${this.contract.payment}` }],
        [{ v: 'COUNTRY OF ORIGIN: P.R. CHINA.' }],
        [{ v: `PACKING:${this.contract.packaging}` }],
        [{ v: `PORT OF LOADING:${this.contract.loading}` }],
        [{ v: `PORT OF DISCHARGE:${this.contract.destination}` }],
        [{ v: `VALIDITY OF OFFER: BY ${this.getValidity()}` }],
        [{ v: 'DELIVERY TIME:  IN ABOUT 30 WORKING DAYS AFTER THE SIGNED CONTRACT.' }],
        [{ v: 'INSURANCE: INVOICE VALUE PLUS 10% COVERING ALL RISKS TO BE COVERED BY THE SELLER.' }],
        [{ v: 'MORE OR LESS CLAUSE: 2% MORE OR LESS OF LOADING QUANTITY IS ALLOWED.' }],
        [{ v: 'WE HEREBY CERTIFY THAT THE ABOVE MENTIONED GOODS ARE OF CHINESE ORIGIN.' }]
      )
      // 添加发票条款
      ws_data.push([''])
      const ws = this.$XLSX.utils.aoa_to_sheet(ws_data)
      const merges = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // 合并标题
        { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } }, // 合并副标题
        { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } },
        { s: { r: 4, c: 0 }, e: { r: 4, c: 1 } }, // 合并卖方
        { s: { r: 5, c: 0 }, e: { r: 5, c: 1 } }, // 合并卖方地址
        { s: { r: 6, c: 0 }, e: { r: 6, c: 1 } }, // 合并卖方联系方式
        { s: { r: 4, c: 3 }, e: { r: 6, c: 3 } }, // 合并编号、日期、PO、日期
        { s: { r: 8, c: 0 }, e: { r: 8, c: 3 } },
        { s: { r: 10, c: 0 }, e: { r: 10, c: 1 } }, // 合并买方
        { s: { r: 11, c: 0 }, e: { r: 11, c: 1 } }, // 合并买方地址
        { s: { r: 12, c: 0 }, e: { r: 12, c: 1 } }, // 合并买方联系方式
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
      ]
      // 合并交货方式需要的空间
      if (i > 0) {
        merges.push({ s: { r: 15, c: 2 }, e: { r: 15, c: 3 } })
      }
      ws['!merges'] = merges
      ws['!sheetFormat'] = {
        row: {
          hpx: 20
        }
      }
      ws['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 20 }]
      const rows = []
      rows[1] = { hpx: 15 }
      rows[3] = { hpx: 15 }
      rows[5] = { hpx: 30 }
      rows[7] = { hpx: 10 }
      rows[8] = { hpx: 85 }
      rows[9] = { hpx: 10 }
      rows[11] = { hpx: 30 }
      rows[17 + i] = { hpx: 45 }
      ws['!rows'] = rows
      this.$XLSX.utils.sheet_set_range_style(ws, 'A1:D4', {
        name: 'Times New Roman',
        sz: 14,
        bold: true,
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: true
        }
      })
      this.$XLSX.utils.sheet_set_range_style(ws, 'A5:D100', {
        name: 'Times New Roman',
        sz: 8,
        bold: true,
        alignment: {
          vertical: 'center',
          wrapText: true
        }
      })
      this.$XLSX.utils.sheet_set_range_style(ws, 'D4:D6', {
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
        `PROFORMA INVOICE -${this.contract.orderID}.xlsx`,
        { bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true }
      )
      console.log('ws', ws)
    },
    // 获取发票有效期时间
    getValidity() {
      console.log('getValidity')
      const date = new Date(this.contract.orderDate)
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
      const dateStr = this.$XEUtils.toDateString(date, 'yyyy-MM-dd')
      return dateStr
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
