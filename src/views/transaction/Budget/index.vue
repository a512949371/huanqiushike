<template>
  <div class="app-container">
    <eHeader :roles="roles" :query="query"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="listdata" size="small" border style="width: 100%;">
      <el-table-column prop="startTime" label="开始时间"/>
      <el-table-column prop="endTime" label="结束时间"/>
      <el-table-column prop="orderNum" label="售卖单数"/>
      <el-table-column prop="orderAmount" label="销售总额"/>
      <el-table-column prop="shareAmount" label="分享奖"/>
      <el-table-column prop="publicAmount" label="公排奖"/>
      <el-table-column prop="ompassionate" label="体恤奖"/>
    </el-table>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission";
import initData from "@/mixins/initData";
import { getRoleTree } from "@/api/role";
import { parseTime } from "@/utils/index";
import eHeader from "./module/header";
export default {
  components: { eHeader },
  mixins: [initData],
  data() {
    return {
      roles: [],
      sup_this: this,
      listdata: []
    };
  },
  created() {
    this.getRoles();
    this.initListData();
  },

  methods: {
    parseTime,
    checkPermission,
    initListData() {
      this.$nextTick(() => {
        this.init().then(res => {
          console.log("then", res);
          this.listdata=[];
          this.listdata.push(res) ;
        });
      });
    },
    beforeInit() {
      this.url = "api/income/expend/selectList";
      const sort = "id,desc";
      const query = this.query;
      const endTime = query.endTime;
      const startTime = query.startTime;
      const type = query.type;
      this.params = { page: this.page, size: this.size, endTime: endTime,startTime:startTime };
      console.log("params", query);
      return true;
    },
    getRoles() {
      getRoleTree().then(res => {
        this.roles = res;
      });
    }
  }
};
</script>

<style scoped>
.d {
  align-items: center;
}
</style>
