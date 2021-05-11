export default {
  seller: ['SINABUDDY MINERAL CO., LIMITED', 'ZHENGZHOU SINABUDDY MINERAL CO.. LTD', ''],
  sellerAddress: [
    `UNIT A&B, 15/F, NEICH TOWER, 128 GLOUCESTER ROAD WANCHAI, HONGKONG.`,
    `NO.27 INNER RING RD, ZHENGDONG NEW DISTRICT, ZHENGZHOU, CHINA`,
    ''
  ],
  bank: [
    `COMPANY NAME: SINABUDDY MINERAL CO., LIMITED
BANK NAME: HSBC HONGKONG
BANK ADDRESS: HEAD OFFICE 1 QUEEN'S ROAD CENTRAL HONG KONG
BANK BIC: HSBCHKHHHKH
ACCOUNT NO: 801332461838`,
    `COMPANY NAME:ZHENGZHOU SINABUDDY MINERAL CO., LTD
BANK NAME: SHANGHAI PUDONG DEVELOPMENT BANK ZHENGZHOU BRANCH
ACCOUNT NO.: 76201457410001173
SWIFT BIC: SPDBCNSH090`,
    ''
  ],
  payment: new Map([
    ['T/T', '20% BY T.T IN ADVANCE AND BALANCE 80% BY T.T AGAINST B/L COPY IN 30 DAYS FROM B/L DATE. ANY PAYMENT THAT ARE NOT PAID WHEN DUE, THE BUYER AGREE TO PAY INTEREST CHARGES AT THE RATE OF 1.5% PER MONTH.'],
    ['D/A', 'BY  D/A 45 DAYS AFTER B/L DATE AND "PROTEST" ALLOWED.'],
    ['D/P', 'BY D/A 60 DAYS FROM THE BILL OF LADING DATE.'],
    ['L/C', 'L/C'],
    ['OTHER', '']
  ]),
  Terms: [
    `THIS CONTRACT IS MADE BY AND AGREED BETWEEN THE SELLER AND BUYER, IN ACCORDANCE WITH THE TERMS AND CONDITIONS STIPULATED BELOW:`,
    `1.SPECIFICATION, QUANTITY AND PRICE:`,
    `2.INSURANCE: INVOICE VALUE PLUS 10% COVERING ALL RISKS TO BE COVERED BY THE SELLER. `,
    `3.PACKING: `,
    `4.MARKS: SELLER’S PACKING.THE MARKS WITHOUT “MADE IN CHINA” OR SPECIAL MARKS SHOWED ON PACKAGE AS THE BUYER'S REQUEST, THE BUYER SHALL BE LIABLE FOR ALL THE CONSEQUENCE AND EXPENSES IF ANY.`,
    `5.PORT OF LOADING: `,
    `6.PORT OF DESTINATION: `,
    `7.TERMS OF PAYMENT: `,
    `8.DELIVERY TIME: IN ABOUT 30 WORKING DAYS AFTER THE SIGNED SALES CONTRACT.`,
    `9.MORE OR LESS CLAUSE: 2% MORE OR LESS OF LOADING QUANTITY IS ALLOWED.`,
    `10.IF THE FLUCTUATION OF SEA FREIGHT IS ABOVE 30% BETWEEN THE CONTRACT DATE AND THE DELIVERY DATE, THE FREIGHT COST SHOULD BE SETTLED THROUGH NEGOTIATION.`,
    `11.SHIPPING DOCS: THE REQUESTED CUSTOM CLEARANCE DOCS SHOULD BE INFORMED BEFORE THE SHIPMENT. IF BUYER PROPOSE TO MODIFY OR REQUEST ADDITATIONAL DOCS AFTER THE SHIPMENT, THE ADDITIONAL COSTS AND RESPONSIBILITY SHALL BE BORNE BY THE BUYER. THE SHIPPING DOCUMENTS SHALL NOT BE SENT OUT DUE TO THE DELAY PAYMENT FROM THE BUYER,  THE BUYER SHALL BE LIABLE FOR ALL THE CONSEQUENCE AND EXPENSES IF ANY.`,
    `12.FORCE MAJEURE: THE DELAYS OF DELIVERY OR NON-DELIVERY CAUSED BY THE FORCE MAJEURE OCCURRED DURING  PRODUCTION OR SHIPMENT TRANSSHIPMENT PROCESS (INCLUDING WAR, SERIOUS FIRE, FLOOD, TYPHOON, EARTHQUAKE, STRIKES, WEATHER CONDITION, ENVIRONMENTAL PROTECTION CONDITION, GOVERNMENTAL ACTION AND THE OTHER INDIRECT THIRD PARTY EFFECT), THE SELLERS ARE NOT RESPONSIBLE FOR THE DELAYS OR NON-DELIVERY IN THE EVENT OF FORCE MAJEURE AND ANY CONTIGENCIES BEYOND THE SELLERS’ CONTROL. THE SELLER SHALL HAVE THE ADDITIONAL TIME NEEDED TO COMPLETE THE ORDER AND /OR THE RIGHT TO ALLOCATE THE AVAILABLE SUPPLY IN ANY MANNER IF SELECTS.`,
    `13.CLAIM: CLAIMS FOR DAMAGE,  QUANTITY AND QUALITY ISSUES SHOULD BE FILED BY THE BUYERS WITH THE SELLERS WITHIN 21 DAYS AFTER THE ARRIVAL OF THE GOODS AT DESTINATION PORT OR PLACE SUBJECT TO ITEM 6, AND SUPPORTED BY SUFFICIENT EVIDENCE FOR SELLERS REFERENCE. OTHERWISE, SUCH CLAIMS SHALL BE DEEMED WAIVED. ANY SHIPPING COSTS RELATED TO ANY APPROVED EXCHANGE OR REPLACEMENT OF PRODUCTS WILL BE AT THE EXPENSE OF THE BUYER.`,
    `14.ARBITRATION: ALL DISPUTES ARISING FROM THE EXECUTION OF OR IN CONNECTION WITH THIS CONTRACT, SHALL BE SETTLED AMICABLY THROUGH FRIENDLY NEGOTIATION. IN CASE NO SETTLEMENT CAN BE REACHED THROUGH NEGOTIATION, THE CASE SHALL THEN BE SUBMITTED TO CHINA INTERNATIONAL ECONOMIC AND TRADE ARBITRATION COMMISSION (CIETAC) IN ACCORDANCE WITH ITS PROVISIONAL RULES OF PROCEDURE. THE ARBITRAL AWARD IS FINAL AND BINDING UPON BOTH PARTIES. THE ARBITRATION FEES SHALL BE BORNE BY THE LOSING PARTY.`,
    `SIGNED BY THE SELLER`,
    `SIGNED BY THE BUYER`,
  ],
  OrderStatus: new Map([
    ['DRAFT', 0], // 草稿
    ['RUN-SUPPLY', 1], // 货源
    ['RUN-SHIPPING', 2], // 海运
    ['RUN-DOCUMENTS', 3] // 单证
  ]),
  OrderStatusInfo: new Map([
    ['DRAFT', '草稿'], // 草稿
    ['RUN-SUPPLY', '货源'], // 货源
    ['RUN-SHIPPING', '海运'], // 海运
    ['RUN-DOCUMENTS', '单证'], // 单证
  ]),
  UnitInfo: new Map([
    ['MT', '吨'],
    ['PCS', '件'],
    ['KGS', '千克'],
  ]),
  markAllType: new Map([
    ['我司唛头', (productName, orderID, nw) => {
      const body = `${productName}\nSIZE: (粒度号）\nLOT NO.: ${orderID}\n${nw}\nMADE IN CHINA\nSINABUDDY MINERAL`
      return body
    }],
    ['中性唛头', (productName, orderID, nw) => {
      const body = `${productName}\nSIZE: (粒度号）\nLOT NO.: ${orderID}\n${nw}\nMADE IN CHINA`
      return body
    }],
    ['中性不显示SBM', (productName, orderID, nw) => {
      const id = orderID.indexOf('SBM') === 0 ? orderID.substring(3) : orderID
      const body = `${productName}\nSIZE: (粒度号）\nLOT NO.: ${id}\n${nw}\nMADE IN CHINA\nSINABUDDY MINERAL`
      return body
    }],
    ['客户指定唛头(提供附件)', (productName, orderID, nw) => {
      console.log(productName, orderID, nw)
      const body = '客户指定唛头\n(请查阅交接单提供唛头附件)'
      return body
    }],
    ['中性不显示Made In China', (productName, orderID, nw) => {
      const body = `${productName}\nSIZE: (粒度号）\nLOT NO.: ${orderID}\n${nw}`
      return body
    }],
    ['中性不显示Made In China、SBM', (productName, orderID, nw) => {
      const id = orderID.indexOf('SBM') === 0 ? orderID.substring(3) : orderID
      const body = `${productName}\nSIZE: (粒度号）\nLOT NO.: ${id}\n${nw}`
      return body
    }],
  ]),
  PackagingChineseToEnglish: new Map([
    [
      '1000KG BIG BAGS',
      '一吨吨袋（带内衬）'
    ],
    [
      '1250KG BIG BGAS',
      '1.25吨吨袋（加内衬）'
    ],
    [
      '25KG PP BAGS (PLASTIC LINING) INTO 1MT SQUARE BIG BAGS',
      '25KG编织袋（加内衬）加1吨方形吨包'
    ],
    [
      '25KG PAPER BAGS (PLASTIC LINING) INTO 1MT SQUARE BIG BAGS',
      '25KG牛皮纸袋（加内衬）加1吨方形吨包'
    ],
    [
      '25KG PP BAGS (PLASTIC LINING) ON 1MT PALLETS',
      '25KG编织袋（带内衬）加1吨托盘'
    ],
    [
      '25KG PAPER BAGS (PLASTIC LINING) ON 1MT PALLETS',
      '25KG牛皮纸袋（带内衬）加1吨托盘'
    ],
    [
      '25KG PP BAGS (PLASTIC LINING) ON 1MT EURO PALLETS',
      '25KG编织袋（带内衬）加1吨欧式托盘'
    ],
    [
      '25KG PAPER BAGS (PLASTIC LINING) ON 1MT EURO PALLETS',
      '25KG牛皮纸袋（带内衬）加1吨欧式托盘'
    ],
    [
      '25KG WHITE PAPER BAGS (PLASTIC LINING) ON 1MT PALLETS',
      '25KG 白色纸袋（带内衬）加1吨托盘',
    ],
    [
      '25KG WHITE PAPER BAGS (PLASTIC LINING) ON 1MT EURO PALLETS',
      '25KG 白色纸袋（带内衬）加1吨欧式托盘',
    ],
    [
      '25KG PP BAGS (PLASTIC LINING) ON 1250KG PALLETS',
      '25KG编织袋（带内衬）加1250KG托盘'
    ]
  ]),
  PackagingAllInfo: new Map([
    [
      '一吨吨袋（带内衬）',
      {
        name: '',
        mark: [{ title: '吨袋', info: '', provider: '工厂', genre: '', netWeight: '1000KG' }],
        description: '一吨吨袋（带内衬），（吨包质量要好，上下开口，下开口50CM, 横竖加固带, 四根吊带, 每根吊带长度55 CM）'
      }
    ],
    [
      '1.25吨吨袋（加内衬）',
      {
        name: '',
        mark: [{ title: '1.25吨袋', info: '', provider: '工厂', genre: '', netWeight: '1250KG' }],
        description: '1.25吨吨袋（带内衬），（吨包质量要好，上下开口，下开口50CM, 横竖加固带, 四根吊带, 每根吊带长度55 CM）'
      }
    ],
    [
      '25KG编织袋（加内衬）加1吨方形吨包',
      {
        name: '',
        mark: [
          { title: '25KG编织袋', info: '', provider: '工厂', genre: '', netWeight: '25KG' },
          { title: '吨袋', info: '', provider: '工厂', genre: '', netWeight: '1000KG' }
        ],
        description: '25公斤编织袋带内衬加一吨吨袋包装（方形吨包），要求吨袋四根吊环（吊环长度55CM）'
      }
    ],
    [
      '25KG牛皮纸袋（加内衬）加1吨方形吨包',
      {
        name: '',
        mark: [
          { title: '25KG牛皮纸袋', info: '', provider: '工厂', genre: '', netWeight: '25KG' },
          { title: '吨袋', info: '', provider: '工厂', genre: '', netWeight: '1000KG' }
        ],
        description: '25公斤牛皮纸袋（带内衬）加一吨吨袋包装（方形吨包），要求吨袋四根吊环（吊环长度55CM）'
      }
    ],
    [
      '25KG编织袋（带内衬）加1吨托盘',
      {
        name: '',
        mark: [
          { title: '25KG编织袋', info: '', provider: '工厂', genre: '', netWeight: '25KG' },
          { title: '托盘', info: '', provider: '工厂', genre: '', netWeight: '1000KG' }
        ],
        description: ' 25公斤编织袋（带内衬），加1吨熏蒸实木托盘100*100CM，托盘上下板内径不小于10CM ， 顶部加纸盖，缠塑，加打固带。托盘质量一定要足够结实， 打托结实，整齐 '
      }
    ],
    [
      '25KG牛皮纸袋（带内衬）加1吨托盘',
      {
        name: '',
        mark: [
          { title: '25KG牛皮纸袋', info: '', provider: '工厂', genre: '', netWeight: '25KG' },
          { title: '托盘', info: '', provider: '工厂', genre: '', netWeight: '1000KG' }
        ],
        description: ' 25公斤牛皮纸袋（带内衬），加1吨熏蒸实木托盘100*100CM，托盘上下板内径不小于10CM ， 顶部加纸盖，缠塑，加打固带。托盘质量一定要足够结实， 打托结实，整齐 '
      }
    ],
    [
      '25KG编织袋（带内衬）加1吨欧式托盘',
      {
        name: '',
        mark: [
          { title: '25KG编织袋', info: '', provider: '工厂', genre: '', netWeight: '25KG' },
          { title: '托盘', info: '', provider: '工厂', genre: '', netWeight: '1000KG' }
        ],
        description: ' 25公斤编织袋（带内衬），加1吨熏蒸实木欧式托盘120*80CM，托盘上下板内径不小于10CM ， 顶部加纸盖，缠塑，加打固带。托盘质量一定要足够结实， 打托结实，整齐 '
      }
    ],
    [
      '25KG牛皮纸袋（带内衬）加1吨欧式托盘',
      {
        name: '',
        mark: [
          { title: '25KG牛皮纸袋', info: '', provider: '工厂', genre: '', netWeight: '25KG' },
          { title: '托盘', info: '', provider: '工厂', genre: '', netWeight: '1000KG' }
        ],
        description: ' 25公斤牛皮纸袋（带内衬），加1吨熏蒸实木欧式托盘120*80CM，托盘上下板内径不小于10CM ， 顶部加纸盖，缠塑，加打固带。托盘质量一定要足够结实， 打托结实，整齐 '
      }
    ],
    [
      '25KG 白色纸袋（带内衬）加1吨托盘',
      {
        name: '',
        mark: [
          { title: '25KG白色牛皮纸袋', info: '', provider: '工厂', genre: '', netWeight: '25KG' },
          { title: '托盘', info: '', provider: '工厂', genre: '', netWeight: '1000KG' }
        ],
        description: ' 25公斤白色牛皮纸袋（带内衬），加1吨熏蒸实木托盘100*100CM，托盘上下板内径不小于10CM ， 顶部加纸盖，缠塑，加打固带。托盘质量一定要足够结实， 打托结实，整齐 '
      }
    ],
    [
      '25KG 白色纸袋（带内衬）加1吨欧式托盘',
      {
        name: '',
        mark: [
          { title: '25KG白色牛皮纸袋', info: '', provider: '工厂', genre: '', netWeight: '25KG' },
          { title: '托盘', info: '', provider: '工厂', genre: '', netWeight: '1000KG' }
        ],
        description: ' 25公斤白色牛皮纸袋（带内衬），加1吨熏蒸实木欧式托盘120*80CM，托盘上下板内径不小于10CM ， 顶部加纸盖，缠塑，加打固带。托盘质量一定要足够结实， 打托结实，整齐 '
      }
    ],
    [
      '25KG编织袋（带内衬）加1250KG托盘',
      {
        name: '',
        mark: [
          { title: '25KG编织袋', info: '', provider: '工厂', genre: '', netWeight: '25KG' },
          { title: '托盘', info: '', provider: '工厂', genre: '', netWeight: '1250KG' }
        ],
        description: ' 25公斤编织袋（带内衬），加1.25吨熏蒸实木托盘100*100CM，托盘上下板内径不小于10CM ， 顶部加纸盖，缠塑，加打固带。托盘质量一定要足够结实， 打托结实，整齐 '
      }
    ],
    [
      'default',
      {
        name: '',
        mark: [{ title: '吨袋', info: '', provider: '我方', genre: '', netWeight: '1000KG' }],
        description: '一吨吨袋（带内衬），（吨包质量要好，上下开口，下开口50CM, 横竖加固带, 四根吊带, 每根吊带长度55 CM）'
      }
    ]
  ]),
  Loading: new Map([
    ['XINGANG, CHINA', '天津港'],
    ['QINGDAO, CHINA', '青岛港'],
    ['SHANGHAI, CHINA', '上海港'],
    ['XINGANG, CHINA / QINGDAO, CHINA', '天津港或青岛港'],
    ['ANY PORT IN CHINA', '任意中国港口'],
  ]),
  // 公司类型
  SinabuddyChineseName: ['华友矿产有限公司', '郑州华友矿产品有限公司'],
  RoleName: new Map([
    ['SALESMAN', '业务员'],
    ['DOCUMENTS', '单证'],
    ['SHIPPING', '海运'],
    ['SUPPLY', '货源'],
    ['MANAGER', '经理'],
    ['ADMIN', '管理员'],
  ])
}
