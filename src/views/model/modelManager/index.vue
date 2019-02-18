<template>
  <div class="app-container">
    <!--表格渲染-->
    
    <el-table v-loading="loading" :data="listdata.data" size="small" border style="width: 100%;">
      <el-table-column type="index" label="编号"/>
      <el-table-column prop="groupName" label="团名称"/>
      <el-table-column prop="level" label="团等级"/>
      <el-table-column prop="quota" label="团指标"/>
      <el-table-column prop="rankReward" label="公排奖励"/>
      <el-table-column prop="cpAmount" label="体恤金比例"/>
      <el-table-column  label="出局条件">
        <el-table-column prop="recommendedNum" label="直推人数"/>
        <el-table-column prop="totalOrder" label="购买总单数"/>
        <el-table-column prop="groupAccountNum" label="团队人数"/>
      </el-table-column>

      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
             <edit v-if="checkPermission(['ADMIN','USER_ALL','USER_EDIT'])" :data="scope.row"  :sup_this="sup_this"/>
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
import { getRoleTree } from "@/api/role";
import initData from "@/mixins/initData";
import edit from './module/edit'
const Index = {
  components: {edit},
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
      dialog: false,
      getdata: {},
      childdata: [],
      isRouterAlive: true
    };
  },
  created() {
    var that = this;
    this.getRoles();
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
    closealert() {
      this.dialog = false;
    },
    beforeInit() {
      this.url = "api/accountRankConfig/selectList";
      this.params = {
        page: this.page,
        size: this.size,
      };
      return true;
    },
    getRoles() {
      getRoleTree().then(res => {
        this.roles = res;
      });
    }
  }
};
export default Index;
</script>
<style lang="scss" scoped>

</style>
