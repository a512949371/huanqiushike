<template>
  <div class="app-container">
    <!--表格渲染-->
    <el-table v-loading="loading" :data="listdata.data" size="small" border style="width: 100%;">
      <el-table-column type="index" label="编号"/>
      <el-table-column prop="groupName" label="团名称"/>
      <el-table-column prop="subAccountNum" label="子账号数"/>
      <el-table-column prop="virtualAccountNum" label="虚拟子账号数"/>
      <el-table-column prop="quota" label="团指标"/>
      <el-table-column prop="rankReward" label="公排奖励"/>
      <el-table-column label="出局条件" align="center">
        <el-table-column prop="recommendedNum" label="直推人数"/>
        <el-table-column prop="totalOrder" label="总购买单数"/>
        <el-table-column prop="groupAccountNum" label="团队人数"/>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button slot="reference" type="info" size="mini" @click="to(scope.row.groupName)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="listdata.count"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>
<script>
import checkPermission from "@/utils/permission";
import { parseTime } from "@/utils/index";
import { worldlist } from "@/api/world";
import { getRoleTree } from "@/api/role";
import initData from "@/mixins/initData";
const Index = {
  mixins: [initData],
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      roles: [],
      delLoading: false,
      sup_this: this,
      listdata: [],
      dialog: false
    };
  },
  created() {
    var that = this;
    this.$nextTick(() => {
      this.init().then(res => {
        console.log("then", res);
        that.listdata = res;
      });
    });
  },
  methods: {
    parseTime,
    checkPermission,
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    },
    to(groupName) {
      this.$router.push({
        path: "/local/detail",
        query: { groupName: groupName }
      });
    },
    beforeInit() {
      this.url = "api/accountRankConfig/select/list";
      const query = this.query;
      console.log("query", query);
      const type = query.type;
      this.params = { page: this.page, size: this.size };
      return true;
    }
  }
};
export default Index;
</script>
<style lang="scss" scoped>
.desc {
  font-size: 14px;
  color: #0066a1;
  text-decoration: underline;
  cursor: pointer;
  padding-right: 10px;
}
</style>
