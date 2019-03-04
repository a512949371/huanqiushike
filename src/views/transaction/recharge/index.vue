<template>
  <div class="app-container">
    <eHeader :roles="roles" :query="query"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="listdata.data" size="small" border style="width: 100%;">
      <el-table-column prop="id" label="序号"/>
      <el-table-column prop="account.userName" label="会员账号"/>
      <el-table-column prop="rechargeBefore" label="充值前余额"/>
      <el-table-column prop="rechargeAmount" label="充值金额"/>
      <el-table-column prop="rechargeAfter" label="充值后余额"/>
      <el-table-column label="充值类型">
        <template slot-scope="scope">
          <span v-show="scope.row.type==0">PC端余额</span>
          <span v-show="scope.row.type==1">小程序充值</span>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="后台充值账号"/>
      <el-table-column prop="addTime" label="充值日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.addTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"/>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="listdata.count"
      :current-page="page+1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
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
          this.listdata = res;
        });
      });
    },
    beforeInit() {
      this.url = "api/topuplog/selectList";
      const sort = "id,desc";
      const query = this.query;
      const phone = query.phone;
      const type = query.type;
      this.params = {
        page: this.page,
        size: this.size,
        userName: phone,
        type: type
      };
      let tp=this.params.type;
      console.log("params", tp);
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
