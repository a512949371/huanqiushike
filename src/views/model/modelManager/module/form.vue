<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialog"
    :title="isAdd ? '新增团' : '编辑团'"
    width="600px"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="110px">
      <el-form-item label="团名称" prop="groupName">
        <el-input v-model="form.groupName" class="input-item"/>
      </el-form-item>
      <el-form-item label="团等级" prop="level">
        <el-input v-model="form.level" class="input-item"/>
      </el-form-item>
      <el-form-item label="团指标" prop="quota">
        <el-input v-model="form.quota" class="input-item"/>
        <span>单</span>
      </el-form-item>
      <el-form-item label="公排奖励" prop="rankReward">
        <el-input v-model="form.rankReward" class="input-item"/>元
      </el-form-item>
      <el-form-item label="体恤金比例" prop="cpAmount">
        <el-input v-model="form.cpAmount" class="input-item"/>%
      </el-form-item>
      <el-form-item label="出局条件"></el-form-item>
      <el-form-item label="直推人数" prop="recommendedNum">
        <el-input v-model="form.recommendedNum" class="input-item"/>人
      </el-form-item>
      <el-form-item label="购买总单数" prop="totalOrder">
        <el-input v-model="form.totalOrder" class="input-item"/>单
      </el-form-item>
      <el-form-item label="团队人数" prop="groupAccountNum">
        <el-input v-model="form.groupAccountNum" class="input-item"/>人
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { edit } from "@/api/model";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "Form",
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    sup_this: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialog: false,
      loading: false,
      form: {
        groupName: "",
        level: "",
        quota: "",
        rankReward: "",
        cpAmount: "",
        rankReward: "",
        recommendedNum: "",
        totalOrder: "",
        groupAccountNum: ""
      },
      roleIds: [],
      rules: {
        groupName: [
          { required: true, message: "请输入团名称", trigger: "blur" }
        ],
        level: [{ required: true, message: "请输入团等级", trigger: "blur" }],
        quota: [{ required: true, message: "请输入团指标", trigger: "blur" }],
        rankReward: [
          { required: true, message: "请输入公排奖励", trigger: "blur" }
        ],
        cpAmount: [
          { required: true, message: "请输入体恤金比例", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          this.doEdit();
        } else {
          return false;
        }
      });
    },
    doEdit() {
      edit(this.form)
        .then(res => {
          this.resetForm();
          this.$notify({
            title: "修改成功",
            type: "success",
            duration: 2500
          });
          this.loading = false;
          this.sup_this.init().then(res => {
            this.sup_this.listdata = res;
          });
        })
        .catch(err => {
          this.loading = false;
          console.log(err.response.data.message);
        });
    },
    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.roleIds = [];
      this.form = {
        groupName: "",
        level: "",
        quota: "",
        rankReward: "",
        cpAmount: "",
        rankReward: "",
        recommendedNum: "",
        totalOrder: "",
        groupAccountNum: ""
      };
    }
  }
};
</script>

<style  lang="scss" scoped>
.input-item {
  width: 400px;
}
</style>
