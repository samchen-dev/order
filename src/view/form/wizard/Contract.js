import XLSX from '@sheet/image'
import OrderInfo from '../OrderInfo'

// 获取发票有效期时间
function getValidity(contract, XEUtils) {
  console.log('getValidity')
  const date = new Date(contract.orderDate)
  date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
  const dateStr = XEUtils.toDateString(date, 'yyyy-MM-dd')
  return dateStr
}
// 创建合同
function createContract(contract) {
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
  const borderFontRed = {
    color: { rgb: 'FF0000' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
  }
  let SBM = ''
  if (contract.PO === '') {
    SBM = `S/C NO.:${contract.orderID}\nDATE:${contract.orderDate}\nPLACE:${contract.location}`
  } else {
    SBM = `S/C NO.:${contract.orderID}\nPO.:${contract.PO}\nDATE:${contract.orderDate}\nPLACE:${contract.location}`
  }
  const wsData = [
    // 添加合同条款
    ['SALES CONTRACT'],
    [''],
    [`SELLER: ${contract.seller}`, '', '', SBM],
    [`ADDRESS: ${contract.sellerAddress}`],
    [`TEL: ${contract.sellerTEL} FAX: ${contract.sellerFAX}`],
    [''],
    [`BUYER: ${contract.buyer}`],
    [`ADDRESS: ${contract.buyerAddress}`],
    [`TEL: ${contract.buyerTEL} FAX: ${contract.buyerFAX}`],
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
  console.log('contract.offerSheet.products:', contract.offerSheet.products.length)
  for (const product of contract.offerSheet.products) {
    if (product.name.length > 0) {
      if (i === 0) {
        wsData.push(
          [
            { v: product.name, s: borderLeftRight },
            { v: '', s: borderLeftRight },
            { v: contract.locations, s: borderLeftRightBottom },
            { v: '', s: borderLeftRightBottom }]
        )
      } else {
        wsData.push(
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
      wsData.push(
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
  for (const attach of contract.offerSheet.attachs) {
    wsData.push(
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
  wsData.push(
    [
      { v: 'TOTAL:', s: borderAll },
      { v: contract.offerSheet.count, s: borderAll },
      { v: '', s: borderAll },
      { v: `${contract.offerSheet.sum}`, t: 'n', z: '#,##0.00', s: borderAll }
    ],
    [
      { v: 'PLEASE FILL IN THE AMOUNT IN CAPITALS!', s: borderFontRed },
      { v: '', s: borderAll },
      { v: '', s: borderAll },
      { v: '', s: borderAll }
    ]
  )
  // 添加合同条款
  wsData.push([OrderInfo.Terms[2]])
  wsData.push([OrderInfo.Terms[3] + contract.packaging])
  wsData.push([OrderInfo.Terms[4]])
  wsData.push([OrderInfo.Terms[5] + contract.loading])
  wsData.push([OrderInfo.Terms[6] + contract.destination])
  wsData.push([OrderInfo.Terms[7] + contract.payment])
  wsData.push([OrderInfo.Terms[8]])
  wsData.push([OrderInfo.Terms[9]])
  wsData.push([OrderInfo.Terms[10]])
  wsData.push([OrderInfo.Terms[11]])
  wsData.push([OrderInfo.Terms[12]])
  wsData.push([OrderInfo.Terms[13]])
  wsData.push([OrderInfo.Terms[14]])
  wsData.push([''])
  wsData.push([OrderInfo.Terms[15], '', OrderInfo.Terms[16], ''])
  wsData.push([''])
  wsData.push([''])
  const ws = XLSX.utils.aoa_to_sheet(wsData)
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
  XLSX.utils.sheet_set_range_style(ws, 'A1:D1', {
    name: 'Times New Roman',
    sz: 14,
    bold: true,
    alignment: {
      horizontal: 'center',
      vertical: 'center',
      wrapText: true
    }
  })
  XLSX.utils.sheet_set_range_style(ws, 'A2:D100', {
    name: 'Times New Roman',
    sz: 8,
    bold: true,
    alignment: {
      vertical: 'center',
      wrapText: true
    }
  })
  XLSX.utils.sheet_set_range_style(ws, 'D3:D5', {
    alignment: {
      horizontal: 'left',
      vertical: 'top',
      wrapText: true
    }
  })
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'sheet1')
  return wb
}
// 导出合同，并下载
function exportContract(contract) {
  console.log('exportContract')
  const wb = createContract(contract)
  XLSX.writeFile(
    wb,
    `SALES CONTRACT -${contract.orderID}.xlsx`,
    { bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true }
  )
}
// 导出合同到内存文件中
function exportMemoryContract(contract) {
  console.log('exportMemoryContract')
  const wb = createContract(contract)
  return XLSX.write(
    wb,
    { bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true }
  )
}
// 创建发票
function createInvoice(contract, XEUtils) {
  console.log('createInvoice')
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
    bottom: { style: 'thin' },
    left: { style: 'thin' },
  }
  const borderLeftBottomFont = {
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
  if (contract.PO === '') {
    SBM = `S/C NO.:${contract.orderID}\nDATE:${contract.orderDate}\nPLACE:${contract.location}`
  } else {
    SBM = `S/C NO.:${contract.orderID}\nPO.:${contract.PO}\nDATE:${contract.orderDate}\nPLACE:${contract.location}`
  }
  const wsData = [
    // 添加发票条款
    [`${contract.seller}`],
    [''],
    ['PROFORMA INVOICE'],
    [''],
    [`SELLER: ${contract.seller}`, '', '', { v: SBM, s: { alignment: { horizontal: 'left', vertical: 'top' } } }],
    [`ADDRESS: ${contract.sellerAddress}`],
    [`TEL: ${contract.sellerTEL} FAX: ${contract.sellerFAX}`],
    [''],
    [`SELLER’S BANK INFO:\n${contract.bank}`],
    [''],
    [`BUYER: ${contract.buyer}`],
    [`ADDRESS: ${contract.buyerAddress}`],
    [`TEL: ${contract.buyerTEL} FAX: ${contract.buyerFAX}`],
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
  console.log('contract.offerSheet.products:', contract.offerSheet.products.length)
  for (const product of contract.offerSheet.products) {
    if (product.name.length > 0) {
      if (i === 0) {
        wsData.push(
          [
            { v: product.name, s: borderLeftRight },
            { v: '', s: borderLeftRight },
            { v: contract.locations, s: borderLeftRightBottom },
            { v: '', s: borderLeftRightBottom }]
        )
      } else {
        wsData.push(
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
      wsData.push(
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
  for (const attach of contract.offerSheet.attachs) {
    wsData.push([
      { v: attach.title, s: borderLeftTop },
      { v: '', s: borderTop },
      { v: '', s: borderTopRight },
      { v: attach.amount, t: 'n', z: '#,##0.00', s: borderTopRight }
    ])
    i += 1
  }
  // 添加总价总数量
  wsData.push([
    { v: 'TOTAL:', s: borderAll },
    { v: contract.offerSheet.count, s: borderAll },
    { v: '', s: borderAll },
    { v: `${contract.offerSheet.sum}`, t: 'n', z: '#,##0.00', s: borderAll }
  ])
  wsData.push(
    [
      { v: 'PLEASE FILL IN THE AMOUNT IN CAPITALS!', s: borderLeftBottomFont },
      { v: '', s: borderBottom },
      { v: '', s: borderBottom },
      { v: '', s: borderRightBottom }
    ],
    [
      { v: `TERM OF PAYMENT:${contract.payment}`, s: borderLeftRight },
      { v: '', s: borderLeftRight },
      { v: '', s: borderLeftRight },
      { v: '', s: borderLeftRight },
    ],
    [
      { v: 'COUNTRY OF ORIGIN: P.R. CHINA.', s: borderLeftRight },
      { v: '', s: borderLeftRight },
      { v: '', s: borderLeftRight },
      { v: '', s: borderLeftRight }
    ],
    [
      { v: `PACKING:${contract.packaging}`, s: borderLeftRight },
      { v: '', s: borderLeftRight },
      { v: '', s: borderLeftRight },
      { v: '', s: borderLeftRight }
    ],
    [
      { v: `PORT OF LOADING:${contract.loading}`, s: borderLeftRight },
      { v: '', s: borderLeftRight },
      { v: '', s: borderLeftRight },
      { v: '', s: borderLeftRight }
    ],
    [
      { v: `PORT OF DISCHARGE:${contract.destination}`, s: borderLeftRight },
      { v: '', s: borderLeftRight },
      { v: '', s: borderLeftRight },
      { v: '', s: borderLeftRight }
    ],
    [
      { v: `VALIDITY OF OFFER: BY ${getValidity(contract, XEUtils)}`, s: borderLeftRight },
      { v: '', s: borderLeftRight },
      { v: '', s: borderLeftRight },
      { v: '', s: borderLeftRight }
    ],
    [
      { v: 'DELIVERY TIME:  IN ABOUT 30 WORKING DAYS AFTER THE SIGNED CONTRACT.' },
      { v: '', s: borderLeftRight },
      { v: '', s: borderLeftRight },
      { v: '', s: borderLeftRight }
    ],
    [
      { v: 'INSURANCE: INVOICE VALUE PLUS 10% COVERING ALL RISKS TO BE COVERED BY THE SELLER.' },
      { v: '', s: borderLeftRight },
      { v: '', s: borderLeftRight },
      { v: '', s: borderLeftRight }
    ],
    [
      { v: 'MORE OR LESS CLAUSE: 2% MORE OR LESS OF LOADING QUANTITY IS ALLOWED.', s: borderLeftBottom },
      { v: '', s: borderBottom },
      { v: '', s: borderBottom },
      { v: '', s: borderRightBottom }
    ],
    [{ v: 'WE HEREBY CERTIFY THAT THE ABOVE MENTIONED GOODS ARE OF CHINESE ORIGIN.' }]
  )
  // 添加发票条款
  wsData.push([''])
  const ws = XLSX.utils.aoa_to_sheet(wsData)
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
  XLSX.utils.sheet_set_range_style(ws, 'A1:D4', {
    name: 'Times New Roman',
    sz: 14,
    bold: true,
    alignment: {
      horizontal: 'center',
      vertical: 'center',
      wrapText: true
    }
  })
  XLSX.utils.sheet_set_range_style(ws, 'A5:D100', {
    name: 'Times New Roman',
    sz: 8,
    bold: true,
    alignment: {
      vertical: 'center',
      wrapText: true
    }
  })
  XLSX.utils.sheet_set_range_style(ws, 'D4:D6', {
    alignment: {
      horizontal: 'left',
      vertical: 'top',
      wrapText: true
    }
  })
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'sheet1')
  return wb
}
// 导出发票
function exportInvoice(contract, XEUtils) {
  console.log('exportInvoice')
  const wb = createInvoice(contract, XEUtils)
  XLSX.writeFile(
    wb,
    `PROFORMA INVOICE -${contract.orderID}.xlsx`,
    { bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true }
  )
}
// 导出发票到内存文件中
function exportMemoryInvoice(contract, XEUtils) {
  console.log('exportMemoryInvoice')
  const wb = createInvoice(contract, XEUtils)
  return XLSX.write(
    wb,
    { bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true }
  )
}
export default { exportContract, exportInvoice, getValidity, exportMemoryContract, exportMemoryInvoice }
