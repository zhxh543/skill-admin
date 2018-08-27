<template>
  <div id="entry">
    <el-container>
      <el-header>
        <vheader></vheader>
      </el-header>
    </el-container>
    <el-container>
      <el-aside>
        <vleft :menu-active="menuActive" v-on:activeChanged="changeActive($event)"></vleft>
      </el-aside>
      <el-main class="main_box" :style="(unHome) ? { padding:  '0' } :{ padding:  '20px!important' }">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import vheader from '@/components/header/top.vue'
  import vleft from '@/components/aside/left.vue'

  export default {
    name: 'entry',
    data() {
      return {
        menuActive: false,
        unHome: false
      }
    },
    watch: {
      '$route': function (newValue, oldValue) {
        if (this.$route.path === '/index' || this.$route.path === '/') {
          this.unHome = false
        } else {
          this.unHome = true
        }
      }
    },
    mounted: function () {
      if (this.$route.path === '/index' || this.$route.path === '/') {
        this.unHome = false
      } else {
        this.unHome = true
      }
    },
    methods: {
      changeActive(value) {
        this.menuActive = value
      }
    },
    components: {
      vheader,
      vleft,
      // vright
    }
  }
</script>
<style lang="less">

  .el-header {
    padding: 0 !important;
    height: auto !important;
  }
</style>
