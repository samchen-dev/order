import XLSX from '@sheet/image'
import OrderInfo from '../form/OrderInfo'

// 显示单价
// purchaser: 公司名称（郑州华友矿产品有限公司、华友矿产有限公司）二选一
// val: 默认的是工厂给的出厂价格
// type: 货币类型 RMB 或 USD
// loading: 港口参数，结合工厂的报价是否送货到港口
function roadTransportPrint(purchaser, val, type, loading) {
  console.log('roadTransportPrint', purchaser, val, type, loading)
  if (type === 'RMB') {
    const res = OrderInfo.SinabuddyChineseName[0] ? `(${val})` : '(出厂含税)'
    console.log(res)
    return res
    // return purchaser === OrderInfo.SinabuddyChineseName[0] ? `(${val})` : '(出厂含税)'
  }
  return `(FOB ${loading})`
}

// 获取订单产品的单位中文
function getUnit(key, type) {
  console.log('getUnit', key, type)
  return type === 'RMB' ? OrderInfo.UnitInfo.get(key) : key
}

// 货币类型显示单价
function unitPricePrint(type, price, unit) {
  console.log('unitPricePrint', type, price, unit)
  return type === 'RMB' ? `${price.toFixed(2)}元/${getUnit(unit, type)}` : `${type} ${price.toFixed(2)}/${unit}`
}

function unitPricePrint2(type, unit) {
  console.log('unitPricePrint2', type, unit)
  return type === 'RMB' ? `元/${getUnit(unit, type)}` : `${type}/${unit}`
}

// 货币类型显示总价
function unitTotalPricePrint(type, price) {
  console.log('unitTotalPricePrint', type, price)
  return type === 'RMB' ? `${price.toFixed(2)}元` : `${type} ${price.toFixed(2)}`
}

function unitTotalPricePrint2(type) {
  console.log('unitTotalPricePrint2', type)
  return type === 'RMB' ? '元' : type
}

// 总数量转换字符串
function countToString(type, make) {
  console.log('printCount', type)
  const countArray = make.target.offerSheet.count.trim().split(' ')
  console.log(countArray)
  const result = []
  countArray.forEach((v, i) => {
    result[i] = i / 2 > 0 ? `${getUnit(v, type)} ` : v
  })
  return result.join('')
}

// 总数量转换字符串
function countToString2(type, make) {
  console.log('printCount', type)
  const countArray = make.target.offerSheet.count.trim().split(' ')
  if (countArray.length === 2) return countArray[0]
  const result = []
  countArray.forEach((v, i) => {
    result[i] = i / 2 > 0 ? `${getUnit(v, type)} ` : v
  })
  return result.join('')
}
// 包装
function packagePrint(make) {
  console.log('packagePrint')
  const { markInfo } = make.current
  const description = []
  for (const item of markInfo) {
    const text = item.description.slice(item.description.indexOf(':') === -1 ? 0 : item.description.indexOf(':') + 1)
    let flag = true
    description.forEach((v, i) => { if (text === v) flag = false })
    if (flag) description.push(`${item.description}\n`)
  }
  return description.join('.')
}

// 创建采购合同xlsx
function exportSupply(make) {
  console.log('exportSupply', make)
  // 设置单元格边框
  const borderAll = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' }
  }
  const tableLeftBorderAll = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
    alignment: {
      horizontal: 'left',
      vertical: 'center',
      wrapText: true
    }
  }

  const tableRightBorderAll = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
    alignment: {
      horizontal: 'right',
      vertical: 'center',
      wrapText: true
    }
  }

  const borderLeftRight = {
    left: { style: 'thin' },
    right: { style: 'thin' }
  }
  // 产品指标样式
  const normBorderLeftRight = {
    left: { style: 'thin' },
    right: { style: 'thin' },
    alignment: {
      wrapText: true
    }
  }
  const tableRightBorderLeftRight = {
    left: { style: 'thin' },
    right: { style: 'thin' },
    alignment: {
      horizontal: 'right',
      vertical: 'center',
      wrapText: true
    }
  }
  const markBorderAll = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
    alignment: {
      horizontal: 'left',
      vertical: 'center',
      wrapText: true
    }
  }

  const { unit } = make.current.target.offerSheet.products[0]

  const wsData = [
    // 合同数据
    [
      {
        v: '采 购 合 同',
        s: {
          name: '宋体',
          sz: 16,
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: true
          }
        },
      },
      '',
      '',
      ''
    ],
    [
      '',
      '',
      '',
      { v: `合同编号:${make.current.orderID}`, s: { alignment: { horizontal: 'left' } } },
    ],
    [
      '',
      '',
      '',
      { v: `合同日期:${make.current.signingDate}`, s: { alignment: { horizontal: 'left' } } },
    ],
    [
      { v: `卖方:${make.current.factoryName}`, s: { alignment: { vertical: 'center', horizontal: 'left' } } },
      '',
      { v: `买方:${make.current.purchaser}`, s: { alignment: { horizontal: 'right' } } },
      ''
    ],
    [
      { v: '1、产品\n', s: tableLeftBorderAll },
      { v: `2、数量(${getUnit(unit, make.current.currencyType)})\n`, s: tableLeftBorderAll },
      {
        v: `3、单价\n${roadTransportPrint(make.current.purchaser, make.current.roadTransport, make.current.currencyType, make.current.loading)}${unitPricePrint2(make.current.currencyType, unit)}`,
        s: tableLeftBorderAll
      },
      { v: `4、总计(${unitTotalPricePrint2(make.current.currencyType)})\n`, s: tableLeftBorderAll },
    ],
  ]
  // 设置数据偏移量
  let i = 0;
  for (const product of make.current.target.offerSheet.products) {
    // 添加产品
    i += 1
    wsData.push(
      [
        { v: product.chineseName, s: normBorderLeftRight },
        { v: '', s: borderLeftRight },
        { v: '', s: borderLeftRight },
        { v: '', s: borderLeftRight },
      ],
    )
    // 产品描述不为空，添加产品描述
    if (product.norm !== undefined) {
      i += 1
      wsData.push(
        [
          { v: product.norm, s: borderLeftRight },
          { v: '', s: borderLeftRight },
          { v: '', s: borderLeftRight },
          { v: '', s: borderLeftRight },
        ]
      )
    }
    // 循环添加每个产品下面的粒度单价等信息
    console.log('make', make)
    for (const quotation of product.quotations) {
      i += 1
      wsData.push([
        { v: ` ${quotation.size} ${quotation.norm === undefined ? '' : quotation.norm}`, s: borderLeftRight },
        { v: quotation.quantity, t: 'n', s: tableRightBorderLeftRight },
        { v: quotation.purchasing.toFixed(2), t: 'n', z: '###0.00', s: tableRightBorderLeftRight },
        { v: quotation.purchasePrice.toFixed(2), t: 'n', z: '###0.00', s: tableRightBorderLeftRight },
      ])
    }
  }
  // 添加总计
  i += 1
  wsData.push(
    [
      { v: '共计:', s: borderAll },
      { v: countToString2(make.current.currencyType, make), t: 'n', s: tableRightBorderAll },
      { v: '', s: borderAll },
      { v: make.target.offerSheet.productPurchasing, t: 'n', z: '###0.00', s: tableRightBorderAll }
    ],
  )

  // 添加包装
  wsData.push([
    {
      v: `5、包装:${packagePrint(make)}`,
      s: {
        alignment: {
          horizontal: 'left',
          vertical: 'center',
          wrapText: true,
        }
      }
    }
  ])
  // 唛头
  wsData.push([
    '6、唛头:',
    '',
    '',
    '',
  ])
  // 添加唛头
  let markHeight = 0
  let j = 0
  for (const item of make.current.markInfo) {
    if (item.mark.length === 1) {
      markHeight += 1
      // 单一唛头例如：吨袋
      wsData.push([
        { v: ` ${item.mark[0].title}:` },
        { v: '' },
        { v: '' },
        { v: '' },
      ])
      wsData.push([
        {
          v: item.mark[0].info, s: markBorderAll
        },
      ])
    } else {
      markHeight += 2
      // 符合包装例如：字母袋，打托盘
      wsData.push([
        { v: ` ${item.mark[0].title}:` },
        { v: '' },
        { v: '' },
        { v: ` ${item.mark[1].title}:` },
      ])
      wsData.push([
        { v: `${item.mark[0].info}`, s: markBorderAll },
        { v: '' },
        { v: '' },
        { v: `${item.mark[1].info}`, s: markBorderAll },
      ])
    }
    j += 2
  }
  // 添加条款
  wsData.push([`7、装运期限${make.current.deliveryDate}前货发港口`])
  wsData.push([`8、起运港口:${make.current.loading}`])
  wsData.push([`9、付款条件:${make.current.paymentMethod.description}`])
  wsData.push([
    {
      v: '10、卖方必须提供与合同要求相符的货物给买方,如卖方提供的货物质量与合同要求不符,买方有权提出索赔。货物备好后，卖方应及时通知买方，买方检验人员到供方工厂抽样检测，检测合格后, 供方再发货港口。',
      s: {
        alignment: {
          horizontal: 'left',
          vertical: 'center',
          wrapText: true,
        }
      }
    }
  ])
  wsData.push(['11、本合同一经双方签字即生效，不得更改或撤消'])
  wsData.push([])
  wsData.push([])
  wsData.push([])
  wsData.push(['卖方:', '', '买方:', ''])
  const ws = XLSX.utils.aoa_to_sheet(wsData)
  const merges = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // 合并标题
    // { s: { r: 1, c: 2 }, e: { r: 1, c: 3 } }, // 合并编号
    // { s: { r: 2, c: 2 }, e: { r: 2, c: 3 } }, // 合并日期
    { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } }, // 合并卖方
    { s: { r: 3, c: 2 }, e: { r: 3, c: 3 } }, // 合并买方
    { s: { r: 5 + i, c: 0 }, e: { r: 5 + i, c: 3 } }, // 合并包装
    { s: { r: 10 + i + j, c: 0 }, e: { r: 10 + i + j, c: 3 } }, // 合并条款
  ]
  ws['!merges'] = merges
  // 设置宽度
  ws['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 15 }, { wch: 25 }]
  // 设置行高度
  console.log('markHeight', markHeight)
  const rows = []
  rows[0] = { hpx: 30 } // 标题高度
  rows[4] = { hpx: 60 } // 产品、数量、单价、合计高度
  rows[5 + i] = { hpx: markHeight === 2 ? 60 : 125 } // 包装高度
  rows[10 + i + j] = { hpx: 60 }
  ws['!rows'] = rows
  const wb = XLSX.utils.book_new()
  console.log(wb, i, j)
  XLSX.utils.book_append_sheet(wb, ws, 'sheet1')
  XLSX.writeFile(
    wb,
    `采购合同 -${make.current.orderID}.xlsx`,
    { bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true }
  )
}

export default { exportSupply, roadTransportPrint, getUnit, unitPricePrint, unitTotalPricePrint, countToString, packagePrint }
