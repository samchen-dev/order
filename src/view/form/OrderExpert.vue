<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>创建订单</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片显示区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="14">
          <span>范围：</span>
          <el-date-picker
            v-model="startEndDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            align="left"
            unlink-panels
            size="mini"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <span style="margin-left:10px">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="orderLists()">搜索</el-button>
          </span>
        </el-col>
        <el-col :span="10">
          <el-input v-model="search" size="mini" placeholder="请输入(订单号、客户名称)查询订单！"></el-input>
        </el-col>
      </el-row>
      <el-table :data="orders.filter(this.searchBuyerOrderID)" border stripe height="350" style="width: 100%" size="mini">
        <el-table-column prop="orderDate" label="日期" :formatter="dateFormat" sortable min-width="10%"> </el-table-column>
        <el-table-column prop="orderID" label="合同编号" sortable min-width="10%"> </el-table-column>
        <el-table-column prop="buyer" label="客户名称" sortable min-width="35%"> </el-table-column>
        <el-table-column prop="offerSheet.sum" label="金额" :formatter="amountFormat" sortable min-width="12%"> </el-table-column>
        <el-table-column prop="offerSheet.count" label="数量" sortable min-width="8%"> </el-table-column>
        <el-table-column prop="orderStatus" label="状态" :formatter="statusFormat" sortable min-width="7%"> </el-table-column>
        <el-table-column prop="" label="操作" min-width="18%">
          <template slot-scope="scope">
            <el-tooltip effect="light" content="删除订单" placement="top" :enterable="false">
              <el-button class="orderButton" size="mini" @click="dropOrder(scope.row)" icon="el-icon-delete"></el-button>
            </el-tooltip>
            <el-tooltip effect="light" content="更新订单" placement="top" :enterable="false">
              <el-button class="orderButton" size="mini" @click="openOrderDialog(scope.row, 'update')" icon="el-icon-upload"></el-button>
            </el-tooltip>
            <el-tooltip effect="light" content="创建订单" placement="top" :enterable="false">
              <el-button class="orderButton" size="mini" @click="openOrderDialog(scope.row, 'clone')" icon="el-icon-document-copy"></el-button>
            </el-tooltip>
            <el-tooltip effect="light" content="提交订单" placement="top" :enterable="false">
              <el-button class="orderButton" size="mini" @click="openHandoverDialog(scope.row)" icon="el-icon-s-promotion"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 更新订单对话框 -->
    <el-dialog
      :title="openType === 'update'? '更新订单' : '复制订单'"
      ref="updateOrderDialog"
      v-if="updateOrderVisible"
      :visible.sync="updateOrderVisible"
      width="1000px"
      :before-close="updateOrderhandleClose"
      :destroy-on-close="true"
    >
      <div class="dialogOrder">
        <OrderRoot v-on:closed="closed" v-bind:orderID="orderID" v-bind:openType="openType"></OrderRoot>
      </div>
    </el-dialog>
    <!-- 提交订单到生产 -->
    <el-dialog
      title="提交订单：生产交接"
      ref="handoverOrderDialog"
      width="1000px"
      v-if="handoverOrderVisible"
      :visible.sync="handoverOrderVisible"
      :before-close="handoverOrderhandleClose"
      :destroy-on-close="true"
    >
      <div class="dialogHandover">
        <HandoverOrder @handoverClosed="handoverClosed" ref="HandoverOrder" v-bind:orderID="orderID"></HandoverOrder>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import OrderRoot from './wizard/OrderRoot.vue'
import HandoverOrder from './wizard/HandoverOrder.vue'
import OrderInfo from './OrderInfo'

export default {
  name: 'orderExpert',
  components: {
    OrderRoot,
    HandoverOrder
  },
  data() {
    return {
      // 查询列表的起始时间
      startEndDate: [
        this.$moment(new Date())
          .startOf('year')
          .format('YYYY-MM-DD'),
        this.$moment(new Date())
          .endOf('year')
          .format('YYYY-MM-DD')
      ],
      // 合同列表
      orders: [],
      // 订单编号，根据订单编号更新订单内容
      orderID: null,
      // 查询变量
      search: '',
      // 更新订单对话框控制标记
      updateOrderVisible: false,
      // 打开对话框的类型，更新订单，拷贝新订单
      openType: '',
      // 提交订单对话框控制标记
      handoverOrderVisible: false,
    }
  },
  methods: {
    // 列表日期格式化显示
    dateFormat(row, column) {
      console.log('dateFormat')
      const date = row[column.property]
      if (date === undefined) {
        return ''
      }
      return this.$XEUtils.toDateString(date, 'yyyy-MM-dd')
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
    // 返回订单列表
    async orderLists() {
      console.log('orderLists')
      console.log(window.sessionStorage.getItem('userID'))
      // 判断起始日期是否为空！
      if (this.startEndDate == null) return this.$message.error('起始日期不能为空！')
      const { data: res } = await this.$http.post('/order/priveList/v1', {
        startEndDate: this.startEndDate,
        userID: window.sessionStorage.getItem('userID')
      })
      // 获取订单列表失败
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 获取订单列表成功
      this.orders = res.data.orders
      this.$message.success(res.meta.msg)
      console.log(this.orders)
    },
    // 根据订单号、客户名称返回结果
    searchBuyerOrderID(data) {
      console.log('searchBuyerOrderID')
      return (
        !this.search || data.buyer.toLowerCase().includes(this.search.toLowerCase()) || data.orderID.toLowerCase().includes(this.search.toLowerCase())
      )
    },
    // 关闭更新订单对话框
    updateOrderhandleClose(done) {
      console.log('updateOrderhandleClose')
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          this.orderLists()
        })
        .catch(_ => {})
    },
    // 关闭提交订单对话框
    handoverOrderhandleClose(done) {
      console.log('handoverOrderhandleClose')
      this.$confirm('确认关闭？')
        .then(_ => {
          // 删除附件无效附件
          done()
          this.orderLists()
        })
        .catch(_ => {})
    },
    // 打开更新订单对话框
    openOrderDialog(row, flag) {
      console.log('openOrderDialog')
      this.orderID = row.orderID
      this.openType = flag
      this.updateOrderVisible = true
    },
    // 打开交接单对话框
    openHandoverDialog(row) {
      console.log('openHandoverDialog', row)
      this.orderID = row.orderID
      if (this.orderID === undefined || this.orderID === null) return this.$message.error('orderID参数不能为空！')
      this.handoverOrderVisible = true
    },
    // 删除草稿订单
    async dropOrder(row) {
      console.log('dropOrder')
      // 草稿状态可以删除
      if (row.orderStatus !== OrderInfo.OrderStatus.get('DRAFT')) {
        return this.$message({
          message: `订单号为：${row.orderID}的状态不是草稿状态，无法删除！`,
          type: 'warning'
        })
      }
      console.log('row.orderStatus', row.orderStatus)
      return this.$confirm(`确定要删除订单号为:${row.orderID}的订单吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 执行删除订单操作
          this.$http.get('/order/delete/v1', {
            params: {
              _id: row._id
            }
          }).then(result => {
            console.log(result.data.meta.msg)
            if (result.data.meta.status !== 200) {
              return this.$message.error(result.data.meta.msg)
            }
            this.$message.success(result.data.meta.msg)
            this.orderLists()
          })
        }).catch(() => {
          console.log('不删除')
        })
    },
    // 接收订单子组件的关闭消息
    closed() {
      console.log('closed')
      // 关闭对话框
      this.$refs.updateOrderDialog.$emit('update:visible', !1)
      this.$refs.updateOrderDialog.$emit('close')
      this.orderLists()
    },
    // 接收交接单子组件的关闭消息
    handoverClosed() {
      console.log('handoverClosed')
      // 关闭对话框
      this.$refs.handoverOrderDialog.$emit('update:visible', !1)
      this.$refs.handoverOrderDialog.$emit('close')
      this.orderLists()
    }
  },
  // 初始化
  created() {
    this.orderLists()
  },
  // 前置守卫
  beforeRouteEnter(to, from, next) {
    console.log('OrderExpert组件守卫:beforeEachEnter')
    next(async vm => {
      const self = vm
      const haveRoles = window.sessionStorage.getItem('user.roles').split(',')
      const { data: res } = await self.$http.post('/user/verifyRole/v1', {
        haveRoles,
        roleName: OrderInfo.RoleName.get('SALESMAN')
      })
      if (res.meta.status !== 200) {
        self.$message.error(res.meta.msg)
        self.$router.replace('/welcome')
      }
    })
  },
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

.dialogOrder {
  padding: 14px;
}
</style>
