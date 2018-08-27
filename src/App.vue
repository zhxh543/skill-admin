<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

  export default {
    name: 'app',
    data() {
      return {}
    },

    methods: {
      // getMenu (){
      //   let _this = this
      //   this.$ajax.get('/menu',)
      //     .then(function (res) {
      //       console.log("ress",res);
      //       if(!res) {
      //         _this.$router.push({"name":"login"})
      //       }
      //     })
      //     .catch(function (error) {
      //       console.log("err",error);
      //     });
      // }
    },
    mounted(){
    },
    // beforeCreate (){
    //   let _this = this
    //   this.$ajax.get('/menu',)
    //     .then(function (res) {
    //       // console.log("ress",res);
    //       if(!res) {
    //         _this.$router.push({"name":"login"})
    //       }
    //     })
    //     .catch(function (error) {
    //       // console.log("err",error);
    //     });
    // }
  }
</script>
<style  lang="less" type="text/less">
  #app{
    #isReadId{
      display: none;
    }
    /* 面包屑 */
    .crumbs:before {
      content: "";
      position: absolute;
      width: 2px;
      height: 16px;
      top: 0px!important;
      left: 0;
      background-color: #30b8fe;
    }
    .el-table{
      font-size: 12px;
    }
    /* 分页 */
    .page-block{
      text-align: center;
      margin: 40px auto;
    }
    /*底部边框*/
    .line {
      border-bottom: 1px solid #eeeeee;
    }
    /*面包屑下面一行*/
    .handle-block{
      padding: 18px 0;
      .el-button{
        width: 98px;
      }
    }
    .colRed{color: #ff0000}
    /*筛选表格样式*/
    .filter-search{
      margin-bottom: 30px;
      border-right: 1px solid #ebeef4;
      border-left: 1px solid #dcdfe6;
      border-radius: 4px;
      table{
        width: 100%;
        /*overflow:hidden;*/
        border-radius:4px;
        padding-bottom: 1px;
        tr{
          .el-input{
            width: 290px;
            height: 28px;
            line-height: 28px;
            display: block;
            margin-bottom: -9px;
            margin-top: 6px;
            float: left;
          }
          button{
            margin-bottom: -6px;
            margin-top: 6px;
            margin-left: 8px;
          }
          .el-button--mini{
            padding: 5px 15px;
          }
          .el-date-editor.el-input, .el-date-editor.el-input__inner{
            width: 170px!important;
          }
          .el-input-number.is-without-controls .el-input__inner{
            text-align: left;
          }
          td{
            height: 40px;
            line-height: 40px;
            &:first-child{
              font-size: 14px;
              width: 160px;
              background: #f1f8ff;
              color: #728394;
              text-align: left;
              padding-left: 20px;
              border-top: 1px solid #dcdfe6;
              border-right: 1px solid #dcdfe6;
            }
            &:last-child{
              font-size: 12px;
              padding: 0 10px;
              color: #666666;
              height: 39px;
              /*border-bottom: 1px solid #ebeef4;*/
              border-top: 1px solid #ebeef4;
            }
          }
          &:last-child{
            td{
              &:first-child {
                border-bottom:1px solid #dcdfe6;
              }
              &:last-child {
                border-bottom:1px solid #ebeef4;
              }
            }
          }
        }
        .tag {
          height: 24px;
          margin-top: 8px;
          margin-bottom: -8px;
          span {
            margin-right: 25px;
            cursor: pointer;
            padding: 0 10px;
            line-height: 24px;
            display: block;
            float: left;
            color: #666;
            font-size: 12px;
          }
          .tag-active {
            background: #f0f2f5;
            border-radius: 4px;
          }
        }
      }
    }
    .form-submit{
      margin: 30px 60px;
      button{
        width: 98px;
      }
    }

  }
  .el-tooltip__popper{
    max-width: 70%;
  }
    .el-tabs {
      .el-tabs__nav-wrap.is-top::after {
      height: 1px;
      }
      /*.el-tabs__nav-wrap.is-left::after{*/
        /*width: 1px;*/
      /*}*/
    }

    .el-aside {
      width: auto !important;
      min-height: calc(100vh - 70px);
    }

    .main_box {
      padding: 0 !important;
    }
</style>

