<template>
  <div class="app-container">
    <div class="flex-box-end pb10">
      <el-button type="primary" icon="el-icon-plus" @click="add">添加商品</el-button>
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="listdata.data" size="small" border style="width: 100%;">
      <el-table-column type="index" label="编号"/>
      <el-table-column prop="title" label="商品名称"/>
      <el-table-column label="商品分类">
        <template slot-scope="scope">
          <span>{{scope.row.productClass.className}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序"/>
      <el-table-column prop="price" label="价格"/>
      <el-table-column prop="guige" label="规格"/>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button slot="reference" type="warning" size="mini" @click="to(scope.row.id)">编辑</el-button>
          <el-popover
            v-if="checkPermission(['ADMIN','ROLES_ALL','ROLES_DELETE'])"
            :ref="scope.row.id"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button
                :loading="delLoading"
                type="primary"
                size="mini"
                @click="subDelete(scope.row)"
              >确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popover>
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
    <Edit :isadd="isadd" ref="edit"></Edit>
  </div>
</template>
<script>
import checkPermission from "@/utils/permission";
import { parseTime } from "@/utils/index";
import { getRoleTree } from "@/api/role";
import { selectShopOne, delShopOne } from "@/api/shop";
import initData from "@/mixins/initData";
import Edit from "./module/edit";
const Index = {
  mixins: [initData],
  components: { Edit },
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
      isadd: false,
      onedata: {}
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
    add() {
      const _this = this.$refs.edit;
      this.isadd = false;
      _this.dialog = true;
    },
    to(id) {
      const _this = this.$refs.edit;
      this.isadd = true;
      selectShopOne(id).then(res => {
        console.log("res?", res);
        _this.postdata = res.data
      });
      _this.dialog = true;
    },
    subDelete(data) {
      var that = this;
      this.delLoading = true;
      data.isDelete = -1;
      delShopOne(data)
        .then(res => {
          this.delLoading = false;
          this.$refs[data.id].doClose();
          this.init().then(res => {
            console.log("then", res);
            that.listdata = res;
          });
          this.$notify({
            title: "删除成功",
            type: "success",
            duration: 2500
          });
        })
        .catch(err => {
          this.delLoading = false;
          this.$refs[id].doClose();
          console.log(err.response.data.message);
        });
    },
    beforeInit() {
      this.url = "api/product/selectList";
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
.icon-img {
  width: 48px;
  height: 48px;
  display: block;
}
</style>
