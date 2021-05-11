<template>
  <div>
    <el-card class="box-card">
      <el-row :gutter="10">
        <el-col :span="7">
          <el-form-item label="合同编号:"
            label-width="85px"
            prop="current.orderID"
            :rules="[{ required: true, message: '合同编号不能为空！', trigger: 'blur' }]">
            <el-input v-model="make.current.orderID" placeholder="采购合同编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            label="买方:"
            prop="current.purchaser"
            :rules="[{ required: true, message: '卖方名称不能为空！', trigger: 'change' }]">
            <el-autocomplete
              v-model="make.current.purchaser"
              :fetch-suggestions="purchaserQuerySearch"
              placeholder="输入买方公司名称"
              @select="purchaserHandleSelect"
              style="width:100%"
            >
            </el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="货币:">
            <el-radio-group v-model="make.current.currencyType">
              <el-radio label="RMB">RMB</el-radio>
              <el-radio label="USD">USD</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="7">
          <el-form-item
            label="签订日期:"
            label-width="85px"
            prop="current.signingDate"
            :rules="[{ required: true, message: '合同签订日期不能为空！', trigger: 'blur' }]">
            <el-date-picker
              v-model="make.current.signingDate"
              type="date"
              style="width:100%"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="合同签订日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item
            label="卖方:"
            prop="current.factoryName"
            :rules="[{ required: true, message: '卖方名称不能为空！', trigger: 'change' }]">
            <el-autocomplete
              v-model="make.current.factoryName"
              :fetch-suggestions="factoryQuerySearch"
              placeholder="输入买方公司名称"
              @select="factoryHandleSelect"
              style="width:100%"
            >
            </el-autocomplete>
            <!-- <el-input v-model="make.current.factoryName" placeholder="卖方公司名称"></el-input> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="22">
          <el-card class="box-card">
            <div slot="header">
              <span>订单</span>
            </div>
            <el-row :gutter="10" v-for="(sProduct, sIndex) in make.source.offerSheet.products" :key="sIndex">
              <el-col :span="24">
                <el-row>
                  <el-col :span="24">
                    <el-row>
                      <el-col :span="8">
                        名称：<span v-text="sProduct.name"></span>
                      </el-col>
                      <el-col :span="4">
                        单位：<span v-text="getUnit(sProduct.unit)"></span>
                      </el-col>
                      <el-col :span="11">
                        <div style="float: right;">
                          <el-button type="primary" @click="productToRight(sProduct)" size="mini" icon="el-icon-sort-down"></el-button>
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row v-for="(sQuotation, sQIndex) in sProduct.quotations" :key="sQIndex">
                  <el-col :span="6">
                    <el-form-item label="粒度:" class="offerSheet-el-form-item">
                      <span v-text="sQuotation.size" class="size__text"></span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label="数量:" class="offerSheet-el-form-item">
                      <el-input-number
                        v-model="sQuotation.quantity"
                        :precision="3"
                        :controls="false"
                        :disabled="true"
                        style="width:100%"
                      ></el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <div style="text-align: left; padding-left: 18px;">
                      <el-button @click="quotationToRight(sIndex, sProduct, sQuotation)" icon="el-icon-arrow-right" size="mini"></el-button>
                    </div>
                  </el-col>
                </el-row>
                <div style="min-height: 10px;"></div>
                <el-divider content-position="left" v-if="sIndex < make.source.offerSheet.products.length - 1 ">产品</el-divider>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" class="offerSheet-el-form-item">
                <div style="padding-bottom: 5px;"></div>
              </el-col>
              <el-col :span="10" class="offerSheet-el-form-item">
                <el-form-item label="总量:">
                  <span v-text="make.source.offerSheet.count" class="size__text"></span>
                </el-form-item>
              </el-col>
              <el-col :span="8" class="offerSheet-el-form-item"></el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
      <div style="min-height:8px;"></div>
      <el-row :gutter="10">
        <el-col :span="22">
          <el-card class="box-card">
            <div slot="header">
              <span>采购</span>
            </div>
            <div style="min-height: 80px;">
              <el-row :gutter="10" v-for="(tItem, tIndex) in make.target.offerSheet.products" :key="tIndex">
                <el-col :span="24">
                  <el-row>
                    <el-col :span="24">
                      <el-row>
                        <el-col :span="8">
                          名称：<span v-text="tItem.name"></span>
                        </el-col>
                        <el-col :span="4">
                          单位：<span v-text="getUnit(tItem.unit)"></span>
                        </el-col>
                        <el-col :span="11">
                          <div style="float: right;">
                            <el-button type="primary" @click="productToLeft(tIndex, tItem)" size="mini" icon="el-icon-sort-up"></el-button>
                          </div>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <el-row v-for="(tQuotation, tcIndex) in tItem.quotations" :key="tcIndex">
                    <el-col :span="6">
                      <el-form-item label="粒度:" class="offerSheet-el-form-item">
                        <span v-text="tQuotation.size" class="size__text"></span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="7">
                      <el-form-item label="数量:" class="offerSheet-el-form-item">
                        <el-input-number
                          v-model="tQuotation.quantity"
                          @change="
                            (currentValue, oldValue) => {
                              changeQuotation(currentValue, oldValue, tQuotation)
                            }
                          "
                          :precision="3"
                          :controls="false"
                          style="width:100%"
                        >
                        </el-input-number>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-button-group style="float: left; padding-left: 18px;">
                        <el-button @click="quotationToLeft(tIndex, tItem, tcIndex, tQuotation)" icon="el-icon-minus" size="mini"></el-button>
                        <el-button @click="upQuotation(tItem, tcIndex, tQuotation)" icon="el-icon-top" size="mini"></el-button>
                        <el-button @click="downQuotation(tItem, tcIndex, tQuotation)" icon="el-icon-bottom" size="mini"></el-button>
                      </el-button-group>
                    </el-col>
                  </el-row>
                  <el-divider content-position="left" v-if="tIndex < make.target.offerSheet.products.length - 1 ">产品</el-divider>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6" class="offerSheet-el-form-item">
                  <div style="padding-bottom: 5px;"></div>
                </el-col>
                <el-col :span="10" class="offerSheet-el-form-item">
                  <el-form-item label="总量:" v-if="make.target.offerSheet.products.length > 0">
                    <span v-text="make.target.offerSheet.count" class="size__text"></span>
                  </el-form-item>
                </el-col>
                <el-col :span="8" class="offerSheet-el-form-item"></el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import XEUtils from 'xe-utils'
import OrderInfo from '../form/OrderInfo'

export default {
  name: 'ProduceInfo',
  props: {
    contract: {
      type: Object,
      required: true
    },
    make: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 潜在买方名称潜在列表
      purchaserAll: [
        { value: OrderInfo.SinabuddyChineseName[0], address: OrderInfo.SinabuddyChineseName[0] },
        { value: OrderInfo.SinabuddyChineseName[1], address: OrderInfo.SinabuddyChineseName[1] }
      ],
      // 工厂列表
      factorys: [],
    }
  },
  methods: {
    // 加载工厂列表数据
    async loadData() {
      console.log('loadData...')
      // 加载工厂列表
      {
        const { data: res } = await this.$http.get('/factory/list/v1')
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        for (const factory of res.data.factorys) {
          this.factorys.push({ value: factory.factoryName, address: factory.factoryName })
        }
      }
      // 获取这个订单下采购合同的数量
      {
        const { data: res } = await this.$http.get('/make/makeCount/v1', {
          params: {
            orderID: this.contract.orderID
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        console.log('this.make.current.orderID:', this.make.current.orderID)
        this.make.current.orderID = `${this.make.current.orderID}-${res.data.makeCount + 1}`
        console.log('this.make.current.orderID:', this.make.current.orderID)
      }
    },
    // 获取订单产品的单位中文
    getUnit(key) {
      console.log('getUnit')
      return OrderInfo.UnitInfo.get(key)
    },
    // 买方名称
    purchaserQuerySearch(queryString, cb) {
      console.log('purchaserQuerySearch', queryString)
      const purchaser = this.purchaserAll
      const results = queryString ? purchaser.filter(this.purchaserCreateFilter(queryString)) : purchaser
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    // 买方名称过滤
    purchaserCreateFilter(queryString) {
      console.log('purchaserCreateFilter', queryString)
      return restaurant => restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
    },
    // 选择买方名称
    purchaserHandleSelect(item) {
      console.log('purchaserHandleSelect')
      console.log(item)
    },

    // 卖方名称
    factoryQuerySearch(queryString, cb) {
      console.log('factoryQuerySearch', queryString)
      const purchaser = this.factorys
      const results = queryString ? purchaser.filter(this.factoryCreateFilter(queryString)) : purchaser
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    // 卖方名称过滤
    factoryCreateFilter(queryString) {
      console.log('purchaserCreateFilter', queryString)
      return restaurant => restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
    },
    // 选择卖方名称
    factoryHandleSelect(item) {
      console.log('purchaserHandleSelect')
      console.log(item)
    },
    // 移动产品到工厂
    productToRight(item) {
      console.log('productToRight', item)
      // 判断某个产品是否已经添加到工厂
      let flag = true
      const { products } = this.make.target.offerSheet
      products.map(product => {
        if (product._id === item._id) flag = false
        return product
      })
      // 该产品已经添加，返回
      if (!flag) return
      // 产品添加到工厂
      const cloneItem = JSON.parse(JSON.stringify(item))
      // 产品设置指标
      cloneItem.norm = ''
      // 产品中文名称
      cloneItem.chineseName = ''
      for (const quotation of cloneItem.quotations) {
        // 设置采购价格属性
        quotation.purchasing = 0.00
        // 设置每个采购项的指标
        quotation.norm = ''
      }
      products.splice(products.length, 0, cloneItem)
      // 将订单产品下的所有粒度的数量清零
      for (const quotation of item.quotations) {
        quotation.quantity = 0
      }
    },
    // 产品从工厂移动到订单中
    productToLeft(index, item) {
      console.log('productToLeft', item)
      const { products } = this.make.source.offerSheet
      // 循环订单中的产品
      products.map(product => {
        // 判断工厂中的产品和订单中的产品相同
        if (product._id === item._id) {
          // 把工厂中订单的粒度选中的数量恢复到订单中的产品粒度中
          for (const quotation of product.quotations) {
            for (const q of item.quotations) {
              if (quotation._id === q._id) {
                quotation.quantity += q.quantity
              }
            }
          }
        }
        return product
      })
      // 删除选中的元素
      this.make.target.offerSheet.products.splice(index, 1)
    },
    // 订单某一个产品下的某个粒度移动到工厂中
    quotationToRight(index, item, qItem) {
      console.log('quotationToRight', index, item, qItem)
      // copy 订单中的某一个产品
      const cloneItem = JSON.parse(JSON.stringify(item))
      // 删除下面的所有粒度
      cloneItem.quotations.splice(0, cloneItem.quotations.length)
      // 拷贝某个粒度
      const cloneQItem = JSON.parse(JSON.stringify(qItem))
      // 设置购买价格
      cloneQItem.purchasing = 0.00
      // 设置购买指标
      cloneQItem.norm = ''
      // 选中的某个粒度添加到空的产品中
      cloneItem.quotations.push(cloneQItem)
      // 原始粒度数量清零
      qItem.quantity = 0

      const { products } = this.make.target.offerSheet
      let currentProduct = null
      let current = 0
      products.map((p, i) => {
        if (p._id === cloneItem._id) {
          currentProduct = p
          current = i
        }
        return p
      })
      if (currentProduct) {
        // 该产品分类已经存在工厂产品分类中
        const cloneProduct = JSON.parse(JSON.stringify(currentProduct))
        cloneProduct.quotations.splice(cloneProduct.quotations.length, 0, ...cloneItem.quotations)
        cloneProduct.quotations = this.deduplicationQuotation(cloneProduct.quotations)
        products.splice(current, 1, cloneProduct)
      } else {
        // 该产品分类还没有添加到工厂产品分类中
        products.push(cloneItem)
      }
    },
    // 从工厂的列表中移回quotation到订单中
    quotationToLeft(index, item, qIndex, qItem) {
      console.log('quotationToLeft', item, qIndex, qItem)
      const sourceQuotation = this.getSourceQuotation(qItem)
      sourceQuotation.quantity += qItem.quantity
      item.quotations.splice(qIndex, 1)
      if (item.quotations.length === 0) {
        const { products } = this.make.target.offerSheet
        products.splice(index, 1)
      }
    },
    // 修改分配给工厂中的粒度数量，并同步到订单中
    changeQuotation(value, oldValue, qItem) {
      console.log('changeQuotation', value, oldValue, qItem)
      const sourceQuotation = this.getSourceQuotation(qItem)
      const originalQuotation = this.getOriginalQuotation(qItem)
      let diff = 0
      if (value < originalQuotation.quantity) {
        console.log(value < originalQuotation.quantity)
        diff = originalQuotation.quantity - value
        sourceQuotation.quantity = diff
      } else {
        // 如果修改的值超出原始值，则不修改，恢复到上一个oldValue
        const { products } = this.make.target.offerSheet
        for (const product of products) {
          for (const q of product.quotations) {
            if (q._id === qItem._id) {
              this.$nextTick(() => { q.quantity = oldValue })
              this.$message({ message: '超出订单中原始值，无法执行！', type: 'warning' })
            }
          }
        }
      }
    },

    // 在source中找到quotation
    getSourceQuotation(qItem) {
      console.log('getTargetQuotation')
      const { products } = this.make.source.offerSheet
      let qutation = null
      products.map(product => product.quotations.map(q => {
        if (q._id === qItem._id) {
          qutation = q
        }
        return q
      }))
      return qutation
    },
    // 在original中找到quotation
    getOriginalQuotation(qItem) {
      console.log('getOriginalQuotation')
      const { products } = this.make.original.offerSheet
      let qutation = null
      products.map(product => product.quotations.map(q => {
        if (q._id === qItem._id) {
          qutation = q
        }
        return q
      }))
      return qutation
    },
    // 粒度去重
    deduplicationQuotation(arr) {
      console.log('deduplicationQuotation', arr)
      const flag = {}
      return arr.reduce((preValue, item) => {
        flag[item._id] ? '' : flag[item._id] = true && preValue.push(item)
        return preValue
      }, [])
    },
    // 向上移动Quotation
    upQuotation(item, qIndex, qItem) {
      console.log('upQuotation', item, qIndex, qItem)
      if (qIndex > 0) {
        const to = JSON.parse(JSON.stringify(qItem))
        const from = JSON.parse(JSON.stringify(item.quotations[qIndex - 1]))
        this.$set(item.quotations, qIndex - 1, to)
        this.$set(item.quotations, qIndex, from)
        console.log(item)
      }
    },
    // 向下移动Quotation
    downQuotation(item, qIndex, qItem) {
      console.log('downQuotation', item, qIndex, qItem)
      if (qIndex < item.quotations.length - 1) {
        const to = JSON.parse(JSON.stringify(qItem))
        const from = JSON.parse(JSON.stringify(item.quotations[qIndex + 1]))
        this.$set(item.quotations, qIndex + 1, to)
        this.$set(item.quotations, qIndex, from)
        console.log(item)
      }
    },
    // 计算产品数量
    quotationSum(quotations) {
      console.log('quotationSum', quotations)
      let count = 0
      for (const quotation of quotations) {
        // count += quotation.quantity
        count = XEUtils.add(count, quotation.quantity)
      }
      return count
    },
    // 计算订单数量总数
    productSum(path) {
      console.log('productSum')
      const countMap = new Map()
      const { products } = path === 'source' ? this.make.source.offerSheet : this.make.target.offerSheet
      for (const product of products) {
        const { quotations } = product
        const count = this.quotationSum(quotations)
        product.count = count
        if (countMap.get(product.unit)) {
          // countMap.set(product.unit, countMap.get(product.unit) + count)
          countMap.set(product.unit, XEUtils.add(countMap.get(product.unit), count))
        } else {
          countMap.set(product.unit, count)
        }
      }
      return countMap
    },
  },
  // 监听订单、工厂产品数量的变化
  watch: {
    'make.source.offerSheet': {
      handler() {
        console.log('watch-make.source.offerSheet')
        // 计算合同总价
        const countMap = this.productSum('source')
        if (countMap) {
          console.log(countMap)
          let countStr = ''
          for (const item of countMap.entries()) {
            countStr += `${item[1]} ${item[0]} `
          }
          this.make.source.offerSheet.count = countStr
        }
      },
      immediate: true,
      deep: true
    },
    'make.target.offerSheet': {
      handler() {
        console.log('watch-make.target.offerSheet')
        // 计算分配给工厂产生数量
        const countMap = this.productSum('target')
        if (countMap) {
          console.log(countMap)
          let countStr = ''
          for (const item of countMap.entries()) {
            countStr += `${item[1]} ${item[0]} `
          }
          this.make.target.offerSheet.count = countStr
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    // 加载初始化数据
    this.loadData()
    // 组件加载时执行
    this.productSum('source')
  }
}
</script>

<style lang="less" scoped>
.box-card {
  font-size: 14px;
}
&/deep/.el-card__header {
  padding: 5px 16px !important;
}
&/deep/.el-card__body {
  padding-top: 10px;
  padding-left: 18px;
  padding-right: 8px;
}
.product-div {
  padding-bottom: 5px;
}
.offerSheet-el-form-item {
  margin-bottom: 5px;
}
&/deep/.el-form-item__label {
  font-size: 10px;
}
&/deep/.size__text {
  font-size: 10px;
}
</style>
