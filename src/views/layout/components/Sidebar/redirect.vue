<script>
export default {
  created() {
    const { params, query } = this.$route
    const { path } = params
    this.$router.replace({ path: '/' + path, query })
  },
  mounted() {},
  render: function (h) {
    return h() // avoid warning message
  }
}
</script>
