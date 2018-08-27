<template>
  <div id="baseEdit">
    <el-form ref="form" :model="baseInfo" :rules="rules" label-width="120px">
      <el-form-item label="基地名称" prop="name">
        <el-input v-model.trim="baseInfo.name" placeholder="请输入基地名称，不超过50字" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="基地编号" prop="num">
        <el-input v-model.trim="baseInfo.num" placeholder="请输入基地编号，不超过50字" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="机构" prop="mechanismId">
        <el-select v-model.trim="baseInfo.mechanismId" placeholder="请选择考试机构" class="el_long">
          <template v-if="mechanismList.length > 0" v-for="(item,index) in mechanismList">
            <el-option :label="item.name" :value="item.id"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="所在城市" prop="province">
        <el-col :span="10">
          <el-select v-model.trim="baseInfo.province" placeholder="请选择" class="el_long" @change="changeProvince">
            <template v-for="(item,index) in province">
              <el-option :label="item.name" :value="item.name"></el-option>
            </template>
          </el-select>
        </el-col>
        <el-col :span="1" class="text-center">省</el-col>
      </el-form-item>
      <el-form-item prop="city">
        <el-col :span="10">
          <el-select v-model.trim="baseInfo.city" placeholder="请选择" class="el_long" :disabled="city.length === 0">
            <template v-if="city.length > 0 && baseInfo.province" v-for="(item,index) in city">
              <el-option :label="item.name" :value="item.name"></el-option>
            </template>
          </el-select>
        </el-col>
        <el-col :span="1" class="text-center">市</el-col>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input type="textarea" v-model.trim="baseInfo.address" placeholder="请输入详细地址，不超过200字"
                  maxlength="200"></el-input>
      </el-form-item>
      <el-form-item label="邮编" prop="zipCode">
        <el-input v-model.trim="baseInfo.zipCode" placeholder="请输入邮编" maxlength="6"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="linkMan">
        <el-input v-model.trim="baseInfo.linkMan" placeholder="请输入联系人，不超过50字" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="linkPhone">
        <el-input v-model.trim="baseInfo.linkPhone" placeholder="请输入电话" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="baseInfo.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="单位性质" prop="nature">
        <el-input v-model.trim="baseInfo.nature" placeholder="请输入单位性质，不超过50字" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="单位概况" prop="survey">
        <el-input type="textarea" v-model.trim="baseInfo.survey" placeholder="请输入单位概况，不超过200字"
                  maxlength="200"></el-input>
      </el-form-item>
      <el-form-item label="基地面积" prop="area">
        <el-col :span="22">
          <el-input v-model.trim="baseInfo.area" placeholder="请输入基地面积"></el-input>
        </el-col>
        <el-col :span="2" style="padding-left: 10px;">平方米</el-col>
      </el-form-item>
      <el-form-item label="设备种类">
        <el-input type="textarea" v-model.trim="baseInfo.equipmentType" placeholder="请输入设备种类，不超过100字"
                  maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="可容纳人数" prop="hold">
        <el-input v-model.trim="baseInfo.hold" placeholder="请输入单位性质，不超过10位数" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="edit('form')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import area from '@/util/city'
  import {
    validateTelephone,
    validateEmail,
    validateNum,
    validateNumber,
    validateCode,
    validateTel
  } from '@/util/validate'

  export default {
    name: "baseEdit",
    props: ['info'],
    data() {
      let phoneVal = (rule, value, callback) => {
        if (!validateTelephone(value) && !validateTel(value)) {
          callback(new Error('请输入合法的联系电话'));
        } else
          callback();
      };
      let emailVal = (rule, value, callback) => {
        if (!validateEmail(value)) {
          callback(new Error('请输入合法的邮箱'));
        } else
          callback();
      };
      let numVal = (rule, value, callback) => {
        if (!validateNum(value)) {
          callback(new Error('人数只能为正整数'));
        } else
          callback();
      };
      let numberVal = (rule, value, callback) => {
        if (!validateNumber(value)) {
          callback(new Error('面积只能为正数'));
        } else
          callback();
      };
      let codeVal = (rule, value, callback) => {
        if (!validateCode(value)) {
          callback(new Error('请输入合法邮编'));
        } else
          callback();
      };

      return {
        loading: false,
        baseInfo: this.info,
        province: area,
        city: [],
        rules: {
          name: [
            {required: true, message: '请输入基地名称', trigger: 'blur'}
          ],
          num: [
            {required: true, message: '请输入基地编号', trigger: 'blur'},
          ],
          mechanismId: [
            {required: true, message: '请选择机构', trigger: 'change'}
          ],
          province: [
            {required: true, message: '请选择省份', trigger: 'change'}
          ],
          city: [
            {required: true, message: '请选择城市', trigger: 'change'}
          ],
          address: [
            {required: true, message: '请输入详细地址', trigger: 'blur'}
          ],
          zipCode: [
            {required: true, message: '请输入邮编', trigger: 'blur'},
            {validator: codeVal, trigger: 'blur'}
          ],
          linkMan: [
            {required: true, message: '请输入联系人', trigger: 'blur'}
          ],
          linkPhone: [
            {required: true, message: '请输入联系电话', trigger: 'blur'},
            {validator: phoneVal, trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: emailVal, trigger: 'blur'}
          ],
          nature: [
            {required: true, message: '请输入单位性质', trigger: 'blur'}
          ],
          survey: [
            {required: true, message: '请输入单位概况', trigger: 'blur'}
          ],
          area: [
            {required: true, message: '请输入基地面积', trigger: 'blur'},
            {validator: numVal, trigger: 'blur'}
          ],
          hold: [
            {required: true, message: '请输入可容纳人数', trigger: 'blur'},
            {validator: numVal, trigger: 'blur'}
          ]
        },
        mechanismList: []
      }
    },
    watch: {
      info(val) {
        this.baseInfo = val;
      }
    },
    methods: {
      //获取机构列表
      getMechanism() {
        this.$ajax.get('/mechanism/getChooses').then(res => {
          if (res.status === 200) {
            this.mechanismList = res.data;
            if (res.data.length > 0) {
              this.baseInfo.mechanismId = res.data[0].id;
            }
          }
        });
      },
      changeProvince() {
        this.baseInfo.city = '';
        this.province.forEach((item, index) => {
          if (item.name === this.baseInfo.province) {
            this.city = item.list;
          }
        });
      },
      edit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let url = '/activity/saveBase';
            if (this.baseInfo.id)
              url = '/activity/update';
            this.loading = true;
            this.$ajax.put(url, this.baseInfo).then(res => {
              this.loading = false;
              if (res.status === 200) {
                this.$emit('closed');
                this.$message.success(res.data.msg);
                this.$refs[formName].clearValidate();
                this.$refs[formName].resetFields();
              } else
                this.$message.error(res.data.msg);
            });
          } else {
            return false;
          }
        });
      }
    },
    mounted() {
      this.getMechanism();
      if (this.info.id)
        this.province.forEach((item, index) => {
          if (item.name === this.baseInfo.province) {
            this.city = item.list;
          }
        });
    }
  }
</script>

<style scoped>

</style>
