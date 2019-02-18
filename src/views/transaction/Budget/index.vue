<template>
  <div class="app-container">
    <eHeader :roles="roles" :query="query"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="listdata.data" size="small" border style="width: 100%;">
      <el-table-column prop="id" label="开始时间"/>
      <el-table-column prop="phoneTo" label="结束时间"/>
      <el-table-column prop="realNameTo" label="售卖单数"/>
      <el-table-column prop="phoneIn" label="销售总额"/>
      <el-table-column prop="realNameIn" label="分享奖"/>
      <el-table-column prop="price" label="公排奖"/>
      <el-table-column prop="createTime" label="体恤奖"/>
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
      this.url = "api/transfer/findTransfer";
      const sort = "id,desc";
      const query = this.query;
      const phone = query.type==1?query.phone1:query.phone2;
      const type = query.type;
      this.params = { page: this.page, size: this.size, phone: phone,type:type };
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
