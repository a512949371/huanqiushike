<template>
  <div class="app-container">
    <eHeader :roles="roles" :query="query"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="listdata.data" size="small" border style="width: 100%;">
      <el-table-column prop="id" label="序号"/>
      <el-table-column prop="accountId.userName" label="会员账号"/>
      <el-table-column prop="nickName" label="会员昵称"/>
      <el-table-column prop="price" label="奖励金额"/>
      <el-table-column prop="accountNo" label="出局账号"/>
      <el-table-column prop="groupName" label="出局团位"/>
      <el-table-column label="到账时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
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
import initData from "@/mixins/initData";
import { getRoleTree } from "@/api/role";
import { parseTime } from "@/utils/index";
import eHeader from "./header";
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
          console.log("gongpai", res);
          this.listdata = res;
        });
      });
    },
    beforeInit() {
      this.url = "api/bonus/selectList";
      const sort = "id,desc";
      const query = this.query;
      const phone = query.phone;
      this.params = {
        page: this.page,
        size: this.size,
        userName: phone,
        type: 0
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
