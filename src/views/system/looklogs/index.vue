<template>
  <div class="app-container">
    <eHeader :roles="roles" :query="query" v-on:childMethod="parentMethod"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="listdata.data" size="small" border style="width: 100%;">
      <el-table-column type="index" label="编号"/>
      <el-table-column prop="username" label="操作用户"/>
      <el-table-column prop="description" label="操作名称"/>
      <el-table-column label="操作时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="requestIp" label="操作ip"/>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="listdata.count"
      :current-page="page"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
    <edit
      v-if="isRouterAlive"
      ref="form"
      :data="getdata"
      :sup_this="sup_this"
    />
  </div>
</template>
<script>
import checkPermission from "@/utils/permission";
import { parseTime } from "@/utils/index";
import { getRoleTree } from "@/api/role";
import initData from "@/mixins/initData";
import { orderdetail } from '@/api/shop';
import eHeader from "./module/header";
import edit from "./module/edit";
const Index = {
  components: { eHeader, edit },
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
    parentMethod() {
      var that = this;
      this.page = 0;
      this.init().then(res => {
        console.log("then2", res);
        that.listdata = res;
        console.log(that.listdata);
      });
    },
    to(id) {
      const _this = this.$refs.form;
      orderdetail(id).then((res)=>{
        console.log('ord',res)
        this.getdata=res.data;
        _this.courierCompany=res.data.courierCompany;
        _this.courierNum=res.data.courierNum
      }).catch((res)=>{
        this.getdata=[]
      })
      _this.dialog = true;
    },
    beforeInit() {
      this.url = "api/log/selectList";
      const query = this.query;
      console.log("query", query);
      const createTime=query.createTime;
      const endTime=query.endTime;
      const description=query.description;
      this.params = {
        page: this.page,
        size: this.size,
        createTime:createTime,
        endTime:endTime,
        description:description
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
.desc {
  font-size: 14px;
  color: #0066a1;
  text-decoration: underline;
  cursor: pointer;
  padding-right: 10px;
}
</style>
