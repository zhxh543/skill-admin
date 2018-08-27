<template>
  <div class="crumbs" :crumbs="crumbs">
    <template v-for="(item,index) in crumbs">
      <em v-if="index > 0"> /</em>
      <!--<a :href="'#' + item.route.path" v-html="item.name"></a>-->
      <span v-html="item.name"></span>
    </template>
    <!--<div class="back_btn" @click="back">-->
    <!--返回-->
    <!--</div>-->
  </div>
</template>
<script>
  export default {
    name: 'crumbs',
    data() {
      return {}
    },
    props: ['crumbs'],
    mounted: function () {
    },
    methods: {
      // 返回
      back() {
        this.$router.go(-1);
      }
    }
  }
</script>
<style lang="less" type="text/less">
  .crumbs {
    background: #ffffff;
    color: #333;
    font-size: 14px;
    color: #333;
    font-size: 14px;
    border-bottom: 1px solid #e4e7ed; //跟出版云一致，统一面包屑不要下划线
    padding-bottom: 22px;
    margin-bottom: 20px;
    em {
      font-style: normal;
      margin: 0 5px;
      color: #aaa;
    }
    a, span {
      color: #666;
      /*cursor: pointer;*/
      &:first-child {
        font-weight: bold;
        color: #333333
      }
      /*&:last-child {*/
      /*cursor: default;*/
      /*}*/
    }
    .back_btn {
      position: absolute;
      right: 0;
      top: 0px;
      font-size: 14px;
      color: #666;
      line-height: 28px;
      cursor: pointer;
      padding: 0 4px;
    }
  }
</style>
