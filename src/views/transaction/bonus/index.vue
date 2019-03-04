<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" style="padding-left: 5px;">
      <el-tab-pane label="分享奖" name="first">
        <fenxiang/>
      </el-tab-pane>
      <el-tab-pane label="体恤奖" name="second">
        <tixu/>
      </el-tab-pane>
      <el-tab-pane label="公排奖" name="third">
        <gongpai/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import gongpai from "./module/gongpai";
import tixu from "./module/tixu";
import fenxiang from "./module/fenxiang";

export default {
  components: { gongpai, fenxiang, tixu },
  data() {
    return {
      activeName: "first"
    };
  }
};
</script>

<style scoped>
</style>
