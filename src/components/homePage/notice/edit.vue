<template>
  <div id="newsEdit">
    <div class="news_line border">
      <div class="line_1_img">
        <bannerUpload ref="upload1" @bannerImg="getBannerImg"></bannerUpload>
      </div>
      <div class="line_1_text">
        <textarea v-model.trim="info.title" placeholder="请输入标题，不超过50字" maxlength="50"></textarea>
      </div>
    </div>
    <div class="news_row">
      <el-input v-model.trim="info.seq" placeholder="请输入排序，不超过10位数"></el-input>
    </div>
    <div class="news_row">
      <bannerUpload ref="upload2" @headImg="getHeadImg"></bannerUpload>
    </div>
    <el-row class="news_row">
      <Editor ref="editor" :content="content" :isEdit="true"></Editor>
    </el-row>
    <el-row>
      <el-button type="primary" :loading="loading" @click="editNews">保 存</el-button>
    </el-row>
  </div>
</template>

<script>
  import bannerUpload from '@/components/homePage/imgUpload/index'
  import Editor from '@/components/common/Editor'
  import {validateNum} from '@/util/validate'

  export default {
    name: "newsEdit",
    data() {
      return {
        id: this.$route.query.id,
        loading: false,
        info: {
          cover: '',
          headMap: '',
          type: 1,
          title: '',
          seq: '',
          content: ''
        },
        content: {
          html: '',
          text: ''
        }
      }
    },
    methods: {
      getBannerImg(url) {
        this.info.cover = url;
      },
      getHeadImg(url) {
        this.info.headMap = url;
      },
      editNews() {
        let url = '/page/save';
        if (this.id)
          url = '/page/update';
        if (!this.info.cover) {
          this.$message.warning('请上传封面');
          return false;
        }
        if (!this.info.title) {
          this.$message.warning('请输入标题');
          return false;
        }
        if (!this.info.seq) {
          this.$message.warning('请输入排序');
          return false;
        }
        if (!validateNum(this.info.seq)) {
          this.$message.warning('请填写正确排序（小于10位数的正整数）');
          return false;
        }
        if (!this.info.headMap) {
          this.$message.warning('请上传头图');
          return false;
        }
        if (!this.content.html) {
          this.$message.warning('请输入内容');
          return false;
        } else {
          this.info.content = this.content.html;
        }
        this.loading = true;
        this.$ajax.put(url, this.info).then(res => {
          this.loading = false;
          if (res.status === 200) {
            this.$message.success(res.data.msg);
            this.$router.push({name: 'noticeIndex'});
          } else
            this.$message.error(res.data.msg);
        });
      },
      getNews() {
        this.$ajax.get(`/page/edit/${this.id}`).then(res => {
          if (res.status === 200) {
            this.info = res.data;
            this.content.html = res.data.content;
            this.$refs.upload1.setImg(res.data.cover);
            this.$refs.upload2.setImg(res.data.headMap);
            this.$refs.editor.writeContent();
          }
        });
      }
    },
    components: {
      bannerUpload,
      Editor
    },
    mounted() {
      if (this.id)
        this.getNews();
      this.$refs.upload1.getParams('banner', 1);
      this.$refs.upload2.getParams('2', 4);
    }
  }
</script>

<style scoped type="text/less" lang="less">
  .news_row {
    width: 100%;
    margin-bottom: 20px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    overflow: hidden;
    &.border {
      border: 1px #dcdfe6 solid;
    }
  }

  .news_line {
    width: 100%;
    overflow: hidden;
    display: flex;
    margin-bottom: 20px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    &.border {
      border: 1px #dcdfe6 solid;
    }
    .line_1_img {
      width: 200px;
      height: 200px;
    }
    .line_1_text {
      flex: 1;
      height: 200px;
      textarea {
        width: 100%;
        height: 210px;
        outline: none;
        padding: 10px;
        font-size: 14px;
        color: #666666;
      }
    }
  }
</style>
