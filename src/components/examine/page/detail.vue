<template>
  <div id="detail">
    <el-row class="el_row el_line">
      <el-col :span="4" class="el_name">{{type==='center'?'中心名称':'基地名称'}}</el-col>
      <el-col :span="18">
        <el-input disabled v-model="info.name"></el-input>
      </el-col>
    </el-row>
    <el-row class="el_row el_line">
      <el-col :span="4" class="el_name">{{type==='center'?'中心编号':'基地编号'}}</el-col>
      <el-col :span="18">
        <el-input disabled v-model="info.num"></el-input>
      </el-col>
    </el-row>
    <el-row class="el_row el_line">
      <el-col :span="4" class="el_name">机构</el-col>
      <el-col :span="18">
        <el-input disabled v-model="info.mechanismName"></el-input>
      </el-col>
    </el-row>
    <el-row class="el_row el_line">
      <el-col :span="4" class="el_name">所在省市</el-col>
      <el-col :span="18" style="margin-top: 0;">
        <el-col :span="6">
          <el-input disabled v-model="info.province"></el-input>
        </el-col>
        <el-col :span="1" class="text-center">省</el-col>
        <el-col :span="6">
          <el-input disabled v-model="info.city"></el-input>
        </el-col>
        <el-col :span="1" class="text-center">市</el-col>
      </el-col>
    </el-row>
    <el-row class="el_row el_line">
      <el-col :span="4" class="el_name">详细地址</el-col>
      <el-col :span="18">
        <el-input type="textarea" disabled v-model="info.address"></el-input>
      </el-col>
    </el-row>
    <el-row class="el_row el_line">
      <el-col :span="4" class="el_name">邮编</el-col>
      <el-col :span="18">
        <el-input disabled v-model="info.zipCode"></el-input>
      </el-col>
    </el-row>
    <el-row class="el_row el_line">
      <el-col :span="4" class="el_name">联系人</el-col>
      <el-col :span="18">
        <el-input disabled v-model="info.linkMan"></el-input>
      </el-col>
    </el-row>
    <el-row class="el_row el_line">
      <el-col :span="4" class="el_name">电话</el-col>
      <el-col :span="18">
        <el-input disabled v-model="info.linkPhone"></el-input>
      </el-col>
    </el-row>
    <el-row class="el_row el_line">
      <el-col :span="4" class="el_name">邮箱</el-col>
      <el-col :span="18">
        <el-input disabled v-model="info.email"></el-input>
      </el-col>
    </el-row>
    <el-row class="el_row el_line">
      <el-col :span="4" class="el_name">单位性质</el-col>
      <el-col :span="18">
        <el-input disabled v-model="info.nature"></el-input>
      </el-col>
    </el-row>
    <el-row class="el_row el_line">
      <el-col :span="4" class="el_name">单位概况</el-col>
      <el-col :span="18">
        <el-input type="textarea" disabled v-model="info.survey"></el-input>
      </el-col>
    </el-row>
    <el-row class="el_row el_line">
      <el-col :span="4" class="el_name">中心面积</el-col>
      <el-col :span="18" style="margin-top: 0;">
        <el-col :span="22">
          <el-input disabled v-model="info.area"></el-input>
        </el-col>
        <el-col :span="2" style="padding-left: 10px;">平方米</el-col>
      </el-col>
    </el-row>
    <el-row class="el_row el_line">
      <el-col :span="4" class="el_name">设备种类</el-col>
      <el-col :span="18">
        <el-input type="textarea" disabled v-model="info.equipmentType"></el-input>
      </el-col>
    </el-row>
    <el-row class="el_row el_line">
      <el-col :span="4" class="el_name">可容纳人数</el-col>
      <el-col :span="18">
        <el-input disabled v-model="info.hold"></el-input>
      </el-col>
    </el-row>
    <el-row class="el_row el_line" v-if="type === 'center'">
      <el-col :span="4" class="el_name">往期活动</el-col>
      <el-col :span="18">
        <el-input type="textarea" disabled v-model="info.oldActivity"></el-input>
      </el-col>
    </el-row>
    <div slot="footer" class="text-center">
      <el-button size="small" style="margin-top: 20px;" @click="$router.go(-1)">返 回</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "detail",
    data() {
      return {
        type: this.$route.params.type ? this.$route.params.type : 'center',
        id: this.$route.query.id ? this.$route.query.id : '',
        info: {
          address: "",
          area: '',
          city: "",
          email: "",
          equipmentType: "",
          examineState: null,
          examineStateValue: null,
          hold: '',
          id: '',
          linkMan: "",
          linkPhone: "",
          mechanismId: null,
          mechanismName: "",
          name: "",
          nature: "",
          num: "",
          oldActivity: "",
          province: "",
          survey: "",
          zipCode: ""
        }
      }
    },
    methods: {
      getMain() {
        if (this.id) {
          let url = `/activity/center/${this.id}`;
          if (this.type === 'base')
            url = `/activity/base/${this.id}`;
          this.$ajax.get(url).then(res => {
            if (res.status === 200) {
              this.info = res.data;
            } else
              this.$message.error(res.data.msg);
          });
        }
      }
    },
    mounted() {
      this.getMain();
    }
  }
</script>

<style scoped>

</style>
