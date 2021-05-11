import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  WidthType,
  AlignmentType
} from 'docx'
import saveAs from 'file-saver'
import JSZip from 'jszip'
import Contract from '../Contract'

// 显示附件
function showAnnex(fileList) {
  console.log('showAnnex', fileList)
  const names = []
  fileList.map(file => names.push(file.name))
  if (names.length > 0) names.push('(附件请在系统中下载)')
  return names
}

// 格式化显示收货人信息
function formatConsignee(value, os) {
  console.log('formatConsignee')
  const arr = os === 'Windows' ? value.split('\n') : value.split('\r\n')
  return arr
}

// 生成订单信息单元格
function generateOrderTableRow(contract, handover) {
  console.log('generateOrderTableRow')
  const rows = [
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              text: '订单信息',
              style: 'documentH2'
            })
          ]
        })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              text: `合同编号:${contract.orderID}`,
              style: 'documentText'
            }),
            new Paragraph({
              text: `客户名称:${contract.buyer}`,
              style: 'documentText'
            }),
            ...handover.order.remark.products.map(product => {
              return new Paragraph({
                text: `产品要求:${product.description}`,
                style: 'documentText'
              })
            }),
            new Paragraph({
              text: `客户要求:${handover.order.description}`,
              style: 'documentText'
            }),
            new Paragraph({
              text: `预计交期:${handover.order.deliveryDate}\t\t\t\t总数量:${contract.offerSheet.count}`,
              style: 'documentText'
            }),
            new Paragraph({
              text: `回签附件:${showAnnex(handover.order.fileListServer).join('  ')}`,
              style: 'documentText'
            })
          ]
        })
      ]
    })
  ]
  return rows
}

// 生成生产信息单元格
function generateProduceTableRow(contract, handover) {
  console.log('generateProduceTableRow')
  const rows = [
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              text: '生产信息',
              style: 'documentH2'
            })
          ]
        })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              text: `订单包装:${handover.produce.packaging}`,
              style: 'documentText'
            }),
            new Paragraph({
              text: `唛头信息:${handover.produce.mark}`,
              style: 'documentText'
            }),
            new Paragraph({
              text: `唛头附件:${showAnnex(handover.produce.fileListServer).join('  ')}`,
              style: 'documentText'
            })
          ]
        })
      ]
    })
  ]
  return rows
}
// 海运信息单元格
function generateShippingTableRow(contract, handover, os) {
  console.log('generateShippingTableRow')
  const rows = [
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              text: '海运信息',
              style: 'documentH2'
            })
          ]
        })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              text: `货柜类型:${handover.shipping.container.genre}\t\t\t\t核算运费:${handover.shipping.accountingShipping}`,
              style: 'documentText'
            }),
            ...[handover.shipping.container.description].map(item => {
              if (handover.shipping.container.genre === '其它') {
                return new Paragraph({
                  text: `货柜描述:${item}`,
                  style: 'documentText'
                })
              }
            }),
            new Paragraph({
              text: `提单要求:${handover.shipping.billOfLading.shape}\t\t\t\t正本数量:${
                handover.shipping.billOfLading.shape === '正本提单' ? handover.shipping.billOfLading.original : ''
              }\t\t\t\t副本数量:${handover.shipping.billOfLading.shape === '正本提单' ? handover.shipping.billOfLading.copy : ''}`,
              style: 'documentText'
            }),
            ...formatConsignee(handover.shipping.consignee, os).map((item, index) => {
              const val = index === 0 ? `收货人:${item.trim()}` : item.trim()
              return new Paragraph({
                text: val,
                style: 'documentText'
              })
            }),
            ...formatConsignee(handover.shipping.notify, os).map((item, index) => {
              const val = index === 0 ? `通知人:${item.trim()}` : item.trim()
              return new Paragraph({
                text: val,
                style: 'documentText'
              })
            }),
            new Paragraph({
              text: `海运代理:${handover.shipping.shippingAgent}`,
              style: 'documentText'
            }),
            new Paragraph({
              text: `HSCODE:${handover.shipping.showHSCode}`,
              style: 'documentText'
            }),
            new Paragraph({
              text: `附加信息:${handover.shipping.description}`,
              style: 'documentText'
            })
          ]
        })
      ]
    })
  ]
  return rows
}
// 生产单证信息单元格
function generateDocumentsTableRow(contract, handover, os) {
  console.log('generateDocumentsTableRow')
  const rows = [
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              text: '单证信息',
              style: 'documentH2'
            })
          ]
        })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              text: `发票份数:${handover.documents.invoiceQuantity}份\t\t\t\t装箱单份数:${handover.documents.packingListQuantity}份\t\t\t\t保险单份数:${handover.documents.insuranceQuantity}份`,
              style: 'documentText'
            }),
            new Paragraph({
              text: `原产地证:${handover.documents.certificateOfOrigin}份\t\t\t\tREACH:${handover.documents.reach}份\t\t\t\t检测报告:${handover.documents.certificateOfAnalysis.genre}提供,报告份数:${handover.documents.certificateOfAnalysis.Quantity}份`,
              style: 'documentText'
            }),
            new Paragraph({
              text: `交单类型:${handover.documents.bill.genre}`,
              style: 'documentText'
            }),
            ...formatConsignee(handover.documents.bill.address, os).map((item, index) => {
              const val = index === 0 ? `交单地址:${item.trim()}` : item.trim()
              return new Paragraph({
                text: val,
                style: 'documentText'
              })
            })
          ]
        })
      ]
    })
  ]
  return rows
}

function createHandover(contract, handover, os) {
  const doc = new Document({
    creator: 'SINABUDDY',
    title: '生产交接单',
    description: '生产交接单',
    styles: {
      paragraphStyles: [
        {
          id: 'documentH1',
          name: 'documentH1',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            font: '宋体',
            size: 36,
            bold: true
          }
        },
        {
          id: 'documentH2',
          name: 'documentH2',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            font: '宋体',
            size: 24,
            bold: true
          }
        },
        {
          id: 'documentText',
          name: 'documentText',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            font: '宋体',
            size: 24
          },
          paragraph: {
            spacing: {
              before: 60,
              after: 40
            }
          }
        }
      ]
    }
  })
  const handoverTable = new Table({
    rows: [
      ...generateOrderTableRow(contract, handover),
      ...generateProduceTableRow(contract, handover),
      ...generateShippingTableRow(contract, handover, os),
      ...generateDocumentsTableRow(contract, handover, os)
    ],
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    }
  })
  doc.addSection({
    margins: {
      top: 500,
      right: 800,
      bottom: 500,
      left: 800
    },
    children: [
      new Paragraph({
        text: `生产交接单 - ${contract.orderID}`,
        alignment: AlignmentType.CENTER,
        style: 'documentH1'
      }),
      new Paragraph({
        text: `签单人:${handover.user}\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t日期:${handover.handoverDate}`,
        style: 'documentText'
      }),
      handoverTable,
      new Paragraph({
        text: '',
        style: 'documentText'
      }),
      new Paragraph({
        text: '\t业务:______________________________  日期:______________________________',
        style: 'documentText'
      }),
      new Paragraph({
        text: '\t经理:______________________________  日期:______________________________',
        style: 'documentText'
      }),
      new Paragraph({
        text: '\t货源:______________________________  日期:______________________________',
        style: 'documentText'
      })
    ]
  })
  return doc
}
// 下载生产交接单
function exportHandover(contract, handover, os) {
  console.log('exportHandover')
  const doc = createHandover(contract, handover, os)
  const mineType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  Packer.toBlob(doc).then(blob => {
    const docBlob = blob.slice(0, blob.size, mineType)
    saveAs(docBlob, `生产交接单 -${contract.orderID}.docx`)
  })
}

// 附件添加到zip中
function getAnnex(http, item) {
  console.log('addAnnexToZip')
  const { id } = item
  return http.post('/order/downloadAnnex/v1', { id }, { responseType: 'blob' })
}

// 下载该合同的所有文件交接单、合同、发票、附件
function exportAllFile(contract, handover, os, XEUtils, http) {
  console.log('exportAllFile')
  const zip = new JSZip()
  // 生成生成交接单
  const doc = createHandover(contract, handover, os)
  Packer.toBlob(doc)
    .then(blob => {
      // 生产交接单添加到zip文件
      const mineType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      const docBlob = blob.slice(0, blob.size, mineType)
      zip.file(`生产交接单 -${contract.orderID}.docx`, docBlob)

      // 合同添加到zip文件
      const contractFile = Contract.exportMemoryContract(contract)
      zip.file(`SALES CONTRACT -${contract.orderID}.xlsx`, contractFile, { binary: true })

      // 发票添加到zip文件
      const invoiceFile = Contract.exportMemoryInvoice(contract, XEUtils)
      zip.file(`PROFORMA INVOICE -${contract.orderID}.xlsx`, invoiceFile, { binary: true })

      // 添加回签合同附件
      const signature = []
      handover.order.fileListServer.forEach(item => {
        signature.push(getAnnex(http, item))
      })
      return Promise.all(signature)
    })
    .then(resultArray => {
      // 下载附件
      resultArray.forEach(result => {
        const { data: Blob, headers } = result
        const filename = decodeURI(headers['content-disposition'].split(';')[1].split('filename=')[1])
        zip.file(`回签/${filename}`, Blob, { binary: true })
      })
      // 添加唛头附件
      const mark = []
      handover.produce.fileListServer.forEach(item => {
        mark.push(getAnnex(http, item))
      })
      return Promise.all(mark)
    })
    .then(resultArray => {
      // 下载附件
      resultArray.forEach(result => {
        const { data: Blob, headers } = result
        const filename = decodeURI(headers['content-disposition'].split(';')[1].split('filename=')[1])
        zip.file(`唛头/${filename}`, Blob, { binary: true })
      })
      // 执行保存附件
      return zip.generateAsync({ type: 'blob' })
    })
    .then(files => {
      // 保存zip文件
      console.log('下载所有附件')
      saveAs(files, contract.orderID)
    })
}
export default { exportHandover, exportAllFile }
