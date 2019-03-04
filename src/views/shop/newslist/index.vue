<template>
  <div class="app-container">
    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
      <el-tab-pane label="文章管理" name="first">
        <div class="flex-box-end pb10">
          <el-button type="primary" icon="el-icon-plus" @click="add">添加文章</el-button>
        </div>
        <!--表格渲染-->
        <el-table
          v-loading="loading"
          :data="listdata.data"
          size="small"
          border
          style="width: 100%;"
        >
          <el-table-column type="index" label="编号"/>
          <el-table-column prop="title" label="文章标题"/>
          <el-table-column prop="createTime" label="发布时间">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <el-button slot="reference" type="warning" size="mini" @click="to(scope.row.id)">修改</el-button>
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
        <Edit :isadd="isadd" ref="edit" :su_this="su_this"></Edit>
      </el-tab-pane>
      <el-tab-pane label="广告位管理" name="second">
        <div class="flex-box-end pb10">
          <el-button type="primary" icon="el-icon-plus" @click="addbanner">新增广告</el-button>
        </div>
        <!--表格渲染-->
        <el-table
          v-loading="loading"
          :data="listdata.data"
          size="small"
          border
          style="width: 100%;"
        >
          <el-table-column type="index" label="编号"/>
          <el-table-column label="广告图">
            <template slot-scope="scope">
              <img class="bannerimg" :src="scope.row.imgUrl">
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <el-button slot="reference" type="warning" size="mini" @click="tobanner(scope.row)">编辑</el-button>
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
                    @click="delbanner(scope.row)"
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
          :current-page="page+1"
          style="margin-top: 8px;"
          layout="total, prev, pager, next, sizes"
          @size-change="sizeChange"
          @current-change="pageChange"
        />
        <Banner :isadd="isadd" ref="banner" :su_this="su_this"></Banner>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import checkPermission from "@/utils/permission";
import { parseTime } from "@/utils/index";
import { getRoleTree } from "@/api/role";
import { onelist, editnews, editbanner } from "@/api/newslist";
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";
import initData from "@/mixins/initData";
import Edit from "./module/edit";
import Banner from "./module/banner";
const Index = {
  mixins: [initData],
  components: { Edit, Banner },
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
      activeName2: "first",
      url: "api/article/selectList",
      su_this: this,
      bannerdata: [],
      headers: {
        Authorization: ""
      }
    };
  },
  created() {
    var that = this;
    this.headers.Authorization = "Bearer " + getToken();
    this.$nextTick(() => {
      this.init().then(res => {
        console.log("then", res);
        that.listdata = res;
      });
    });
  },
  computed: {
    ...mapGetters(["imagesUploadApi"])
  },
  methods: {
    parseTime,
    checkPermission,
    handleClick(tab, event) {
      console.log(tab, event, this.activeName2);
      if (this.activeName2 == "second") {
        this.page = 0;
        this.url = "api/advertising/selectList";
        this.init().then(res => {
          console.log("then", res);
          this.listdata = res;
        });
      } else {
        this.page = 0;
        this.url = "api/article/selectList";
        this.init().then(res => {
          console.log("then", res);
          this.listdata = res;
        });
      }
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    },
    add() {
      const _this = this.$refs.edit;
      this.isadd = false;
      _this.postdata = {};
      _this.dialog = true;
    },
    to(id) {
      const _this = this.$refs.edit;
      this.isadd = true;
      onelist(id).then(res => {
        console.log("res", res);
        _this.postdata = {
          id: res.id,
          title: res.title,
          content: res.content
        };
      });
      _this.dialog = true;
    },
    addbanner() {
      const _this = this.$refs.banner;
      this.isadd = false;
      _this.imgdata = [];
      _this.dialog = true;
    },
    tobanner(data) {
      const _this = this.$refs.banner;
      console.log(data);
      this.isadd = true;
      let pagedata = {
        name: "",
        url: data.imgUrl
      };
      _this.imgdata.push(pagedata);
      _this.id = data.id;
      _this.dialog = true;
    },
    subDelete(data) {
      var that = this;
      this.delLoading = true;
      data.isDelete = -1;
      editnews(data)
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
    delbanner(data) {
      var that = this;
      this.delLoading = true;
      data.isDelete = -1;
      editbanner(data)
        .then(res => {
          this.delLoading = false;
          this.$refs[data.id].doClose();
          this.init().then(res => {
            console.log("then", res);
            that.bannerdata = res;
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
      const query = this.query;
      console.log("query", query);
      const type = query.type;
      this.params = { page: this.page, size: this.size };
      return true;
    },
    imgurlsucess(response, file, fileList) {
      console.log("img", response, file, fileList);
      let data = {
        name: response.data[0],
        url: response.data[0]
      };
      this.imgdata = [];
      this.imgdata.push(data);
      if (this.isadd) {
        this.postdata.imgUrl = response.data[0];
      } else {
        this.postdata["imgUrl"] = response.data[0];
      }
    },
    imgurlfail(response, file, fileList) {
      console.log("imgfail", response, file, fileList);
    },
    imgurlremove(file, fileList) {
      console.log(file, fileList);
      this.postdata.imgUrl = "";
    },
    imgurlexceed(response, file, fileList) {
      console.log("exceed", response, file, fileList);
      this.$notify({
        title: "超过最大上传数量",
        type: "success",
        duration: 2000
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
.bannerimg {
  width: 120px;
  height: 120px;
  display: block;
}
.icon-img {
  width: 48px;
  height: 48px;
  display: block;
}
</style>
