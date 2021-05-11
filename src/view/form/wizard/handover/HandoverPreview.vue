<template>
  <div>
    <div class="preview">
      <el-row>
        <el-col :span="8">
          <div style="min-height: 1px;"></div>
        </el-col>
        <el-col :span="8">
          <div style="text-align:center; font-size:20px; font-weight:bold; min-height: 40px;">生产交接单 - {{ contract.orderID }}</div>
        </el-col>
        <el-col :span="8">
          <div style="text-align:right;">
            <el-button-group>
              <el-button size="mini" @click="exportDoc">交接单 导出</el-button>
              <el-button size="mini" @click="exportAll">ALL - 导出</el-button>
            </el-button-group>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2">
          <div style="min-height: 1px;"></div>
        </el-col>
        <el-col :span="20">
          <el-row>
            <el-col :span="12"><div class="preview-text">签单人:<span class="span-text" v-text="handover.user"></span></div></el-col>
            <el-col :span="12"><div class="preview-text" style="text-align:right;">日期:<span class="span-text" v-text="handover.handoverDate"></span></div></el-col>
          </el-row>
          <div class="preview-border-top preview-text">订单信息</div>
          <div class="preview-border-top">
            <el-row>
              <el-col :span="24"
                ><div class="preview-text">合同编号:<span class="span-text">{{ contract.orderID }}</span></div></el-col
              >
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="preview-text">客户名称:<span class="span-text">{{ contract.buyer }}</span></div>
              </el-col>
            </el-row>
            <el-row v-for="(item, index) in handover.order.remark.products" :key="index">
              <el-col :span="24">
                <div class="preview-text">产品要求:<span class="span-text">{{ item.description }}</span></div>
              </el-col>
            </el-row>
            <el-row v-if="handover.order.description.length > 0">
              <el-col :span="24">
                <div class="preview-text">
                  <span>客户要求:</span>
                  <span class="span-text">{{handover.order.description}}</span>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='12'><div class="preview-text">预计交期:<span class="span-text">{{handover.order.deliveryDate}}</span></div></el-col>
              <el-col :span='12'><div class="preview-text">总数量:<span class="span-text">{{contract.offerSheet.count}}</span></div></el-col>
            </el-row>
            <el-row v-if="handover.order.fileListServer.length > 0">
              <el-col :span='24'>
                <div class="preview-text">
                  回签附件:
                  <span class="span-text" v-for="(file, index) in handover.order.fileListServer" :key="index">
                    <el-button type="text" class="annex-button" @click="downloadAnnex(file.id, file.name)"><i class="el-icon-document"></i>{{file.name}}</el-button>
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="preview-border-top preview-text">生产信息</div>
          <div class="preview-border-top">
            <el-row>
              <el-col :span="24">
                <div class="preview-text">
                  订单包装:<span class="span-text">{{ handover.produce.packaging }}</span>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="preview-text">
                  唛头信息:<span class="span-text">{{ handover.produce.mark }}</span>
                </div>
              </el-col>
            </el-row>
            <el-row v-if="handover.produce.fileListServer.length > 0">
              <el-col :span="24">
                <div class="preview-text">
                  唛头附件:
                  <span class="span-text" v-for="(file, index) in handover.produce.fileListServer" :key="index">
                    <el-button type="text" class="annex-button" @click="downloadAnnex(file.id, file.name)"><i class="el-icon-document"></i>{{file.name}}</el-button>
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="preview-border-top preview-text">海运信息</div>
          <div class="preview-border-top">
            <el-row>
              <el-col :span="8">
                <div class="preview-text">
                  货柜类型:<span class="span-text" v-text="handover.shipping.container.genre"></span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="preview-text">
                  核算运费:USD<span class="span-text" v-text="handover.shipping.accountingShipping"></span>
                </div>
              </el-col>
              <el-col :span="8"></el-col>
            </el-row>
            <el-row v-if="handover.shipping.container.genre === '其它'">
              <el-col :span="24">
                <div class="preview-text">
                  货柜描述:<span class="span-text" v-text="handover.shipping.container.description"></span>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <div class="preview-text">
                  提单要求:<span class="span-text">{{handover.shipping.billOfLading.shape}}</span>
                </div>
              </el-col>
              <el-col :span="8" v-if="handover.shipping.billOfLading.shape === '正本提单'">
                <div class="preview-text">
                  正本数量:<span class="span-text" v-text="handover.shipping.billOfLading.original"></span>份
                </div>
              </el-col>
              <el-col :span="8" v-if="handover.shipping.billOfLading.shape === '正本提单'">
                <div class="preview-text">
                  副本数量:<span class="span-text" v-text="handover.shipping.billOfLading.copy"></span>份
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="preview-text">
                  <span>收货人:</span>
                  <span style="white-space: pre-line;" class="span-text" v-text="handover.shipping.consignee"></span>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="preview-text">
                  <span>通知人:</span>
                  <span style="white-space: pre-line;" class="span-text" v-text="handover.shipping.notify"></span>
                </div>
              </el-col>
            </el-row>
            <el-row v-if="contract.locationsType === 'FOB'">
              <el-col :span="24">
                <div class="preview-text">
                  <span>海运代理:</span>
                  <span style="white-space: pre-line;" class="span-text" v-text="handover.shipping.shippingAgent"></span>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="preview-text">
                  HSCODE:<span class="span-text" v-text="handover.shipping.showHSCode"></span>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="preview-text">
                  <span>附加信息:</span>
                  <span style="white-space: pre-line;" class="span-text" v-text="handover.shipping.description"></span>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="preview-border-top preview-text">单证信息</div>
          <div class="preview-border-all">
            <el-row>
              <el-col :span="8">
                <div class="preview-text">发票份数:<span class="span-text" v-text="handover.documents.invoiceQuantity"></span>份</div>
              </el-col>
              <el-col :span="8">
                <div class="preview-text">装箱单份数:<span class="span-text" v-text="handover.documents.packingListQuantity"></span>份</div>
              </el-col>
              <el-col :span="8">
                <div class="preview-text">保险单份数:<span class="span-text" v-text="handover.documents.insuranceQuantity"></span>份</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <div class="preview-text">原产地证:<span class="span-text" v-text="handover.documents.certificateOfOrigin"></span></div>
              </el-col>
              <el-col :span="8">
                <div class="preview-text">REACH:<span class="span-text" v-text="handover.documents.reach"></span></div>
              </el-col>
              <el-col :span="8">
                <div class="preview-text">
                  检测报告:<span class="span-text" v-text="handover.documents.certificateOfAnalysis.genre"></span>,
                  报告份数:<span class="span-text" v-text="handover.documents.certificateOfAnalysis.Quantity"></span>份
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="16">交单地址:<span class="span-text" style="white-space:pre-line;" v-text="handover.documents.bill.address"></span></el-col>
              <el-col :span="8">
                <div class="preview-text">交单类型:<span class="span-text" v-text="handover.documents.bill.genre"></span></div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="2"></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import saveAs from 'file-saver'
import Handover from './Handover'

export default {
  name: 'handoverPreview',
  props: {
    // 合同内容
    contract: {
      type: Object,
      required: true
    },
    // 交接单
    handover: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
    // 下载附件功能
    downloadAnnex(id, name) {
      console.log('download', id)
      this.$http.post('/order/downloadAnnex/v1', { id }, {
        responseType: 'blob'
      }).then(result => {
        const { data: Blob, headers } = result
        const filename = headers['content-disposition'].split(';')[1].split('filename=')[1]
        console.log(filename)
        console.log(decodeURI(filename))
        saveAs(Blob, name)
      }).catch(result => {
        console.log(result)
        this.$message.error(`该附件${name}无法下载`)
      })
    },
    // 导出交接单
    exportDoc() {
      console.log('exportDoc')
      console.log(this.$os)
      Handover.exportHandover(this.contract, this.handover, this.$os)
    },
    // 导出所有文件
    exportAll() {
      console.log('exportAll')
      Handover.exportAllFile(this.contract, this.handover, this.$os, this.$XEUtils, this.$http)
    }
  },
  created() {
    console.log('HandoverPreview - created')
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
</style>
