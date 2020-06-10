// 导入按钮，表单项，消息框
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  container,
  header,
  aside,
  main,
  Menu,
  Submenu,
  MenuItem,
  RadioGroup,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Dialog,
  Divider,
  CheckboxGroup,
  Checkbox,
  TabPane,
  Tabs,
  Autocomplete,
  Tag
} from 'element-ui'
import Vue from 'vue'

// 挂在element-ui组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(container)
Vue.use(header)
Vue.use(aside)
Vue.use(main)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(RadioGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Dialog)
Vue.use(Divider)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Autocomplete)
Vue.use(Tag)

Vue.prototype.$message = Message
