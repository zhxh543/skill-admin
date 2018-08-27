<template>
  <div id="selector">
    <ul>
      <li>
        <div class="sel_name">关键字</div>
        <div class="sel_text">
          <input type="text" v-model.trim="search.keyWord" :placeholder="search.placeholder">
          <el-button type="primary" size="mini" @click="$emit('getList',1)">搜索</el-button>
        </div>
        <div class="sel_arrow" v-if="search.list && search.list.length > 0">
          <el-button type="info" size="mini" @click="selMore = !selMore">{{arrow}}<i class="el-icon-arrow-down"></i>
          </el-button>
        </div>
      </li>
      <template v-if="selMore">
        <li v-if="search.list && search.list.length > 0" v-for="(item,index) in search.list" :key="index">
          <div class="sel_name" v-html="item.name"></div>
          <div class="sel_text">
            <template v-if="item.list && item.list.length > 0" v-for="(itm,idx) in item.list">
              <el-radio v-model="item.value" :label="itm.value">{{itm.name}}</el-radio>
            </template>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "selector",
    props: ['search'],
    data() {
      return {
        radio: '1',
        selMore: false,
        arrow: '展开'
      }
    },
    watch: {
      selMore(val) {
        if (val)
          this.arrow = '收起';
        else
          this.arrow = '展开';
      }
    }
  }
</script>

<style scoped type="text/less" lang="less">
  #selector {
    width: 100%;
    margin: 20px auto;
    ul {
      width: 100%;
      font-size: 14px;
      color: #999999;
      border: 1px solid #dcdfe6;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      overflow: hidden;
      li {
        line-height: 40px;
        width: 100%;
        overflow: hidden;
        display: flex;
        border-bottom: 1px solid #dcdfe6;
        &:last-child {
          border-bottom: none;
        }
        .sel_name {
          width: 100px;
          float: left;
          background: #f1f8ff;
          text-align: right;
          padding-right: 10px;
          border-right: 1px solid #dcdfe6;
        }
        .sel_text {
          flex: 1;
          padding-left: 20px;
          input {
            width: 300px;
            height: 30px;
            border: 1px solid #dcdfe6;
            padding: 0 5px;
            font-size: 12px;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            margin-right: 10px;
            color: #666666;
          }
        }
        .sel_arrow {
          width: 75px;
          padding-right: 10px;
          button {
            padding-right: 10px;
          }
          i {
            margin-left: 5px;
          }
        }
      }
    }
  }
</style>
