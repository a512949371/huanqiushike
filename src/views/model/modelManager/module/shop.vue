<template>
  <div class="app-container">
    <!--表格渲染-->
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      border
      style="width: 100%;"
      label-width="160px"
    >
      <el-form-item label="自动排单时间设置：" prop="orderTime">
        <el-input v-model="form.orderTime" style="width: 370px;"/> 秒
      </el-form-item>
      <el-form-item label="账号VIP等级上限：" prop="upperLimit">
        <el-input v-model="form.upperLimit" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button :loading="loading" type="primary" @click="doSubmit">保存设置</el-button>
    </div>
  </div>
</template>
<script>
import { shopInfo, shopSave } from "@/api/model";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "Form",
  components: { Treeselect },
  props: {},
  data() {
    return {
      dialog: false,
      loading: false,
      form: { orderTime: 0, upperLimit: "" },
      rules: {
        orderTime: [
          { required: true, message: "请输入自动排单时间", trigger: "blur" }
        ],
        upperLimit: [
          { required: true, message: "请输入账号VIP等级上限", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.init();
  },

  methods: {
    init() {
      var that = this;
      shopInfo().then(res => {
        console.log('shopInfo',res)
        that.form = res.infos;
      });
    },
    doSubmit() {
      console.log("doSubmit");
      this.$refs["form"].validate(valid => {
        console.log("valid", valid);
        if (valid) {
          this.loading = true;
          shopSave(this.form)
            .then(res => {
              this.resetForm();
              this.$notify({
                title: "修改成功",
                type: "success",
                duration: 2500
              });
              this.loading = false;
              this.init();
            })
            .catch(err => {
              this.loading = false;
              console.log(err.response.data.message);
            });
        } else {
          return false;
        }
      });
    },

    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.roleIds = [];
      this.form = { orderTime: "", upperLimit: "" };
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
