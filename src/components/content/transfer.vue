<template>
  <div id="transfer">
    <dl class="menu_box">
      <dd><p v-html="menuList.title"></p></dd>
      <dd v-for="(item,index) in menuList.list" :key="index" @click="setActive(item)">
        <a :href="item.url" v-html="item.name" :class="{active:current === item.url}"></a>
      </dd>
    </dl>
    <div class="router_box">
      <div class="router_content">
        <Crumbs :crumbs="crumbsList"/>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "transfer",
    data() {
      return {
        current: '',
        menuList: {
          title: '',
          list: []
        },
        searchMain: [],
        list: [{
          id: '考试批次管理',
          list: [{
            name: '考试批次管理',
            url: '#/batch'
          }]
        }, {
          id: '机构用户管理',
          list: [{
            name: '机构用户管理',
            url: '#/institutionalUser'
          }]
        }, {
          id: '导师管理',
          list: [{
            name: '导师管理',
            url: '#/tutor'
          }]
        }, {
          id: '证书管理',
          list: [{
            name: '证书管理',
            url: '#/certificate/index'
          }, {
            name: '证书申领',
            url: '#/certificate/apply'
          }]
        }, {
          id: '报名管理',
          list: [{
            name: '报名管理',
            url: '#/enroll/index'
          }]
        }, {
          id: '合作机构管理',
          list: [{
            name: '活动中心',
            url: '#/institution/center'
          }, {
            name: '活动基地',
            url: '#/institution/base'
          }]
        }, {
          id: '导航管理',
          list: [{
            name: '一级导航',
            url: '#/navigation/first'
          }, {
            name: '二级导航',
            url: '#/navigation/second'
          }]
        }, {
          id: '首页管理',
          list: [{
            name: '轮播图',
            url: '#/homePage/banner'
          }, {
            name: '测评新闻',
            url: '#/homePage/news'
          }, {
            name: '测评公告',
            url: '#/homePage/notice'
          }, {
            name: '模块导航',
            url: '#/homePage/module'
          }, {
            name: '专家团队',
            url: '#/homePage/expert'
          }, {
            name: '杂志介绍',
            url: '#/homePage/notes'
          }, {
            name: '套件展示',
            url: '#/homePage/suite'
          }, {
            name: '合作网站',
            url: '#/homePage/site'
          }]
        }, {
          id: '自定义页面',
          list: [{
            name: '自定义页面',
            url: '#/custom/index'
          }]
        }, {
          id: '审核管理',
          list: [{
            name: '活动中心审核',
            url: '#/examine/center'
          }, {
            name: '活动基地审核',
            url: '#/examine/base'
          }, {
            name: '新闻审核',
            url: '#/examine/news'
          }, {
            name: '公告审核',
            url: '#/examine/notice'
          }]
        }, {
          id: '系统用户管理',
          list: [{
            name: '系统用户管理',
            url: '#/user'
          }]
        }],
        crumbsList: [   //  面包屑
          {name: '', route: ''}
        ],
        interVal: null
      }
    },
    watch: {
      '$route'(val) {
        this.getMenuList(val);
      },
      current(val) {
        this.userRole();
      }
    },
    mounted() {
      this.userRole();
    },
    methods: {
      userRole() {
        this.$ajax.get('/getRoleType').then(res => {
          if (res.status === 200) {
            this.list.forEach((item, index) => {
              if (res.data === 3 && item.id === '证书管理') {
                item.list = [{
                  name: '证书申领',
                  url: '#/certificate/apply'
                }];
              }
              if ((res.data === 2 || res.data === 3) && item.id === '审核管理') {
                item.list = [{
                  name: '活动中心审核',
                  url: '#/examine/center'
                }, {
                  name: '活动基地审核',
                  url: '#/examine/base'
                }];
              }
            });
            if (this.$route.meta.id) {
              this.$nextTick(() => {
                this.getMenuList(this.$route);
              })
            } else {
              this.interval = setInterval(() => {
                this.getMenuList(this.$route);
              }, 500);
            }
          }
        });
      },
      getMenuList(val) {
        if (this.interval)
          clearInterval(this.interval);
        this.menuList.title = val.meta.id;
        this.list.forEach((item, index) => {
          if (item.id === val.meta.id) {
            this.menuList.list = item.list;
          }
        });
        this.menuList.list.forEach((item, index) => {
          if (item.url.split('/')[1] === val.path.split('/')[1]) {
            if (val.path.split('/')[2] && !val.meta.other) {
              if (item.url.split('/')[2] === val.path.split('/')[2]) {
                this.$nextTick(() => {
                  this.current = item.url;
                  this.setCrumbs(item.name, val);
                });
              }
            } else {
              if (val.params.type) {
                if (item.url.split('/')[2] === val.path.split('/')[2]) {
                  this.$nextTick(() => {
                    this.current = item.url;
                    this.setCrumbs(item.name, val);
                  });
                }
              } else
                this.$nextTick(() => {
                  this.current = item.url;
                  this.setCrumbs(item.name, val);
                });
            }
          }
        });
      },
      setActive(param) {
        this.current = param.url;
      },
      setCrumbs(name, route) {
        this.crumbsList = [{
          name: name,
          route: route
        }];
        if ('other' in route.meta) {
          this.crumbsList.push({name: route.meta.other});
        }
      }
    }
  }
</script>

<style scoped type="text/less" lang="less">
  #transfer {
    width: 100%;
    height: 100%;
    .router_box {
      padding: 20px;
      float: left;
      width: calc(100% - 129px);
    }
    .router_content {
      background: #ffffff;
      padding: 20px 30px;
    }
  }
</style>
