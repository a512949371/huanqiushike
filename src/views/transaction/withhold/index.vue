<template>
  <div class="app-container">
    <eHeader :roles="roles" :query="query"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="listdata.data" size="small" border style="width: 100%;">
      <el-table-column prop="deductions.id" label="序号"/>
      <el-table-column prop="deductions.account.userName" label="会员账号"/>
      <el-table-column prop="nickName" label="会员昵称"/>
      <el-table-column prop="deductions.rechargeBefore" label="扣款前余额"/>
      <el-table-column prop="deductions.deductionsAmount" label="扣款金额"/>
      <el-table-column prop="deductions.rechargeAfter" label="扣款后余额"/>
      <el-table-column prop="deductions.userName" label="后台扣款账号"/>
      <el-table-column  label="扣款时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.deductions.addTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deductions.remark" label="备注"/>
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
      this.url = "api/deductions/selectList";
      const sort = "id,desc";
      const query = this.query;
      const phone = query.phone;
      const userName = query.userName;
      const type = query.type;
      this.params = {
        page: this.page,
        size: this.size,
        userName: userName,
        phone: phone
      };
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
