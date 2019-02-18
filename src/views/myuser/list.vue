<template>
  <div>
    <el-tree :props="defaultProps" :load="loadNode1" lazy></el-tree>
  </div>
</template>
<script>
import initData from "@/mixins/initData";
export default {
  name: "List",
  mixins: [initData],
  data() {
    return {
      listdata: [],
      defaultProps: {
        children: "children",
        label: "userStr"
      }
    };
  },
  created() {
    var that = this;
    this.params = { accountId: "" };
    this.$nextTick(() => {
      this.init().then(res => {
        console.log("then", res);
        this.listdata = res.data;
      });
    });
  },
  methods: {
    beforeInit() {
      this.url = "api/account/select";
      return true;
    },
    loadNode1(node, resolve) {
      console.log("node", node);
      if (node.level === 0) {
        this.$nextTick(() => {
          this.init().then(res => {
            console.log("then", res);
            return resolve((this.listdata = res.data));
          });
        });
      }
      if (node.level > 0) {
        this.$nextTick(() => {
          this.params = { accountId: node.data.accountId };
          this.init().then(res => {
            console.log("then", res);
            return resolve(res.data);
          });
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>


