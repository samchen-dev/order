<template>
  <div>
    <!-- 产品价格列表 -->
    <el-row v-for="rank in ranks">
      <el-col class="col-rank-header" :span="16">
        {{ rank.level }}
      </el-col>
      <el-col class="el-col-rank-Right" :span="8">
        <el-button-group>
          <el-tooltip effect="dark" content="修改产品报价信息" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="openRankDialog(rank._id, rank.level)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除产品报价信息" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRank(rank._id)"></el-button>
          </el-tooltip>
        </el-button-group>
      </el-col>
      <el-table
        class="table-rank"
        :data="rank.assort"
        :span-method="rankSpan"
        style="width: 100%"
        border
      >
        <el-table-column prop="port" label="港口" min-width="25%"></el-table-column>
        <el-table-column prop="description" label="描述" min-width="30%"></el-table-column>
        <el-table-column prop="size" label="规格" min-width="10%"></el-table-column>
        <el-table-column prop="quote" label="价格(USD)" :formatter="formatUSD" min-width="10%"></el-table-column>
        <el-table-column prop="spece" label="指标" min-width="25%"></el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="end" align="center">
      <el-col :span="24" class="col-button">
        <el-button type="primary" @click="addDialogVisible = true" size="mini">添加报价</el-button>
      </el-col>
    </el-row>

    <!-- 添加新报价对话框 -->
    <el-dialog class="addRankDialog" title="新报价" :visible.sync="addDialogVisible" @close="rankNewDialogClose()" width="75%">
      <el-form ref="addRankFromRef" :model="rank" :rules="addRankRules" label-width="55px" label-position="right" size="mini">
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="级别:" prop="level">
              <el-input placeholder="级别" v-model="rank.level" maxlength="70" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="港口:" prop="port">
              <el-autocomplete
                v-model="rank.port"
                :fetch-suggestions="portQuerySearch"
                placeholder="起运港"
                @select="portHandleSelect"
                style="width:100%"
                size="mini"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描  述:" prop="description">
              <el-input placeholder="描述" v-model="rank.description" type="textarea" maxlength="200" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-for="(item, index) in rank.assort" type="flex" justify="center" align="middle">
          <el-col :span="6">
            <el-form-item label="规格:" :prop="'assort.' + index + '.size'" :rules="{ required: true, message: '规格不能为空！', trigger: 'blur' }">
              <el-input placeholder="规格" v-model="item.size" maxlength="40" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="价格:"
              :prop="'assort.' + index + '.quote'"
              :rules="[
                { required: true, message: '价格不能为空' },
                { type: 'number', message: '价格必须为数字值' }
              ]"
            >
              <el-input placeholder="价格" v-model.number="item.quote">
                <template slot="append">$</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="指标:" :prop="'assort.' + index + '.spece'">
              <el-input placeholder="指标" v-model="item.spece" maxlength="40" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="col-button">
            <el-form-item>
              <el-button-group>
                <el-button icon="el-icon-plus" @click="addAssort(rank, index)"></el-button>
                <el-button icon="el-icon-minus" @click="delAssort(rank, index)"></el-button>
                <el-button icon="el-icon-top" @click="upAssort(rank, index)"></el-button>
                <el-button icon="el-icon-bottom" @click="downAssort(rank, index)"></el-button>
              </el-button-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="addRank()" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改产品报价对话框 -->
    <el-dialog title="修改产品报价" :visible.sync="editDialogVisible" @close="rankEditDialogClose()" width="75%">
      <el-form ref="editRankFromRef" :model="editRank" label-width="55px" label-position="right" size="mini">
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="级别:" prop="level">
              <el-input placeholder="级别" v-model="editRank.level" maxlength="70" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="港口:" prop="port">
              <el-autocomplete
                v-model="editRank.port"
                :fetch-suggestions="portQuerySearch"
                placeholder="起运港"
                @select="portHandleSelect"
                style="width:100%"
                size="mini"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描  述:" prop="description">
              <el-input placeholder="描述" v-model="editRank.description" type="textarea" maxlength="200" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-for="(item, index) in editRank.assort" type="flex" justify="center" align="middle">
          <el-col :span="6">
            <el-form-item label="规格:" :prop="'assort.' + index + '.size'" :rules="{ required: true, message: '规格不能为空！', trigger: 'blur' }">
              <el-input placeholder="规格" v-model="item.size" maxlength="40" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="价格:"
              :prop="'assort.' + index + '.quote'"
              :rules="[
                { required: true, message: '价格不能为空' },
                { type: 'number', message: '价格必须为数字值' }
              ]"
            >
              <el-input placeholder="价格" v-model.number="item.quote">
                <template slot="append">$</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="指标:" :prop="'assort.' + index + '.spece'">
              <el-input placeholder="指标" v-model="item.spece" maxlength="40" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="col-button">
            <el-form-item>
              <el-button-group>
                <el-button icon="el-icon-plus" @click="addAssort(editRank, index)"></el-button>
                <el-button icon="el-icon-minus" @click="delAssort(editRank, index)"></el-button>
                <el-button icon="el-icon-top" @click="upAssort(editRank, index)"></el-button>
                <el-button icon="el-icon-bottom" @click="downAssort(editRank, index)"></el-button>
              </el-button-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="updateRankDialog()" size="mini">更 新</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Rank',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 新建对话框显示标记
      addDialogVisible: false,
      // 添加格则
      addRankRules: {
        level: [{ required: true, message: '级别名不能为空！', trigger: 'blur' }],
        port: [{ required: true, message: '港口名不能为空！', trigger: 'change' }]
      },
      // 关闭对话框事件
      rankDialogClose() {
        console.log('rankDialogClose')
      },
      // 报价单列表
      ranks: [],
      // 新建报价单
      rank: {
        product: '',
        level: '',
        port: '',
        description: '',
        assort: [
          {
            size: '',
            quote: '',
            spece: ''
          }
        ]
      },
      // 起运港
      ports: [],
      // 修改产品报价对话框
      editDialogVisible: false,
      // 修改产品报价变量
      editRank: {},
    }
  },
  methods: {
    // 格式化显示USD
    formatUSD(row, colum) {
      console.log('formatUSD')
      const val = row.quote.toFixed(2)
      return `$${val}`
    },
    // 港口信息列表
    portLoadAll() {
      return [
        { value: '天津,TIANJIN' },
        { value: '青岛,QINGDAO' },
        { value: '上海,SHANGHAI' },
        { value: '连云港,LIANYUNGANG' },
        { value: '天津港/青岛港,TIANJIN/QINGDAO' }
      ]
    },
    // 执行港口查询
    portQuerySearch(queryString, cb) {
      console.log('portQuerySearch')
      cb(this.ports)
    },
    // 港口选择事件
    portHandleSelect(item) {
      console.log('portHandleSelect')
      console.log(item)
    },
    // 添加分类价格
    addAssort(rankArray, index) {
      console.log('addAssort')
      rankArray.assort.splice(index + 1, 0, { size: '', quote: '', spece: '' })
    },
    // 删除分类价格
    delAssort(rankArray, index) {
      console.log('delAssort')
      // 不能删除唯一的一个分类报价
      if (rankArray.assort.length > 1) {
        rankArray.assort.splice(index, 1)
      }
    },
    // 向上移动
    upAssort(rankArray, index) {
      console.log('upAssort')
      if (index > 0) {
        const to = JSON.parse(JSON.stringify(rankArray.assort[index]))
        const from = JSON.parse(JSON.stringify(rankArray.assort[index - 1]))
        this.$set(rankArray.assort, index - 1, to)
        this.$set(rankArray.assort, index, from)
      }
    },
    // 向下移动
    downAssort(rankArray, index) {
      console.log('downAssort')
      if (index < rankArray.assort.length - 1) {
        const to = JSON.parse(JSON.stringify(rankArray.assort[index]))
        const from = JSON.parse(JSON.stringify(rankArray.assort[index + 1]))
        this.$set(rankArray.assort, index + 1, to)
        this.$set(rankArray.assort, index, from)
      }
    },
    // 添加级别
    addRank() {
      // 添加到级别列表
      console.log('addRank')
      this.$refs.addRankFromRef.validate(async val => {
        if (!val) return
        // 赋值产品分类
        this.rank.product = this.id
        const { data: res } = await this.$http.post('/rank/create/v1', { rank: this.rank })
        if (res.meta.status !== 200) {
          return this.$message.err(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.addDialogVisible = false
        // 刷新列表
        this.listRank()
      })
    },

    // 关闭事件,清空新增对话框
    rankNewDialogClose() {
      console.log('rankDialogClose')
      this.$refs.addRankFromRef.resetFields()
      this.rank.assort = [{ size: '', quote: '', spece: '' }]
    },
    // 产品价格列表
    async listRank() {
      console.log('listRank')
      console.log(this.id)
      const { data: res } = await this.$http.get('/rank/list/v1', {
        params: {
          product: this.id
        }
      })

      // 整理数据库ranks的数据结构，符合Element Table 的数据格式要求
      this.ranks = []
      const { ranks } = res.data
      for (const i in ranks) {
        this.ranks[i] = {}
        this.ranks[i]._id = ranks[i]._id
        this.ranks[i].level = ranks[i].level
        const assort = []
        for (const j in ranks[i].assort) {
          assort[j] = {}
          assort[j].level = ranks[i].level
          assort[j].port = ranks[i].port
          assort[j].description = ranks[i].description
          assort[j].size = ranks[i].assort[j].size
          assort[j].quote = ranks[i].assort[j].quote
          assort[j].spece = ranks[i].assort[j].spece
        }
        this.ranks[i].assort = assort
      }
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // console.log(this.ranks)
    },
    // 合并列
    rankSpan({ row, column, rowIndex, columnIndex }) {
      console.log('objectSpan')
      const _ROW = 100
      // 合并级别
      if (columnIndex === 0) {
        if (rowIndex === 0) return [_ROW, 1]
        return [0, 0]
      }
      // 合并港口
      if (columnIndex === 1) {
        if (rowIndex === 0) return [_ROW, 1]
        return [0, 0]
      }
    },
    // 打开更新对话框
    async openRankDialog(id, level) {
      console.log('openRankDialog')
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('/rank/info/v1', {
        params: {
          _id: id,
          level
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editRank = res.data.rank
    },
    // 更新分类报价
    updateRankDialog() {
      console.log('updateRankDialog')
      this.$refs.editRankFromRef.validate(async val => {
        if (!val) return
        // 时间属性由数据库自动更新
        delete this.editRank.createdAt
        delete this.editRank.updatedAt
        // 更新产品分类报价
        const { data: res } = await this.$http.post('/rank/update/v1', { rank: this.editRank })
        if (res.meta.status !== 200) {
          return this.$message.err(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.editDialogVisible = false
        // 刷新列表
        this.listRank()
      })
    },
    // 删除产品分类报价
    async deleteRank(id) {
      console.log('deleteRank')
      console.log(id)
      const { data: res } = await this.$http.get('/rank/delete/v1', {
        params: {
          _id: id
        }
      })

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      // 刷新列表
      this.listRank()
    },
    // 关闭编辑Rank对话框触发的事件
    rankEditDialogClose() {
      console.log('rankEditDialogClose')
      this.$refs.editRankFromRef.resetFields()
      this.editRank = {}
    }
  },
  created() {
    // 返回产品列表
    console.log('created')
    this.listRank()
  },
  mounted() {
    // 港口信息加载
    console.log('mounted')
    this.ports = this.portLoadAll()
  }
}
</script>

<style lang="less">
.col-button {
  text-align: right;
}

.col-rank-header {
  min-height: 28px;
  margin-bottom: 0px;
  background: #e5e9f2;
  align-items: center;
  display: flex;
  font-size: 14px;
  font-weight: bold;
  color: #909399;
  padding-left: 10px;
}

.el-col-rank-Right {
  min-height: 28px;
  margin-bottom: 0px;
  background: #e5e9f2;
  text-align: right;
}
.table-rank {
  margin-top: 0px !important;
  margin-bottom: 12px;
}
</style>
