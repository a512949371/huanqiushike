<template>
  <el-dialog
    :append-to-body="false"
    :visible.sync="dialog"
    title="提现账号列表"
    width="400px"
    style="max-height:600px;overflow: scroll-y"
    :modal="false"
  >
    <div class="flex-box-center pd20" v-for="item in data" :key="item.id">
      <div class="pr10 pb10">{{item.withdrawMsg}}</div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "Banklist",
  props: {
    data: {
      type: Array
    }
  },
  data() {
    return {
      dialog: false
    };
  },
  created() {},
  methods: {
    cancel() {
      this.dialog = false;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

