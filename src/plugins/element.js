// 导入按钮，表单项，消息框
import { Button, Form, FormItem, Input, Message } from 'element-ui'
import Vue from 'vue'

// 挂在element-ui组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

Vue.prototype.$message = Message
