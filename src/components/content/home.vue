<template>
  <div class="content_user">
    <div class="box_container">
      <el-row :gutter="14">
        <el-col :span="24">
          <div class="box">
            <div class="box_title">用户运营</div>
            <div class="box_content">
              <el-row :gutter="14">
                <el-col :span="6">
                  <div class="box_item">
                    <p>考试次数</p>
                    <h2 v-text="userData.exam?userData.exam:'--'"></h2>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="box_item">
                    <p>机构数</p>
                    <h2 v-text="userData.mechanism?userData.mechanism:'--'"></h2>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="box_item">
                    <p>证书数</p>
                    <h2 v-text="userData.certificte?userData.certificte:'--'"></h2>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="box_item">
                    <p>考生数</p>
                    <h2 v-text="userData.student?userData.student:'--'"></h2>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="box_container">
      <div class="box">
        <div class="box_title">审核管理</div>
        <div class="box_content box_exa">
          <el-row :gutter="14">
            <el-col :span="12">
              <div class="box_exa_item" :class="[enabled ? '' : 'disabled']"
                   @click="changeView('examine', enabled)">
                <img src="./img/img.jpg" alt="">
                <div>
                  <div>
                    <i class="el-icon-tickets"></i>
                    <h2>活动中心审核</h2>
                    <p>待审核：{{userData.center ? userData.center : '0'}}</p>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="box_exa_item" :class="[enabled ? '' : 'disabled']"
                   @click="changeView('examineBase', enabled)">
                <img src="./img/img2.jpg" alt="">
                <div>
                  <div>
                    <i class="el-icon-document"></i>
                    <h2>活动基地审核</h2>
                    <p>待审核：{{userData.base ? userData.base : 0}}</p>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="12" v-if="userType !== 3">
              <div class="box_exa_item" :class="[enabled ? '' : 'disabled']"
                   @click="changeView('examineNews', enabled)">
                <img src="./img/img.jpg" alt="">
                <div>
                  <div>
                    <i class="el-icon-tickets"></i>
                    <h2>新闻审核</h2>
                    <p>待审核：{{userData.news ? userData.news : '0'}}</p>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="12" v-if="userType !== 3">
              <div class="box_exa_item" :class="[enabled ? '' : 'disabled']"
                   @click="changeView('examineNotice', enabled)">
                <img src="./img/img2.jpg" alt="">
                <div>
                  <div>
                    <i class="el-icon-document"></i>
                    <h2>公告审核</h2>
                    <p>待审核：{{userData.notice ? userData.notice : 0}}</p>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="box_container">
      <el-row :gutter="14">
        <el-col :span="24">
          <div class="box">
            <div class="box_title">功能模块</div>
            <div class="box_content">
              <el-row :gutter="14">
                <el-col :span="4" v-for="(item, index) in allWithFlagList" :key="index" v-if="item.url != '/index'">
                  <router-link tag="div" :to="item.enabled ? item.url : ''" class="box_item"
                               :class="[item.enabled ? '' : 'enabled']" @click.native="getMenuId(item.id)">
                    <h2><i class="iconfont" :class="item.icon"></i></h2>
                    <p>{{item.name}}</p>
                  </router-link>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'user',
    data() {
      return {
        userData: "",
        allWithFlagList: [],
        enabled: false,
        userType: -1
      }
    },
    created() {
      this.getAllWithFlagList()
    },
    mounted: function () {
      this.getData();
    },
    methods: {
      //修改menuid
      getMenuId(id) {
        localStorage.setItem('menuId', id);
      },
      // getAllWithFlag
      getAllWithFlagList() {
        this.$ajax.get('/getRoleType').then(res => {
          if (res.status === 200) {
            this.userType = res.data;
            if (res.data === 3) {
              this.allWithFlagList = [{
                name: '证书管理',
                icon: 'icon-zhengshutongji',
                url: '/'
              }, {
                name: '报名管理',
                icon: 'icon-zhiliangshencha_weixuanzhong',
                url: '/'
              }, {
                name: '合作机构管理',
                icon: 'icon-hezuo',
                url: '/'
              }];
            } else {
              this.allWithFlagList = [{
                name: '考试批次管理',
                icon: 'icon-iconmoban1',
                url: '/'
              }, {
                name: '机构用户管理',
                icon: 'icon-yonghuguanli',
                url: '/'
              }, {
                name: '导师管理',
                icon: 'icon-laoshi',
                url: '/'
              }, {
                name: '证书管理',
                icon: 'icon-zhengshutongji',
                url: '/'
              }, {
                name: '报名管理',
                icon: 'icon-zhiliangshencha_weixuanzhong',
                url: '/'
              }, {
                name: '合作机构管理',
                icon: 'icon-hezuo',
                url: '/'
              }, {
                name: '导航管理',
                icon: 'icon-fenlei',
                url: '/'
              }, {
                name: '首页管理',
                icon: 'icon-shouye',
                url: '/'
              }, {
                name: '自定义页面',
                icon: 'icon-zhengshuguanli',
                url: '/'
              }, {
                name: '审核管理',
                icon: 'icon-chaxun1',
                url: '/'
              }, {
                name: '系统用户管理',
                icon: 'el-icon-setting',
                url: '/'
              }];
            }
          }
        });
      },
      // 获取用户运营
      getData() {
        this.$ajax.get('/count').then(res => {
          if (res.status === 200) {
            this.userData = res.data
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
        //检查是否有权限审核
        this.$ajax.get('checkExamineRole').then(res => {
          if (res.status === 200) {
            this.enabled = res.data;
          } else
            this.$message.error(res.data.msg);
        });
      },
      /*跳转页面*/
      changeView(page, enabled) {
        if (!enabled) return false;
        this.$router.push({name: page});
      },
    }
  }
</script>
<style lang="less" type="text/less">
  .box_container {
    margin-bottom: 20px;
  }

  .box {
    width: 100%;
    height: auto;
    background: #ffffff;
    border: 1px solid #d2dae9;
    .box_title {
      width: 100%;
      height: 45px;
      line-height: 45px;
      background: #f8f8f8;
      color: #666;
      padding: 0 20px;
    }
    .el-col {
      padding-top: 7px;
      padding-bottom: 7px
    }
    .box_content {
      width: 100%;
      height: auto;
      padding: 10px 20px;
      .box_item {
        background: #f7f7f7;
        text-align: center;
        height: 120px;
        padding: 30px 0;
        line-height: 2;
        // cursor: pointer;
        &.enabled {
          cursor: default;
          h2 {
            color: #999;
            i {
              font-size: 24px;
              color: #30b8fe;
            }
          }
        }
        p {
          font-size: 12px;
          color: #999;
        }
        h2 {
          font-size: 24px;
          color: #30b8fe;
        }
        div {
          width: 100%;
          height: 85px;
          border: 1px solid #dfdfdf;
          border-bottom-style: dashed;
          margin-top: -30px;
          padding-top: 10px;
        }
        a.btn_item {
          display: block;
          width: 100%;
          height: 35px;
          border: 1px solid #dfdfdf;
          border-top: none;
          font-size: 12px;
          color: #666;
          line-height: 34px;
          &:hover {
            color: #30b8fe;
          }
        }
      }
    }
    .box_exa {
      .box_exa_item {
        width: 100%;
        height: 320px;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        &.disabled {
          cursor: default;
          div {
            color: #999;
          }
        }
        img {
          width: 100%;
          height: 100%;
        }
        div {
          width: 100%;
          height: auto;
          text-align: center;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          color: #ffffff;
          i {
            font-size: 30px;
            margin-bottom: 20px;
          }
          h2 {
            font-size: 16px;
            line-height: 2;
          }
          p {
            font-size: 14px;
          }
        }
      }
      .exa_item {
        width: 100%;
        height: 320px;
        & > div {
          width: 100%;
          height: 153px;
          background: #000;
          color: #ffffff;
          overflow: hidden;
          position: relative;
          &:last-child {
            margin-top: 14px;
          }
          &:hover > div {
            top: 0;
          }
          & > div {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .7);
            position: absolute;
            z-index: 2;
            left: 0;
            top: 100%;
            transition: all .3s ease-in-out;
            div {
              width: 100%;
              height: auto;
              text-align: center;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              color: #ffffff;
              i {
                font-size: 30px;
                margin-bottom: 20px;
              }
              h2 {
                font-size: 16px;
                line-height: 2;
              }
              p {
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
</style>
