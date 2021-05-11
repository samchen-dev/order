<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>货源管理</el-breadcrumb-item>
      <el-breadcrumb-item>生产安排</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片显示区域 -->
    <el-card class="box-card">
      <el-table :data="orders" border stripe height="350" style="width: 100%" size="mini" :row-class-name="getRowClassName">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <div v-if="props.row.makes.length">
                <div v-for="(make, index) of props.row.makes" :key="index" class="make-expand">
                  <div>订单编号:{{ make.orderID }}</div>
                  <div>工厂名称:{{ make.factoryName }}</div>
                  <div>订单数量:{{ make.target.offerSheet.count }}</div>
                  <div style="text-align:center">
                    <el-tooltip effect="light" content="预览采购合同" placement="top" :enterable="false">
                      <el-button class="makeButton" size="mini" @click="openPreviewDialog(make, props.row.orderID)" icon="el-icon-document"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="light" content="删除采购合同" placement="top" :enterable="false">
                      <el-button class="makeButton" size="mini" @click="delProduce(make, props.row.orderID)" icon="el-icon-delete"></el-button>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="orderDate" label="日期" :formatter="dateFormat" sortable min-width="10%"></el-table-column>
        <el-table-column prop="orderID" label="合同编号" sortable min-width="10%"> </el-table-column>
        <el-table-column prop="buyer" label="客户名称" sortable min-width="43%"> </el-table-column>
        <el-table-column prop="offerSheet.sum" label="金额" :formatter="amountFormat" sortable min-width="12%"> </el-table-column>
        <el-table-column prop="offerSheet.count" label="数量" sortable min-width="8%"> </el-table-column>
        <el-table-column prop="user[0].username" label="业务员" sortable min-width="9%"> </el-table-column>
        <el-table-column prop="" label="操作" min-width="8%">
          <template slot-scope="scope">
            <el-tooltip effect="light" content="生产安排" placement="top" :enterable="false">
              <el-button class="orderButton" size="mini" @click="openSupplyAgentDialog(scope.row)" icon="el-icon-school"></el-button>
            </el-tooltip>
            <el-tooltip effect="light" content="删除订单" placement="top" :enterable="false">
              <el-button class="orderButton" size="mini" @click="dropOrder(scope.row)" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="orderHandleSizeChange"
        @current-change="orderHandleCureentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="orderCount"
      >
      </el-pagination>
    </el-card>
    <!-- 提交订单到生产 -->
    <el-dialog
      title="生产安排"
      ref="supplyAgentDialog"
      width="1000px"
      v-if="supplyAgentVisible"
      :visible.sync="supplyAgentVisible"
      :before-close="supplyAgentHandleClose"
      :destroy-on-close="true"
    >
      <div>
        <ProduceAssign @supplyAgentClosed="supplyAgentClosed" :orderID="orderID"></ProduceAssign>
      </div>
    </el-dialog>
    <!-- 采购合同预览 -->
    <el-dialog
      title="预览采购合同、交接单"
      ref="supplyPreviewDialog"
      width="800px"
      v-if="supplyPreviewVisible"
      :visible.sync="supplyPreviewVisible"
      :before-close="supplyPreviewHandleClose"
      :destroy-on-close="true"
    >
      <div>
        <PreviewSheel :makeProp="make" :orderID="orderID"></PreviewSheel>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import OrderInfo from '../form/OrderInfo'
import ProduceAssign from './ProduceAssign.vue'
import PreviewSheel from './PreviewSheel.vue'
export default {
  name: 'SupplyAgentList',
  components: {
    ProduceAssign,
    PreviewSheel
  },
  data() {
    return {
      // 订单编号
      orderID: '',
      // 采购合同编号
      make: '',
      // 需要安排生产的订单列表
      orders: [],
      // 订单总数量
      orderCount: 0,
      // 生产安排对话框显示标记
      supplyAgentVisible: false,
      // 采购合同预览对话框显示标记
      supplyPreviewVisible: false,
      // 当前页面
      currentPage: 1,
      // 每页显示条数
      pageSize: 5,
    }
  },
  methods: {
    orderHandleSizeChange(val) {
      console.log(`每页${val}的条数`)
      this.pageSize = val
      this.orderList()
    },
    orderHandleCureentChange(val) {
      console.log(`当前页:${val}`)
      this.currentPage = val
      this.orderList()
    },
    // 列表日期格式化显示
    dateFormat(row, column) {
      console.log('dateFormat')
      const date = row[column.property]
      if (date === undefined) {
        return ''
      }
      return this.$XEUtils.toDateString(date, 'yyyy-MM-dd')
    },

    // 判断订单是否已经安排过生成，如果没有无法展开
    getRowClassName({ row, rowIndex }) {
      console.log(row, rowIndex, row.makes.length)
      if (row.makes.length === 0) return 'row-expand-cover'
    },

    // 金额增加$符号格式化显示
    amountFormat(row, column, cellValue) {
      console.log('amountFomat')
      return `USD ${Number.parseFloat(cellValue).toFixed(2)}`
    },
    // 返回订单状态
    statusFormat(row, column, cellValue) {
      console.log('statusFormat')
      let value = OrderInfo.OrderStatusInfo.get('DRAFT')
      if (cellValue === OrderInfo.OrderStatus.get('RUN-SUPPLY')) {
        value = OrderInfo.OrderStatusInfo.get('RUN-SUPPLY')
      } else if (cellValue === OrderInfo.OrderStatus.get('RUN-SHIPPING')) {
        value = OrderInfo.OrderStatusInfo.get('RUN-SHIPPING')
      } else if (cellValue === OrderInfo.OrderStatus.get('RUN-DOCUMENTS')) {
        value = OrderInfo.OrderStatusInfo.get('RUN-DOCUMENTS')
      }
      return value
    },
    // 加载列表订单列表
    async orderList() {
      console.log('orderList')
      {
        // 获取订单数量
        const { data: res } = await this.$http.get('/order/supplyAgentListCount/v1')
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.orderCount = res.data.orderCount
      }
      {
        // 刷新订单列表
        const { data: res } = await this.$http.post('/order/supplyAgentList/v1', {
          currentPage: this.currentPage,
          pageSize: this.pageSize
        })
        // 获取订单安排生产列表失败
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }

        // 成功获取订单安排生产列表
        this.orders = res.data.orders
        console.log(this.orders)
        this.$message.success(res.meta.msg)
      }
    },
    // 删除订单
    async dropOrder(row) {
      console.log('dropOrder', row)
      return this.$confirm(`确定要删除订单号为:${row.orderID}的订单吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 执行删除订单操作
          this.$http
            .get('/order/delete/v1', {
              params: {
                _id: row._id,
                orderID: row.orderID
              }
            })
            .then(result => {
              console.log(result.data.meta.msg)
              if (result.data.meta.status !== 200) {
                return this.$message.error(result.data.meta.msg)
              }
              this.$message.success(result.data.meta.msg)
              this.orderList()
            })
        })
        .catch(() => {
          console.log('不删除')
        })
    },
    // 对话框关闭事件
    supplyAgentHandleClose(done) {
      console.log('supplyAgentHandleClose')
      this.$confirm('确认关闭？')
        .then(() => {
          done()
        })
        .catch(() => {})
    },
    // 打开安排生产对话框
    openSupplyAgentDialog(row) {
      console.log('openSupplyAgentDialog')
      this.orderID = row.orderID
      this.supplyAgentVisible = true
    },
    // 接收交接单子组件的关闭消息，
    supplyAgentClosed() {
      console.log('supplyAgentClosed...')
      this.$refs.supplyAgentDialog.$emit('update:visible', !1)
      this.$refs.supplyAgentDialog.$emit('close')
      this.orderList()
    },
    // 关闭采购合同预览对话框
    supplyPreviewHandleClose(done) {
      console.log('supplyPreviewHandleClose')
      this.$confirm('确认关闭？')
        .then(() => {
          done()
        })
        .catch(() => {})
    },
    // 打开采购合同预览对话框
    openPreviewDialog(make, orderID) {
      console.log('openPreviewDialog', make)
      this.make = make
      this.orderID = orderID
      this.supplyPreviewVisible = true
    },
    // 删除采购合同
    async delProduce(make, orderID) {
      console.log('delProduce')
      this.$confirm(`你确认要删除订单${orderID}下的${make.orderID}采购合同？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 执行删除订单操作
          console.log(make)
          this.$http
            .get('/make/delete/v1', {
              params: {
                _id: make._id
              }
            })
            .then(result => {
              console.log(result.data.meta.msg)
              if (result.data.meta.status !== 200) {
                return this.$message.error(result.data.meta.msg)
              }
              this.$message.success(result.data.meta.msg)
              this.orderList()
            })
        })
        .catch(() => {
          //
        })
    }
  },
  // 初始化
  created() {
    console.log('create')
    this.orderList()
  }
}
</script>
<style lang="less" scoped>
.icon-warp {
  font-size: 20px;
  overflow: hidden;
  margin-right: 10px;
}

.orderButton {
  padding: 4px 4px;
}

.makeButton {
  padding: 4px 4px 4px 4px;
  margin: 0px 0px 1px 1px;
}
.dialogOrder {
  padding: 14px;
}

/deep/ .el-table .row-expand-cover .cell .el-table__expand-icon {
  display: none;
}

/deep/ .el-table__expanded-cell {
  padding-top: 6px;
  padding-left: 50px;
  padding-bottom: 6px;
  padding-right: 10px;
}

.make-expand {
  display: grid;
  align-items: center;
  grid-template-columns: 20% 50% 20% 10%;
}

</style>
