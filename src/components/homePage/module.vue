<template>
  <div id="module">
    <template v-if="list.length > 0" v-for="(item,index) in list">
      <el-row class="el_row el_line">
        <el-col :span="4" class="el_name" v-html="item.name"></el-col>
        <el-col :span="10">
          <el-input v-model.trim="item.customUrl" placeholder="请选择链接" disabled></el-input>
        </el-col>
        <el-col :span="10" style="padding-left: 10px;">
          <el-button type="primary" @click="showDialog(item)">选择</el-button>
        </el-col>
      </el-row>
    </template>
    <urlSelector ref="url" @hideDialog="hideDialog" @getUrl="getUrl"></urlSelector>
  </div>
</template>

<script>
  import urlSelector from '@/components/common/urlSelector'

  export default {
    name: "module",
    data() {
      return {
        id: null,
        list: [],
        urlData: {
          modal: false,
          linkData: {
            linkType: 0,
            linkUrl: '',
            linkOther: 0,
            linkCustom: '',
            customUrl: ''
          }
        }
      }
    },
    components: {
      urlSelector
    },
    methods: {
      showDialog(item) {
        this.id = item.id;
        if (item.linkType === null) {
          item.linkType = 0;
        }
        let data = {
          modal: true,
          linkData: {
            linkType: item.linkType,
            linkUrl: '',
            linkOther: 0,
            linkCustom: '',
            customUrl: ''
          }
        };
        switch (item.linkType) {
          case 0:
            data.linkData.linkUrl = item.url;
            break;
          case 1:
            data.linkData.linkCustom = item.url;
            break;
          case 2:
            data.linkData.linkOther = item.url;
            break;
        }
        data.linkData.customUrl = item.customUrl;
        this.$refs.url.getParams(data);
      },
      hideDialog() {
        this.urlData.modal = false;
        this.$refs.url.closeDialog();
      },
      getUrl(linkData) {
        let url = '';
        switch (parseInt(linkData.linkType)) {
          case 0:
            url = linkData.linkUrl;
            break;
          case 1:
            url = linkData.linkCustom;
            break;
          case 2:
            url = linkData.linkOther;
            break;
        }
        this.$ajax.put(`/module/update`, {
          id: this.id,
          url: url,
          linkType: linkData.linkType,
          customUrl: linkData.customUrl
        }).then(res => {
          if (res.status === 200) {
            this.$message.success(res.data.msg);
            this.id = null;
            this.hideDialog();
            this.getList();
          } else
            this.$message.error(res.data.msg);
        });
      },
      getList() {
        this.$ajax.get('/module/modules').then(res => {
          if (res.status === 200) {
            this.list = res.data;
          } else
            this.$message.error(res.data.msg);
        });
      }
    },
    mounted() {
      this.getList();
    }
  }
</script>

<style scoped>

</style>
