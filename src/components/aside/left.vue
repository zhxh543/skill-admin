<template>
  <div class="left">
    <ul class="nav" :class="{'active':!menuActive}">
      <li @click="changeCurrent()">
        <a class="showActive" style="text-align: center"><i class="el-icon-menu"></i></a>
      </li>
      <li v-for="(item, index) in menuList" :key="index">
        <router-link :to="item.url" :title="item.name">
          <i class="iconfont" :class="item.icon"></i>
          <span v-html="item.name"></span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'left',
    props: ["menuActive"],//current-name--来自哪个页面的调用；
    data() {
      return {
        menuList: []
      }
    },
    watch: {
      '$route'(val) {
        this.setTitle(val);
      }
    },
    methods: {
      userRole() {
        this.menuList = [];
        this.$ajax.get('/getRoleType').then(res => {
          if (res.status === 200) {
            if (res.data === 3) {
              this.menuList = [{
                name: '概览',
                icon: 'icon-chaxun1',
                url: '/index'
              }, {
                name: '证书管理',
                icon: 'icon-zhengshutongji',
                url: '/certificate/apply'
              }, {
                name: '报名管理',
                icon: 'icon-zhiliangshencha_weixuanzhong',
                url: '/enroll'
              }, {
                name: '合作机构管理',
                icon: 'icon-hezuo',
                url: '/institution'
              }];
            } else if (res.data === 0 || res.data === 1) {
              this.menuList = [{
                name: '概览',
                icon: 'icon-chaxun1',
                url: '/index'
              }, {
                name: '考试批次管理',
                icon: 'icon-iconmoban1',
                url: '/batch'
              }, {
                name: '机构用户管理',
                icon: 'icon-yonghuguanli',
                url: '/institutionalUser'
              }, {
                name: '导师管理',
                icon: 'icon-laoshi',
                url: '/tutor'
              }, {
                name: '证书管理',
                icon: 'icon-zhengshutongji',
                url: '/certificate'
              }, {
                name: '报名管理',
                icon: 'icon-zhiliangshencha_weixuanzhong',
                url: '/enroll'
              }, {
                name: '合作机构管理',
                icon: 'icon-hezuo',
                url: '/institution'
              }, {
                name: '导航管理',
                icon: 'icon-fenlei',
                url: '/navigation'
              }, {
                name: '首页管理',
                icon: 'icon-shouye',
                url: '/homePage'
              }, {
                name: '自定义页面',
                icon: 'icon-zhengshuguanli',
                url: '/custom'
              }, {
                name: '审核管理',
                icon: 'icon-chaxun1',
                url: '/examine'
              }, {
                name: '系统用户管理',
                icon: 'el-icon-setting',
                url: '/user'
              }];
            } else if (res.data === 2 || res.data === 3) {
              this.menuList = [{
                name: '概览',
                icon: 'icon-chaxun1',
                url: '/index'
              }, {
                name: '考试批次管理',
                icon: 'icon-iconmoban1',
                url: '/batch'
              }, {
                name: '机构用户管理',
                icon: 'icon-yonghuguanli',
                url: '/institutionalUser'
              }, {
                name: '导师管理',
                icon: 'icon-laoshi',
                url: '/tutor'
              }, {
                name: '证书管理',
                icon: 'icon-zhengshutongji',
                url: '/certificate'
              }, {
                name: '报名管理',
                icon: 'icon-zhiliangshencha_weixuanzhong',
                url: '/enroll'
              }, {
                name: '合作机构管理',
                icon: 'icon-hezuo',
                url: '/institution'
              }, {
                name: '导航管理',
                icon: 'icon-fenlei',
                url: '/navigation'
              }, {
                name: '首页管理',
                icon: 'icon-shouye',
                url: '/homePage'
              }, {
                name: '自定义页面',
                icon: 'icon-zhengshuguanli',
                url: '/custom'
              }, {
                name: '审核管理',
                icon: 'icon-chaxun1',
                url: '/examine'
              }]
            }
            this.$nextTick(() => {
              this.setTitle(this.$route);
              this.getIsMenuShow();
            })
          }
        });
      },
      setTitle(val) {
        this.menuList.forEach((item, index) => {
          if (item.url.split('/')[1] === val.path.split('/')[1]) {
            this.$route.meta.id = item.name;
          }
        });
      },
      changeCurrent() {
        this.$emit("activeChanged", !this.menuActive)
        localStorage.setItem('showMenu', this.menuActive);
      },
      getIsMenuShow() {    //获取localStorage，判断菜单是否显示
        const showMenuStorage = localStorage.getItem("showMenu");
        if (showMenuStorage == false) {
          this.$emit("activeChanged", false)
        } else {
          this.$emit("activeChanged", true)
        }
      }
    },
    mounted() {
      this.userRole();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" type="text/less">
  .left {
    width: auto;
    height: 100%;
    background: #ffffff;
    border-right: 1px solid #d2dae9;
  }

  .nav {
    width: 160px;
  }

  .nav.active {
    width: 50px;
  }

  .nav.active a {
    width: 50px;
    overflow: hidden;
  }

  .nav.active span {
    display: none;
  }

  .nav a {
    display: block;
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding-left: 15px;
    color: #8f8f8f;
    font-size: 14px;
    transition: all .3s ease-in-out;
  }

  .nav a i {
    font-size: 22px;
    vertical-align: middle;
  }

  .nav span {
    margin-left: 10px;
  }

  .nav a:hover, .nav a.linkActive {
    background: #373737;
    color: #fff;
  }

  .showActive {
    cursor: pointer;
    background: #373737;
  }

  .nav {
    position: relative;
    overflow: hidden;
    height: 100%;
  }
</style>
