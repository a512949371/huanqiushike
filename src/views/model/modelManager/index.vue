<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" style="padding-left: 5px;">
      <el-tab-pane label="团设置" name="first">
        <group/>
      </el-tab-pane>
      <el-tab-pane label="商城设置" name="second">
        <shop/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import group from "./module/group";
import shop from "./module/shop";

export default {
  components: { group, shop },
  data() {
    return {
      activeName: "second"
    };
  }
};
</script>

<style scoped>
</style>
