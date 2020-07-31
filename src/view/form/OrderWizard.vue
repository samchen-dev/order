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
        <el-col :span="21">
          <el-form ref="contractFormRef" :model="contract" label-width="50px" size="mini">
            <!-- 公司信息 -->
            <div v-if="active === 0">
              <el-row :gutter="10">
                <el-col :span="6">
                  <el-form-item
                    label="编号"
                    prop="orderID"
                    :rules="[
                      { required: true, message: '合同编号不能为空！', trigger: 'blur' },
                      { min: 8, max: 8, message: '合同编号长度8位,已SBM开头！', trigger: 'blur' }
                    ]"
                  >
                    <el-input placeholder="合同编号(SBM开头)" v-model="contract.orderID"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="PO">
                    <el-input placeholder="客户PO编号" v-model="contract.PO"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="日期" prop="orderDate" :rules="[{ required: true, message: '合同日期不能为空！', trigger: 'blur' }]">
                    <el-date-picker
                      v-model="contract.orderDate"
                      align="right"
                      type="date"
                      placeholder="选择日期"
                      :picker-options="pickerOptions"
                      size="mini"
                      style="width:100%"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="地点" prop="location" :rules="[{ required: true, message: '合同地点不能为空！', trigger: 'blur' }]">
                    <el-input v-model="contract.location"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="24"> </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <span>卖方</span>
                      <el-radio-group style="float: right;" v-model="contract.sellerType" type="vertical" @change="sellerChange">
                        <el-radio :label="0">HK</el-radio>
                        <el-radio :label="1">ZH</el-radio>
                        <el-radio :label="2">其它</el-radio>
                      </el-radio-group>
                    </div>
                    <el-form-item label="名称" prop="seller" :rules="[{ required: true, message: '卖方名称不能为空！', trigger: 'blur' }]">
                      <el-input placeholder="公司名称" v-model="contract.seller"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="sellerAddress" :rules="[{ required: true, message: '卖方地址不能为空！', trigger: 'blur' }]">
                      <el-input placeholder="公司地址" v-model="contract.sellerAddress" type="textarea" :rows="2"></el-input>
                    </el-form-item>
                    <el-form-item label="银行" prop="bank" :rules="[{ required: true, message: '银行信息不能为空！', trigger: 'blur' }]">
                      <el-input placeholder="银行信息" v-model="contract.bank" type="textarea" :rows="3"></el-input>
                    </el-form-item>
                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-form-item label="电话" prop="sellerTEL">
                          <el-input v-model="contract.sellerTEL"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="传真" prop="sellerFAX">
                          <el-input v-model="contract.sellerFAX"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <span>买方</span>
                    </div>
                    <el-form-item label="名称" prop="buyer" :rules="[{ required: true, message: '买方名称不能为空！', trigger: 'blur' }]">
                      <el-input placeholder="名称" v-model="contract.buyer"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="buyerAddress" :rules="[{ required: true, message: '买方地址不能为空！', trigger: 'blur' }]">
                      <el-input placeholder="买方地址" v-model="contract.buyerAddress" type="textarea" :rows="2"></el-input>
                    </el-form-item>
                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-form-item label="电话" prop="buyerTEL">
                          <el-input v-model="contract.buyerTEL"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="传真" prop="buyerFAX">
                          <el-input v-model="contract.buyerFAX"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-card>
                </el-col>
              </el-row>
            </div>
            <!-- 产品报价 -->
            <div v-else-if="active === 1">
              <el-row :gutter="10" v-for="(item, index) in contract.offerSheet.products">
                <el-col :span="21">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item class="offerSheet-el-form-item" label="产品" :prop="'offerSheet.products.' + index + '.name'">
                        <el-input v-model="item.name"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item class="offerSheet-el-form-item" label="单位" :prop="'offerSheet.products.' + index + '.unit'">
                        <el-select v-model="item.unit" allow-create filterable default-first-option placeholder="选择单位">
                          <el-option label="MT" value="MT" selected></el-option>
                          <el-option label="PCS" value="PCS"></el-option>
                          <el-option label="KGS" value="KGS"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item class="offerSheet-el-form-item" label="金额" :prop="'offerSheet.products.' + index + '.amount'">
                        <el-input-number v-model="item.amount" style="width:100%" :precision="2" :controls="false" :disabled="true"></el-input-number>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-for="(quotation, cIndex) in item.quotations">
                    <el-col :span="5">
                      <el-form-item
                        class="offerSheet-el-form-item"
                        label="粒度"
                        :prop="'offerSheet.products.' + index + '.quotations.' + cIndex + '.size'"
                      >
                        <el-input v-model="quotation.size"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item
                        class="offerSheet-el-form-item"
                        label="数量"
                        :prop="'offerSheet.products.' + index + '.quotations.' + cIndex + '.quantity'"
                      >
                        <el-input-number
                          style="width:100%"
                          v-model="quotation.quantity"
                          :precision="3"
                          controls-position="right"
                          :controls="false"
                        ></el-input-number>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item
                        class="offerSheet-el-form-item"
                        label="单价"
                        :prop="'offerSheet.products.' + index + '.quotations.' + cIndex + '.price'"
                      >
                        <el-input-number
                          style="width:100%"
                          v-model="quotation.price"
                          :precision="2"
                          controls-position="right"
                          :controls="false"
                        ></el-input-number>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item
                        class="offerSheet-el-form-item"
                        label="金额"
                        :prop="'offerSheet.products.' + index + '.quotations.' + cIndex + '.total'"
                      >
                        <el-input-number
                          style="width:100%"
                          v-model="quotation.total"
                          :precision="2"
                          :disabled="true"
                          :controls="false"
                        ></el-input-number>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4" style="text-align:right">
                      <el-button-group>
                        <el-button icon="el-icon-plus" @click="addQuotation(index, cIndex)" size="mini"></el-button>
                        <el-button icon="el-icon-minus" @click="delQuotation(index, cIndex)" size="mini"></el-button>
                      </el-button-group>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="3">
                  <el-button-group>
                    <el-button type="primary" icon="el-icon-plus" @click="addQuotation(index, 0)" size="mini"></el-button>
                    <el-button type="primary" icon="el-icon-minus" @click="delProduct(index)" size="mini"></el-button>
                  </el-button-group>
                </el-col>
              </el-row>
              <el-row :gutter="10" v-for="(item, index) in contract.offerSheet.attachs">
                <el-col :span="21">
                  <el-row>
                    <el-col :span="18">
                      <el-form-item class="offerSheet-el-form-item" label="附加" :prop="'offerSheet.attachs.' + index + '.title'">
                        <el-input v-model="item.title"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item class="offerSheet-el-form-item" label="金额" :prop="'offerSheet.attachs.' + index + '.amount'">
                        <el-input-number
                          style="width:100%"
                          v-model="item.amount"
                          :precision="2"
                          controls-position="right"
                          :controls="false"
                        ></el-input-number>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="3">
                  <el-button type="primary" icon="el-icon-minus" @click="delAttach(index)" size="mini"></el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="5"><div class="bg-purple-dark"></div></el-col>
                    <el-col :span="13">
                      <div class="bg-purple-dark">
                        <el-form-item label="总量:">
                          <span>{{ contract.offerSheet.count }}</span>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="bg-purple-dark">
                        <el-form-item label="共计:">
                          <span>USD {{ contract.offerSheet.sum }}</span>
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="3">
                  <div class="bg-purple-dark"></div>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="24">
                  <el-button-group>
                    <el-button type="primary" @click="addProduct()" size="mini">添加产品</el-button>
                    <el-button type="primary" @click="addAttach()" size="mini">添加条款</el-button>
                  </el-button-group>
                </el-col>
              </el-row>
            </div>
            <div v-else-if="active === 2">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="包装" prop="packaging" :rules="[{ required: true, message: '请选择合适的包装类型！', trigger: 'blur' }]">
                    <el-select v-model="contract.packaging" allow-create filterable default-first-option placeholder="选择包装" style="width:100%">
                      <el-option label="IN 25KG PP BAGS ON PALLET." value="IN 25KG PP BAGS ON PALLET." selected></el-option>
                      <el-option label="IN 55LB PAPER BAG*40 BAGS ON ONE PALLET." value="IN 55LB PAPER BAG*40 BAGS ON ONE PALLET."></el-option>
                      <el-option label="IN 1MT BIG BAGS." value="IN 1MT BIG BAGS."></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="起运" prop="loading" :rules="[{ required: true, message: '请选择合适的起运港！', trigger: 'blur' }]">
                    <el-select v-model="contract.loading" allow-create filterable default-first-option placeholder="起运港" style="width:100%">
                      <el-option label="XINGANG, CHINA" value="XINGANG, CHINA" selected></el-option>
                      <el-option label="QINGDAO, CHINA" value="QINGDAO, CHINA"></el-option>
                      <el-option label="SHANGHAI, CHINA" value="SHANGHAI, CHINA"></el-option>
                      <el-option label="XINGANG, CHINA / QINGDAO, CHINA" value="XINGANG, CHINA / QINGDAO, CHINA"></el-option>
                      <el-option label="ANY PORT IN CHINA" value="ANY PORT IN CHINA"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="目的" prop="destination" :rules="[{ required: true, message: '请填写目的港！', trigger: 'blur' }]">
                    <el-input v-model="contract.destination" placeholder="目的港"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <span>交货方式</span>
                    </div>
                    <div class="div-radio-group">
                      <el-radio-group v-model="contract.locationsType" @change="locationsChange">
                        <el-radio label="FOB">FOB</el-radio>
                        <el-radio label="CIF">CIF</el-radio>
                        <el-radio label="DDU">CFR</el-radio>
                        <el-radio label="DDP">DDU</el-radio>
                        <el-radio label="CFR">DDP</el-radio>
                        <el-radio label="FDA">FDA</el-radio>
                        <el-radio label="OTHER">OTHER</el-radio>
                      </el-radio-group>
                    </div>
                    <el-form-item label="条款" prop="locations">
                      <el-input v-model="contract.locations" type="textarea" :rows="3"></el-input>
                    </el-form-item>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <span>付款方式</span>
                    </div>
                    <div class="div-radio-group">
                      <el-radio-group v-model="contract.paymentType" @change="paymentChange">
                        <el-radio :label="0">T/T</el-radio>
                        <el-radio :label="1">D/A</el-radio>
                        <el-radio :label="2">D/P</el-radio>
                        <el-radio :label="3">LC</el-radio>
                        <el-radio :label="4">OTHER</el-radio>
                      </el-radio-group>
                    </div>
                    <el-form-item label="条款:" prop="payment">
                      <el-input v-model="contract.payment" type="textarea" :rows="3"></el-input>
                    </el-form-item>
                  </el-card>
                </el-col>
              </el-row>
            </div>
            <!-- 预览合同和发票 -->
            <div id="preview" v-else-if="active === 3" class="preview-div">
              <el-tabs type="border-card">
                <el-tab-pane label="合同预览">
                  <el-row>
                    <el-col :span="8">
                      <div style="min-height: 1px;"></div>
                    </el-col>
                    <el-col :span="8">
                      <div style="text-align:center; font-size:20px; font-weight:bold; min-height: 40px;">SALES CONTRACT</div>
                    </el-col>
                    <el-col :span="8">
                      <div style="text-align:right;">
                        <el-button-group>
                          <el-button size="mini">PDF 导出</el-button>
                          <el-button size="mini" @click="exportExcel()">Excel 导出</el-button>
                        </el-button-group>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <div>SELLER:{{ contract.seller }}</div>
                      <div>ADDRESS:{{ contract.sellerAddress }}</div>
                      <div style="word-spacing:10px">
                        <span>TEL:{{ contract.sellerTEL }}</span> <span>FAX:{{ contract.sellerFAX }}</span>
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
                      <div>BUYER:{{ contract.buyer }}</div>
                      <div>ADDRESS:{{ contract.buyerAddress }}</div>
                      <div style="word-spacing:10px">
                        <span>TEL:{{ contract.buyerTEL }}</span> <span>FAX:{{ contract.buyerFAX }}</span>
                      </div>
                    </el-col>
                    <el-col :span="12"></el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24"><div class="grid-Blank-line"></div></el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24"
                      ><div class="preview-paragraph">
                        THIS CONTRACT IS MADE BY AND AGREED BETWEEN THE SELLER AND BUYER, IN ACCORDANCE WITH THE TERMS AND CONDITIONS STIPULATED
                        BELOW:
                      </div></el-col
                    >
                  </el-row>
                  <el-row>
                    <el-col :span="24"><div class="preview-paragraph">1. SPECIFICATION, QUANTITY AND PRICE:</div></el-col>
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
                    <el-col :span="6" class="preview-cell"
                      ><div>{{ contract.locations }}</div></el-col
                    >
                  </el-row>
                  <el-row v-for="(item, index) in contract.offerSheet.products">
                    <el-col :span="24" class="preview-border-left-right">
                      <div class="preview-cell">{{ item.name }}</div>
                      <el-row v-for="(quotation, cIndex) in item.quotations">
                        <el-col :span="6" class="preview-cell"
                          ><div>{{ quotation.size }}</div></el-col
                        >
                        <el-col :span="6" class="preview-cell"
                          ><div>{{ quotation.quantity + ' ' + item.unit }}</div></el-col
                        >
                        <el-col :span="6" class="preview-cell"
                          ><div>{{ 'USD ' + quotation.price + ' / ' + item.unit }}</div></el-col
                        >
                        <el-col :span="6" class="preview-cell"
                          ><div>{{ 'USD ' + quotation.total }}</div></el-col
                        >
                      </el-row>
                    </el-col>
                  </el-row>
                  <el-row class="preview-border-left-right" v-for="(item, index) in contract.offerSheet.attachs">
                    <el-col :span="18" class="preview-right preview-cell">
                      <div>{{ item.title }}</div>
                    </el-col>
                    <el-col :span="6" class="preview-cell">
                      <div>{{ 'USD ' + item.amount }}</div>
                    </el-col>
                  </el-row>
                  <el-row class="preview-border-top">
                    <el-col :span="6" class="preview-cell"><div>TOTAL:</div></el-col>
                    <el-col :span="6" class="preview-cell"
                      ><div>{{ contract.offerSheet.count }}</div></el-col
                    >
                    <el-col :span="6" class="preview-cell"><div style="min-height: 1px;"></div></el-col>
                    <el-col :span="6" class="preview-cell"
                      ><div style="word-spacing:2px">USD {{ contract.offerSheet.sum }}</div></el-col
                    >
                  </el-row>
                  <el-row>
                    <el-col :span="24"
                      ><div class="preview-paragraph">
                        2. INSURANCE: INVOICE VALUE PLUS 10% COVERING ALL RISKS TO BE COVERED BY THE SELLER.
                      </div></el-col
                    >
                  </el-row>
                  <el-row>
                    <el-col :span="24"
                      ><div class="preview-paragraph">3. PACKING:{{ contract.packaging }}</div></el-col
                    >
                  </el-row>
                  <el-row>
                    <el-col :span="24"
                      ><div class="preview-paragraph">
                        4. MARKS: SELLER’S PACKING.THE MARKS WITHOUT “MADE IN CHINA” OR SPECIAL MARKS SHOWED ON PACKAGE AS THE BUYER'S REQUEST, THE
                        BUYER SHALL BE LIABLE FOR ALL THE CONSEQUENCE AND EXPENSES IF ANY.
                      </div></el-col
                    >
                  </el-row>
                  <el-row>
                    <el-col :span="24"
                      ><div class="preview-paragraph">5. PORT OF LOADING: {{ contract.loading }}</div></el-col
                    >
                  </el-row>
                  <el-row>
                    <el-col :span="24"
                      ><div class="preview-paragraph">6. PORT OF DESTINATION: {{ contract.destination }}.</div></el-col
                    >
                  </el-row>
                  <el-row>
                    <el-col :span="24"
                      ><div class="preview-paragraph">7. TERMS OF PAYMENT: {{ contract.payment }}</div></el-col
                    >
                  </el-row>
                  <el-row>
                    <el-col :span="24"
                      ><div class="preview-paragraph">8. DELIVERY TIME: IN ABOUT 30 WORKING DAYS AFTER THE SIGNED SALES CONTRACT.</div></el-col
                    >
                  </el-row>
                  <el-row>
                    <el-col :span="24"
                      ><div class="preview-paragraph">9. MORE OR LESS CLAUSE: 2% MORE OR LESS OF LOADING QUANTITY IS ALLOWED.</div></el-col
                    >
                  </el-row>
                  <el-row>
                    <el-col :span="24"
                      ><div class="preview-paragraph">
                        10. IF THE FLUCTUATION OF SEA FREIGHT IS ABOVE 30% BETWEEN THE CONTRACT DATE AND THE DELIVERY DATE, THE FREIGHT COST SHOULD BE
                        SETTLED THROUGH NEGOTIATION.
                      </div></el-col
                    >
                  </el-row>
                  <el-row>
                    <el-col :span="24"
                      ><div class="preview-paragraph">
                        11. SHIPPING DOCS: THE REQUESTED CUSTOM CLEARANCE DOCS SHOULD BE INFORMED BEFORE THE SHIPMENT. IF BUYER PROPOSE TO MODIFY OR
                        REQUEST ADDITATIONAL DOCS AFTER THE SHIPMENT, THE ADDITIONAL COSTS AND RESPONSIBILITY SHALL BE BORNE BY THE BUYER. THE
                        SHIPPING DOCUMENTS SHALL NOT BE SENT OUT DUE TO THE DELAY PAYMENT FROM THE BUYER, THE BUYER SHALL BE LIABLE FOR ALL THE
                        CONSEQUENCE AND EXPENSES IF ANY.
                      </div></el-col
                    >
                  </el-row>
                  <el-row>
                    <el-col :span="24"
                      ><div class="preview-paragraph">
                        12. FORCE MAJEURE: THE DELAYS OF DELIVERY OR NON-DELIVERY CAUSED BY THE FORCE MAJEURE OCCURRED DURING PRODUCTION OR SHIPMENT
                        TRANSSHIPMENT PROCESS (INCLUDING WAR, SERIOUS FIRE, FLOOD, TYPHOON, EARTHQUAKE, STRIKES, WEATHER CONDITION, ENVIRONMENTAL
                        PROTECTION CONDITION, GOVERNMENTAL ACTION AND THE OTHER INDIRECT THIRD PARTY EFFECT), THE SELLERS ARE NOT RESPONSIBLE FOR THE
                        DELAYS OR NON-DELIVERY IN THE EVENT OF FORCE MAJEURE AND ANY CONTIGENCIES BEYOND THE SELLERS’ CONTROL. THE SELLER SHALL HAVE
                        THE ADDITIONAL TIME NEEDED TO COMPLETE THE ORDER AND /OR THE RIGHT TO ALLOCATE THE AVAILABLE SUPPLY IN ANY MANNER IF SELECTS.
                      </div></el-col
                    >
                  </el-row>
                  <el-row>
                    <el-col :span="24"
                      ><div class="preview-paragraph">
                        13. CLAIM: CLAIMS FOR DAMAGE, QUANTITY AND QUALITY ISSUES SHOULD BE FILED BY THE BUYERS WITH THE SELLERS WITHIN 21 DAYS AFTER
                        THE ARRIVAL OF THE GOODS AT DESTINATION PORT OR PLACE SUBJECT TO ITEM 6, AND SUPPORTED BY SUFFICIENT EVIDENCE FOR SELLERS
                        REFERENCE. OTHERWISE, SUCH CLAIMS SHALL BE DEEMED WAIVED. ANY SHIPPING COSTS RELATED TO ANY APPROVED EXCHANGE OR REPLACEMENT
                        OF PRODUCTS WILL BE AT THE EXPENSE OF THE BUYER.
                      </div></el-col
                    >
                  </el-row>
                  <el-row>
                    <el-col :span="24"
                      ><div class="preview-paragraph">
                        14. ARBITRATION: ALL DISPUTES ARISING FROM THE EXECUTION OF OR IN CONNECTION WITH THIS CONTRACT, SHALL BE SETTLED AMICABLY
                        THROUGH FRIENDLY NEGOTIATION. IN CASE NO SETTLEMENT CAN BE REACHED THROUGH NEGOTIATION, THE CASE SHALL THEN BE SUBMITTED TO
                        CHINA INTERNATIONAL ECONOMIC AND TRADE ARBITRATION COMMISSION (CIETAC) IN ACCORDANCE WITH ITS PROVISIONAL RULES OF PROCEDURE.
                        THE ARBITRAL AWARD IS FINAL AND BINDING UPON BOTH PARTIES. THE ARBITRATION FEES SHALL BE BORNE BY THE LOSING PARTY.
                      </div></el-col
                    >
                  </el-row>
                  <el-row>
                    <el-col :span="24"><div style="min-height:30px;"></div></el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12"><div>SIGNED BY THE SELLER</div></el-col>
                    <el-col :span="12"><div>SIGNED BY THE BUYER</div></el-col>
                  </el-row>
                </el-tab-pane>
                <el-tab-pane label="发票预览">发票预览</el-tab-pane>
              </el-tabs>
            </div>
            <div v-else-if="active === 4">
              完成！
            </div>
          </el-form>
          <div style="float: right;">
            <el-button style="margin-top: 12px;" @click="up()" size="mini">上一步</el-button>
            <el-button style="margin-top: 12px;" @click="next()" size="mini">下一步</el-button>
          </div>
        </el-col>
        <el-col :span="3">
          <el-steps :active="active" direction="vertical" :space="100" finish-status="success">
            <el-step title="步骤 1" description="公司信息"></el-step>
            <el-step title="步骤 2" description="产品价格"></el-step>
            <el-step title="步骤 3" description="交易条款"></el-step>
            <el-step title="步骤 4" description="合同预览"></el-step>
          </el-steps>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import XEUtils from 'xe-utils'
import OrderInfo from './OrderInfo'
import XLSX from 'xlsx'
import XLSXStyle from 'xlsx-style'
export default {
  name: 'orderWizard',
  data() {
    return {
      // 日期快捷键
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      // 激活步骤
      active: 0,
      // 订单
      contract: {
        // 合同编号
        orderID: 'SBM20123',
        // 客户PO编号
        PO: '',
        // 合同创建时间
        orderDate: '',
        // 地点
        location: 'ZHENGZHOU,CHINA',
        // 公司类型
        sellerType: 0,
        // 公司名称
        seller: '',
        // 公司地址
        sellerAddress: '',
        // 公司电话
        sellerTEL: '0086-371-55698532',
        // 公司传真
        sellerFAX: '0086-371-60153476',
        // 银行信息
        bank: '',
        // 客户名称
        buyer: 'ATEN ASINDIRICI TASLAR END.VE TIC.A.S.',
        //  客户地址
        buyerAddress: 'AKCABURGAZ MAH.2.CAD.117.SOK.NO:7 34500 ESENYURT-ISTANBUL/TURKEY.',
        // 客户电话
        buyerTEL: '+90(212)8865026',
        // 客户传真
        buyerFAX: '+90(212)8865030',
        // 报价单
        offerSheet: {
          // 产品
          products: [
            {
              // 产品名称
              name: '',
              // 该产品合计价格
              amount: 0,
              // 产品的单位（MT/PCS）
              unit: 'MT',
              // 该产品数量
              count: 0,
              // 该产品的粒度/数量/单价/单行合计价格
              quotations: []
            }
          ],
          // 附加协议
          attachs: [
            // {
            //   title: '',
            //   amount: 0
            // }
          ],
          // 共计数量
          count: '',
          // 共计金额
          sum: 0
        },
        // 包装
        packaging: 'IN 25KG PP BAGS ON PALLET.',
        // 起运港
        loading: 'XINGANG, CHINA.',
        destination: 'AMBARLI, TURKEY.',
        // 付款类型
        paymentType: 0,
        // 付款明细
        payment: '',
        // 交货类型
        locationsType: 'FOB',
        // 交货地点
        locations: ''
      }
    }
  },
  methods: {
    // 上一步
    up() {
      console.log('up', this.active)
      --this.active
      if (this.active < 0) this.active = 0
    },
    // 下一步
    next() {
      console.log('nexe:', this.active)
      let flag = true
      switch (this.active) {
        case 0:
          // 验证公司信息
          this.$refs.contractFormRef.validateField(
            ['orderID', 'orderDate', 'location', 'seller', 'sellerAddress', 'bank', 'buyer', 'buyerAddress'],
            val => {
              if (val) {
                flag = false
              }
            }
          )
          if (flag) this.active++
          break
        case 1:
          // 验证产品价格
          if (flag) this.active++
          break
        case 2:
          // 验证交易条款
          this.$refs.contractFormRef.validateField(['packaging', 'loading', 'destination'], val => {
            if (val) {
              flag = false
            }
          })
          if (flag) this.active++
          break
        case 3:
          // 验证预览
          if (flag) this.active++
          break
      }
      if (this.active > 3) this.active = 0
    },
    // 改变卖方类型
    sellerChange(sellerType) {
      console.log('sellerChange', sellerType)
      // 修改公司类型
      this.contract.seller = OrderInfo.seller[sellerType]
      // 修改地址类型
      this.contract.sellerAddress = OrderInfo.sellerAddress[sellerType]
      // 修改银行类型
      this.contract.bank = OrderInfo.bank[sellerType]
    },
    // 修改交易条款
    paymentChange(paymentType) {
      console.log('paymentChange', paymentType)
      // 默认的付款类型
      this.contract.payment = OrderInfo.payment[paymentType]
    },
    // 修改交货方式
    locationsChange(locationsType) {
      console.log('locationsChange', locationsType)
      if (locationsType === 'FOB') {
        this.contract.locations = locationsType + ' ' + this.contract.loading
      } else if (locationsType === 'OTHER') {
        this.contract.locations = ''
      } else {
        this.contract.locations = locationsType + ' ' + this.contract.destination
      }
    },
    // 添加产品
    addProduct() {
      console.log('addProduct')
      this.contract.offerSheet.products.push({ name: '', amount: 0, unit: 'MT', quotations: [] })
    },
    // 删除产品
    delProduct(index) {
      console.log('delProduct')
      this.contract.offerSheet.products.splice(index, 1)
    },
    // 添加报价
    addQuotation(index, cIndex) {
      console.log('addQuotation')
      if (cIndex === 0) {
        this.contract.offerSheet.products[index].quotations.push({ size: '', quantity: 0, price: 0, total: 0 })
      } else {
        this.contract.offerSheet.products[index].quotations.splice(cIndex + 1, 0, { size: '', quantity: 0, price: 0, total: 0 })
      }
    },
    // 删除报价
    delQuotation(index, cIndex) {
      console.log('delQuotation')
      this.contract.offerSheet.products[index].quotations.splice(cIndex, 1)
    },
    // 添加附加条款
    addAttach() {
      console.log('addAttach')
      this.contract.offerSheet.attachs.push({ title: '', amount: 0 })
    },
    // 删除附加条款
    delAttach(index) {
      console.log('delAttach')
      this.contract.offerSheet.attachs.splice(index, 1)
    },
    // 计算产品总价
    productsSum(quotations) {
      console.log('productsSum')
      let count = 0
      let amount = 0
      for (const quotation of quotations) {
        // 计算价格
        const { quantity, price } = quotation
        quotation.total = Math.round(XEUtils.multiply(quantity, price) * 100) / 100
        amount = XEUtils.add(amount, quotation.total)
        count += quantity
      }
      return { amount, count }
    },
    // 合同总价总价
    contractSum() {
      console.log('contractSum')
      const { products, attachs } = this.contract.offerSheet
      let sum = 0.0
      const countMap = new Map()
      // 产品价格
      for (const product of products) {
        const { quotations } = product
        const { amount, count } = this.productsSum(quotations)
        product.amount = amount
        product.count = count
        sum = XEUtils.add(sum, product.amount)
        if (countMap.get(product.unit)) {
          countMap.set(product.unit, countMap.get(product.unit) + count)
        } else {
          countMap.set(product.unit, count)
        }
      }
      // 附加条款价格
      for (const attach of attachs) {
        const { amount } = attach
        sum = XEUtils.add(sum, amount)
      }
      return { sum, countMap }
    },
    // 导出 SALES CONTRACT Excel
    exportExcel() {
      console.log('exportExcel')
      const workBook = XLSX.utils.book_new()
      const ws_data = [
        // 添加合同条款
        [
          {
            v: 'SALES CONTRACT',
            t: 's',
            s: {
              font: {
                sz: 20,
                bold: true,
              }
            }
          }
        ],
        [''],
        [`SELLER: ${this.contract.seller}`],
        [`ADDRESS: ${this.contract.sellerAddress}`],
        [`TEL: ${this.contract.sellerTEL} FAX: ${this.contract.sellerFAX}`],
        [''],
        [`BUYER: ${this.contract.buyer}`],
        [`ADDRESS: ${this.contract.buyerAddress}`],
        [`TEL: ${this.contract.buyerTEL} FAX: ${this.contract.buyerFAX}`],
        [''],
        [OrderInfo.Terms[0]],
        [OrderInfo.Terms[1]],
        ['DESCRIPTIONS OF GOODS', 'QUANTITY', 'UNIT PRICE', 'TOTAL AMOUNT']
      ]
      // 添加合同产品价格
      // 计算合并的偏移量
      let i = 0
      console.log('this.contract.offerSheet.products:', this.contract.offerSheet.products.length)
      for (const product of this.contract.offerSheet.products) {
        if (product.name.length > 0) {
          ws_data.push([product.name])
          i += 1
        }
        for (const quotation of product.quotations) {
          ws_data.push([quotation.size, quotation.quantity, quotation.price, quotation.total])
          i += 1
        }
      }
      // 添加合同附加条款
      for (const attach of this.contract.offerSheet.attachs) {
        ws_data.push([attach.title, '', '', attach.amount])
        i += 1
      }
      // 添加总价总数量
      ws_data.push(['TOTAL:', this.contract.offerSheet.count, '', `USD ${this.contract.offerSheet.sum}`])
      // 添加合同条款
      ws_data.push([OrderInfo.Terms[2]])
      ws_data.push([OrderInfo.Terms[3] + this.contract.packaging])
      ws_data.push([OrderInfo.Terms[4]])
      ws_data.push([OrderInfo.Terms[5] + this.contract.loading])
      ws_data.push([OrderInfo.Terms[6] + this.contract.destination])
      ws_data.push([OrderInfo.Terms[7] + this.contract.payment])
      ws_data.push([OrderInfo.Terms[8]])
      ws_data.push([OrderInfo.Terms[9]])
      ws_data.push([OrderInfo.Terms[10]])
      ws_data.push([OrderInfo.Terms[11]])
      ws_data.push([OrderInfo.Terms[12]])
      ws_data.push([OrderInfo.Terms[13]])
      ws_data.push([OrderInfo.Terms[14]])
      ws_data.push([''])
      ws_data.push([OrderInfo.Terms[15], '', OrderInfo.Terms[16], ''])
      ws_data.push([''])
      ws_data.push([''])
      const workSheet = XLSX.utils.aoa_to_sheet(ws_data)
      // 合并表格
      console.log('偏移量:', i)
      const merge = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // 合并标题
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
      ]
      workSheet['!merges'] = merge
      XLSX.utils.book_append_sheet(workBook, workSheet, '工作表名称')
      XLSX.writeFile(workBook, "sheetjs.xlsx")
      console.log('XLSX:', workSheet)
      console.log('XLSXStyle:', XLSXStyle)
    }
  },
  mounted() {
    // 创建订单的默认日期
    this.contract.orderDate = XEUtils.toDateString(new Date(), 'yyyy-MM-dd')
    // 公司默认类型
    this.contract.seller = OrderInfo.seller[this.contract.sellerType]
    // 地址默认类型
    this.contract.sellerAddress = OrderInfo.sellerAddress[this.contract.sellerType]
    // 默认银行类型
    this.contract.bank = OrderInfo.bank[this.contract.sellerType]
    // 默认的付款类型
    this.contract.payment = OrderInfo.payment[this.contract.paymentType]

    // 默认的交货方式
    this.contract.locations = this.contract.locationsType + ' ' + this.contract.loading
  },
  // 监听
  watch: {
    // 监听合同产品报价的变化，计算总价等信息
    'contract.offerSheet': {
      handler() {
        console.log('watch-contract.offerSheet')
        // 计算合同总价
        const { sum, countMap } = this.contractSum()
        this.contract.offerSheet.sum = sum
        // 计算合同总数量
        let countStr = ''
        for (const item of countMap.entries()) {
          countStr += item[1] + ' ' + item[0] + ' '
        }
        this.contract.offerSheet.count = countStr
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.bg-purple-dark {
  min-height: 28px;
}

.box-card {
  font-size: 14px;

  .el-card__header {
    padding: 14px 14px !important;
  }
}

.offerSheet-el-form-item {
  margin-bottom: 8px;
}

.div-radio-group {
  padding-bottom: 10px;
}

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
