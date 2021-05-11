import XLSX from '@sheet/image'
import OrderInfo from '../form/OrderInfo'
import Supply from './Supply'

// 返回报关类型
function printCustomsType(make) {
  console.log('printCustomsType', make.current.purchaser, make.current.currencyType)
  // 报关类型
  const customsMap = new Map([
    ['myCompany', { title: '我司报关', value: false }],
    ['proxy', { title: '代理报关', value: false }],
    ['factory', { title: '工厂报关', value: false }],
    ['other', { title: '其它,经理确认', value: false }]
  ])

  if (make.current.purchaser === OrderInfo.SinabuddyChineseName[0] && make.current.currencyType === 'RMB') {
    // 判断签单公司名称 HK && RMB 代理报关
    customsMap.set('proxy', { title: '代理报关', value: true })
  } else if (make.current.purchaser === OrderInfo.SinabuddyChineseName[0] && make.current.currencyType === 'USD') {
    // 判断签单公司名称 HK && USD 工厂报关
    customsMap.set('factory', { title: '工厂报关', value: true })
  } else if (make.current.purchaser === OrderInfo.SinabuddyChineseName[1] && make.current.currencyType === 'RMB') {
    // 判断签单公司名称 ZH && USD 我司报关
    customsMap.set('myCompany', { title: '我司报关', value: true })
  } else if (make.current.purchaser === OrderInfo.SinabuddyChineseName[1] && make.current.currencyType === 'USD') {
    // 判断签单公司名称 ZH && USD 工厂报关
    customsMap.set('factory', { title: '工厂报关', value: true })
  } else {
    customsMap.set('other', { title: '其它,经理确认', value: true })
  }
  return customsMap
}

// 下载海运交接单
function exportSupply(make, handover) {
  console.log('exportSupply', make, handover)

  const borderAll = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
  }

  const borderTopLeftBottom = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
  }

  const borderTopRightBottom = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  }

  const borderLeftBottomRight = {
    bottom: { style: 'thin' },
    right: { style: 'thin' },
    left: { style: 'thin' },
  }

  const borderLeftRight = {
    right: { style: 'thin' },
    left: { style: 'thin' },
  }

  const borderTopBottom = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
  }

  // 行高数组
  const rows = []
  rows[0] = { hpx: 40 }
  // 海运货源交接单数据
  const wsData = [
    [
      {
        v: '货源、海运交接单',
        s: {
          ame: '宋体',
          sz: 16,
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: true
          }
        },
      }
    ],
    [
      { v: `合同编号:${make.current.orderID}`, s: borderTopLeftBottom },
      { v: '', s: borderTopRightBottom },
      { v: `交期:${make.current.deliveryDate}`, s: borderTopLeftBottom },
      { v: '', s: borderTopRightBottom },
      { v: `业务员:${handover.user}`, s: borderTopLeftBottom },
      { v: '', s: borderTopRightBottom },
    ],
    [
      { v: `供应商:${make.current.factoryName}`, s: borderTopLeftBottom },
      { v: '', s: borderTopRightBottom },
      { v: '联系人:', s: borderTopLeftBottom },
      { v: '', s: borderTopRightBottom },
      { v: '联系电话:', s: borderTopLeftBottom },
      { v: '', s: borderTopRightBottom },

    ],
  ]

  const productStyle = {
    top: { style: 'thin' },
    right: { style: 'thin' },
    left: { style: 'thin' },
    alignment: {
      horizontal: 'left',
      vertical: 'center',
      wrapText: true
    }
  }
  const productMerge = []
  for (const product of make.target.offerSheet.products) {
    wsData.push([
      { v: `品名:\n${product.chineseName}`, s: productStyle },
      { v: `指标:${product.norm}`, s: productStyle },
      { v: '粒度', s: borderAll },
      { v: '数量', s: borderAll },
      { v: '描述', s: { bottom: { style: 'thin' }, alignment: { horizontal: 'center' } } },
      { v: '', s: { bottom: { style: 'thin' }, right: { style: 'thin' } } },
    ])
    product.quotations.forEach((quotation, index) => {
      wsData.push([
        { v: '', s: index === product.quotations.length - 1 ? borderLeftBottomRight : borderLeftRight },
        { v: '', s: index === product.quotations.length - 1 ? borderLeftBottomRight : borderLeftRight },
        { v: `${quotation.size} ${quotation.norm}`, s: borderAll },
        { v: `${quotation.quantity} ${Supply.getUnit(product.unit, make.current.currencyType)}`, s: borderAll },
        { v: quotation.norm, s: { bottom: { style: 'thin' } } },
        { v: '', s: { bottom: { style: 'thin' }, right: { style: 'thin' } } },
      ])
    })
    // 加一表示粒度、数量、抽检、留样占的高度
    productMerge.push(product.quotations.length)
  }
  // 添加报关类型
  let customsType = ''
  for (const item of printCustomsType(make).entries()) {
    customsType += `${item[1].title}( ${item[1].value ? '√' : ''} )   `
  }
  wsData.push([
    { v: '报关备注:', s: borderAll },
    { v: customsType, s: borderTopLeftBottom },
    { v: '', s: borderTopBottom },
    { v: '', s: borderTopBottom },
    { v: '', s: borderTopBottom },
    { v: '', s: borderTopRightBottom },
  ])

  // 添加到港运费
  wsData.push([
    { v: '到港运费:', s: borderAll },
    {
      v: `发货前和工厂确认( ${make.current.roadTransport === '出厂价' ? '√' : ''})      发货前和工厂确认( ${make.current.roadTransport === '到港价' ? '√' : ''})`,
      s: borderTopLeftBottom
    },
    { v: '', s: borderTopBottom },
    { v: '', s: borderTopBottom },
    { v: '', s: borderTopBottom },
    { v: '', s: borderTopRightBottom },
  ])

  // 添加包装唛头
  make.current.markInfo.forEach((item, index) => {
    if (index === 0) {
      // 添加标题
      wsData.push([
        { v: '包装唛头:', s: { left: { style: 'thin' }, right: { style: 'thin' }, alignment: { vertical: 'center', } } },
        { v: item.mark[0].title, s: { alignment: { horizontal: 'center' } } },
        { v: '' },
        { v: '' },
        { v: item.mark.length > 1 ? item.mark[1].title : '', s: { alignment: { horizontal: 'center' } } },
        { v: '', s: { right: { style: 'thin' } } },
      ])
    } else {
      wsData.push([
        { v: '', s: borderLeftRight },
        { v: item.mark[0].title, s: { alignment: { horizontal: 'center' } } },
        '',
        '',
        item.mark.length > 1 ? { v: item.mark[1].title } : '',
        { v: '', s: { right: { style: 'thin' }, alignment: { horizontal: 'center' } } },
      ])
    }
    // 添加唛头正文
    const infoBorderLeft = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      alignment: {
        horizontal: 'left',
        vertical: 'center',
        wrapText: true
      }
    }
    const infoBorderRight = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
      alignment: {
        horizontal: 'left',
        vertical: 'center',
        wrapText: true
      }
    }
    wsData.push([
      { v: '', s: borderLeftRight },
      { v: item.mark[0].info, s: infoBorderLeft },
      { v: '', s: infoBorderRight },
      '',
      { v: item.mark.length > 1 ? item.mark[1].info : '', s: item.mark.length > 1 ? infoBorderLeft : '' },
      { v: '', s: item.mark.length > 1 ? infoBorderRight : { right: { style: 'thin' } } },
    ])
    // 添加包装提供者
    wsData.push([
      { v: '', s: borderLeftRight },
      { v: `包装提供:${item.mark[0].provider}` },
      '',
      '',
      item.mark.length > 1 ? { v: `包装提供:${item.mark[1].provider}` } : '',
      { v: '', s: { right: { style: 'thin' } } },
    ])
    // 添加包装描述
    wsData.push([
      { v: '', s: index === make.current.markInfo.length - 1 ? borderLeftBottomRight : borderLeftRight },
      { v: `包装:${item.description}`, s: { alignment: { wrapText: true } } },
      '',
      '',
      '',
      { v: '', s: { right: { style: 'thin' } } },
    ])
  })

  // 添加验货时间
  wsData.push([
    { v: '验货时间:', s: borderAll },
    { v: '____年____月____日', s: borderTopLeftBottom },
    { v: '', s: borderTopRightBottom },
    { v: '取样拍照:', s: borderAll },
    { v: '是( )    否( )', s: borderTopLeftBottom },
    { v: '', s: borderTopRightBottom },
  ])

  // 添加抽检、留样
  wsData.push(
    [
      { v: '抽检:', s: { left: { style: 'thin' } } },
      { v: '' },
      { v: '', s: { right: { style: 'thin' } } },
      { v: '留样:' },
      { v: '' },
      { v: '', s: { right: { style: 'thin' } } },
    ],
    [
      { v: '', s: { left: { style: 'thin' } } },
      { v: '' },
      { v: '', s: { right: { style: 'thin' } } },
      { v: '' },
      { v: '' },
      { v: '', s: { right: { style: 'thin' } } },
    ],
    [
      { v: '', s: { left: { style: 'thin' } } },
      { v: '' },
      { v: '', s: { right: { style: 'thin' } } },
      { v: '' },
      { v: '' },
      { v: '', s: { right: { style: 'thin' } } },
    ],
    [
      { v: '', s: { left: { style: 'thin' }, bottom: { style: 'thin' } } },
      { v: '', s: { bottom: { style: 'thin' } } },
      { v: '', s: { right: { style: 'thin' }, bottom: { style: 'thin' } } },
      { v: '', s: { bottom: { style: 'thin' } } },
      { v: '', s: { bottom: { style: 'thin' } } },
      { v: '', s: { right: { style: 'thin' }, bottom: { style: 'thin' } } },
    ]
  )

  const ws = XLSX.utils.aoa_to_sheet(wsData)
  // 合并单元格
  const merges = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // 合并标题行
    { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } }, // 合并合同编号
    { s: { r: 1, c: 2 }, e: { r: 1, c: 3 } }, // 合并合同交期
    { s: { r: 1, c: 4 }, e: { r: 1, c: 5 } }, // 合并业务员
    { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } }, // 合并供应商
    { s: { r: 2, c: 2 }, e: { r: 2, c: 3 } }, // 合并联系人
    { s: { r: 2, c: 4 }, e: { r: 2, c: 5 } }, // 合并联系电话
  ]
  let count = 0
  for (const v of productMerge) {
    // 3表示前面的三行
    merges.push({ s: { r: count === 0 ? 3 : 3 + count, c: 0 }, e: { r: 3 + count + v, c: 0 } })
    merges.push({ s: { r: count === 0 ? 3 : 3 + count, c: 1 }, e: { r: 3 + count + v, c: 1 } })
    // 合并粒度描述
    for (let j = 0; j < v + 1; j += 1) {
      merges.push({ s: { r: 3 + count + j, c: 4 }, e: { r: 3 + count + j, c: 5 } })
    }
    // 加一代表粒度、数量、抽检、留样的高度
    count += v + 1
  }
  // 合并包装唛头单元格
  wsData.forEach((row, index) => {
    // 合并报关备注
    if (row[0].v === '报关备注:') {
      merges.push({ s: { r: index, c: 1 }, e: { r: index, c: 5 } })
    }

    // 合并到港运费
    if (row[0].v === '到港运费:') {
      merges.push({ s: { r: index, c: 1 }, e: { r: index, c: 5 } })
    }

    if (row[0].v === '包装唛头:') {
      make.current.markInfo.forEach((item, i) => {
        // 合并包装标题
        merges.push({ s: { r: index + (i * 4), c: 1 }, e: { r: index + (i * 4), c: 2 } })
        // 合并唛头信息
        merges.push({ s: { r: index + 1 + (i * 4), c: 1 }, e: { r: index + 1 + (i * 4), c: 2 } })
        // 设置唛头信息单元格行高
        rows[index + 1 + (i * 4)] = { hpx: 120 }
        // 合并包装提方
        merges.push({ s: { r: index + 2 + (i * 4), c: 1 }, e: { r: index + 2 + (i * 4), c: 2 } })
        // 设置包装描述高度
        rows[index + 3 + (i * 4)] = { hpx: 80 }
        // 合并唛头描述
        merges.push({ s: { r: index + 3 + (i * 4), c: 1 }, e: { r: index + 3 + (i * 4), c: 5 } })
        // 托盘包装、字母包装合并
        if (item.mark.length > 1) {
          merges.push({ s: { r: index + (i * 4), c: 4 }, e: { r: index + (i * 4), c: 5 } })
          merges.push({ s: { r: index + 1 + (i * 4), c: 4 }, e: { r: index + 1 + (i * 4), c: 5 } })
          merges.push({ s: { r: index + 2 + (i * 4), c: 4 }, e: { r: index + 2 + (i * 4), c: 5 } })
        }
      })
      // 合并包装唛头单元格:
      merges.push({ s: { r: index, c: 0 }, e: { r: index + (make.current.markInfo.length * 4 - 1), c: 0 } })
    }
    if (row[0].v === '验货时间:') {
      merges.push({ s: { r: index, c: 1 }, e: { r: index, c: 2 } })
      merges.push({ s: { r: index, c: 4 }, e: { r: index, c: 5 } })
      merges.push({ s: { r: index + 1, c: 0 }, e: { r: index + 4, c: 2 } })
      merges.push({ s: { r: index + 1, c: 3 }, e: { r: index + 4, c: 5 } })
    }
  })
  console.log(wsData)
  ws['!rows'] = rows
  ws['!merges'] = merges
  // 设置宽度
  ws['!cols'] = [{ wch: 14 }, { wch: 15 }, { wch: 10 }, { wch: 8 }, { wch: 14 }, { wch: 15 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'sheet1')
  XLSX.writeFile(
    wb,
    `货源、海运交接单 -${make.current.orderID}.xlsx`,
    { bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true }
  )
}

export default { printCustomsType, exportSupply }
