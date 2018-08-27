<template>
  <div class="top">
    <a class="logo" href="/">
      <!--<img src="./img/logo.png" alt="logo">-->
      少年电子技师科普活动官方网站-后台管理系统

    </a>
    <ul>
      <!--<li @click="changeView('newsManage','systemMessageManage')">-->
      <!--<i class="el-icon-bell"></i>-->
      <!--<sub v-if="isRead" id="isReadId">&nbsp;</sub>-->
      <!--</li>-->
      <li>
        <el-popover
          placement="bottom"
          trigger="hover">
          <div class="userMenu">
            <p @click="dialogVisible = true">修改密码</p>
            <!--<p @click="weChatBinding">微信绑定</p>-->
            <!--@click="changeView('logisticsManage','inventoryManage')"-->
            <p @click="logOut">退出登录</p>
          </div>
          <span slot="reference" class="userName">
            <em v-html="userName"></em>
            <i class="el-icon-arrow-down"></i>
          </span>
        </el-popover>
      </li>
    </ul>
    <div id="changePass">
      <el-dialog
        title="修改密码"
        :visible.sync="dialogVisible"
        width="580px"
        :before-close="handleClose">
        <el-form :model="formPassWord" status-icon :rules="rules2" ref="formPassWord" label-width="70px"
                 class="pass-ruleForm">
          <el-form-item label="原密码" prop="oldPwd">
            <el-input v-model.trim="formPassWord.oldPwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input v-model.trim="formPassWord.password" type="password"></el-input>
            <!--type="password"-->
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input v-model.trim="formPassWord.checkPass" type="password"></el-input>
          </el-form-item>

          <p class="rds-remark" v-html="'密码由字母、数字和特殊字符组合，至少8位。特殊字符包括 ~!@#$%^&*_'"></p>
          <div style="text-align: center;margin-top: 20px">
            <el-button @click="handleClose" size="small">取消</el-button>
            <el-button type="primary" size="small" @click="submitForm('formPassWord')">确定</el-button>
            <!--@click="submitForm('formPassWord')"-->
          </div>
        </el-form>
      </el-dialog>
      <el-dialog
        title="微信绑定"
        :visible.sync="dialogWeChat"
        width="380px"
        :before-close="handleCloseWeChat">
        <div class="weChatImg">
          <p v-if="weChatUrl">请用微信扫一扫！</p>
          <img :src="weChatUrl" v-if="weChatUrl">
          <span v-else v-text="weChatText"></span>
          <p v-show="isBinding" style="color: #ff0000">已绑定，扫码将覆盖原绑定微信号！</p>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  // 正则验证密码强度
  import {validatePassLevel} from '@/util/validate';
  import md5 from 'md5';

  var QRCode = require('qrcode')

  export default {
    name: 'top',
    data() {
      var checkOldPass = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('原密码不能为空'));
        } else {
          callback();
        }

      };
      var validatePass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入新密码'));
        } else {
          if (!validatePassLevel(value)) {
            callback(new Error('请输入:字母+数字+特殊字符格式密码'));
          } else {
            callback();
          }
        }
      };
      var validatecCheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value != this.formPassWord.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        dialogVisible: false,
        dialogWeChat: false,
        weChatUrl: "",
        weChatText: "",
        isBinding: false,//微信是否已绑定
        userName: "",
        formPassWord: {
          password: '',
          checkPass: '',
          oldPwd: ''
        },
        rules2: {
          password: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatecCheckPass, trigger: 'blur'}
          ],
          oldPwd: [
            {validator: checkOldPass, trigger: 'blur'}
          ]
        },
        isRead: false
      };
    },
    mounted: function () {
      this.getUser();
    },
    watch: {
      'isRead': function (newValue, oldValue) {
      }
    },
    methods: {
      getUser() {
        this.$ajax.get('/getUser').then(res => {
          if (res.status === 200) {
            this.userName = res.data.name ? res.data.name : res.data.realName;
          } else
            this.$message.error(res.data.msg);
        });
      },
      handleCloseWeChat(done) {
        this.dialogWeChat = false
      },
      //退出
      logOut() {
        let url = "/logout"
        this.$ajax.get(url).then(res => {
          if (res.status === 200) {
            window.location.href = this.webUrl;
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      },
      /*跳转页面*/
      changeView(page, name, com) {
        this.$router.push({name: page, query: {name: name, com: com}})
      },
      handleClose(done) {
        this.$refs['formPassWord'].resetFields();
        this.dialogVisible = false
      },
      submitForm(formName) {
        let url = "/admin/changePwd"
        let param = {
          oldPwd: md5(this.formPassWord.oldPwd),
          password: md5(this.formPassWord.password)
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$ajax.put(url, this.formPassWord).then(res => {
              if (res.status === 200) {
                this.dialogVisible = false
                this.$message({
                  message: "修改密码成功！",
                  type: 'success'
                });
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'error'
                });
              }
            });
          } else {
            console.log('表单错误!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style scoped lang="less" type="text/less">
  .top {
    width: 100%;
    height: 70px;
    background: #373737;
    line-height: 70px;
    overflow: hidden;
    color: #b7b7b7;
    .logo {
      color: #ffffff;
      padding-left: 20px;
      font-size: 16px;
      display: block;
      float: left;
      img {
        width: auto;
        height: 100%;
        margin: 0 40px;
      }
    }
    ul {
      float: right;
      overflow: hidden;
      li {
        float: left;
        padding: 0 35px;
        font-size: 30px;
        border-left: 1px solid #333333;
        position: relative;
        i {
          cursor: pointer
        }
        img {
          width: 48px;
          height: 48px;
          border-radius: 100%;
        }
        sub {
          display: block;
          width: 12px;
          height: 12px;
          text-align: center;
          background: #ff0000;
          border-radius: 100%;
          position: absolute;
          right: 35px;
          top: 30px;
        }
      }
    }
  }

  .userName {
    font-size: 14px;
    cursor: pointer;
    line-height: 20px;
    em, i {
      font-style: normal;
      vertical-align: middle;
    }
  }

  .userMenu {
    p {
      line-height: 30px;
      cursor: pointer;
      padding-left: 10px;
    }
  }
</style>

<style lang="less" type="text/less">

  #changePass {

    .el-dialog__header {
      height: 60px;
      line-height: 60px;
      padding: 0 0 0 20px !important;
      border-bottom: 1px solid #eeeeee;

      .el-dialog__title {
        font-size: 14px;
        color: #333333;
      }

    }
    .weChatImg {
      margin: auto;
      padding: 20px 50px 50px 50px;
      text-align: center;

      img {
        width: 200px;
        height: 200px;
        margin: 20px;
        border: 1px solid #eeeeee;
      }

      span {
        color: #ff0000;
      }

    }
  }
</style>
