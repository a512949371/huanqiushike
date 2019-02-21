<template>
  <div class="app-container">
    <eHeader :roles="roles" :query="query"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="listdata.data.content" size="small" border style="width: 100%;">
      <el-table-column prop="id" label="序号"/>
      <el-table-column prop="member" label="会员账号"/>
      <el-table-column prop="memberNickName" label="会员昵称"/>
      <el-table-column prop="commission" label="奖励金额"/>
      <el-table-column prop="sharedMember" label="分享会员"/>
      <el-table-column prop="number" label="购买单数"/>
      <el-table-column prop="fireBurn" label="烧伤"/>
      <el-table-column prop="orderSn" label="订单编号"/>
      <el-table-column prop="createTime" label="到账时间"/>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="listdata.data.totalElements"
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
      listdata: {data:''}
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
          console.log("fenxiang", res);
          this.listdata = res;
        });
      });
    },
    beforeInit() {
      this.url = "api/shareManage";
      const sort = "id,desc";
      const query = this.query;
      const phone =query.phone;
      this.params = { page: this.page, size: this.size, member: phone };
      console.log("fenxiang params", this.params);
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
