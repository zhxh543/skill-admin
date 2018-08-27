// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import less from 'less'
import 'element-ui/lib/theme-chalk/index.css'
import '@static/css/reset.css'
import '@static/css/skin.css'
import Crumbs from '@/components/common/crumbs.vue'   //面包屑组件
import http from './assets/js/http.js'
import {operateDesc} from './assets/js/public.js'  //public 文件用户信息

import $ from 'jquery'

const webRootUrl = 'http://192.168.0.220:8070/';
// const webRootUrl = 'http://192.168.0.199:18086';

// 测试地址：http://rds.xatime888.com/
//正式地址：http://rds.ptpress.com.cn/

Vue.prototype.downloadUrl = webRootUrl + "file";//下载地址
Vue.prototype.serverUrl = webRootUrl;//网站地址
// Vue.prototype.webUrl = 'http://192.168.0.18:8081';//网站地址
Vue.prototype.webUrl = 'http://192.168.0.220:8070';//网站地址

// 操作说明
Vue.prototype.dataCollectionDesc = operateDesc.dataCollectionDesc;
Vue.prototype.appUserDesc = operateDesc.appUserDesc;
Vue.prototype.warningBaseDesc = operateDesc.warningBaseDesc;
Vue.prototype.defPwdDesc = operateDesc.defPwdDesc;
Vue.prototype.costPodDesc = operateDesc.costPodDesc;
Vue.prototype.costTradDesc = operateDesc.costTradDesc;
Vue.prototype.costThresholdDesc = operateDesc.costThresholdDesc;
Vue.prototype.importDesc = operateDesc.importDesc;
Vue.prototype.importIntDesc = operateDesc.importIntDesc;
Vue.prototype.setWarningDesc = operateDesc.setWarningDesc;
Vue.use(ElementUI)
Vue.use(less)

Vue.use(Vuex);

Vue.config.productionTip = false

Vue.prototype.$ajax = http;

Vue.component('Crumbs', Crumbs);   //全局使用面包屑
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App},
  mounted() {
  }
})
