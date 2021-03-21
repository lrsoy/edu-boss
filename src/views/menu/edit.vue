<template>
  <div class="menu-edit">
      <create-edit :isEdit="true"></create-edit>
  </div>
</template>

<script>
import CreateEdit from './components/CreateEdit'
export default {
  name: 'edit',
  data () {
    return {
    }
  },
  components: {
    CreateEdit
  }
}
</script>

<style lang='scss' scoped>
</style>
