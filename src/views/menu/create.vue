<template>
  <div class="menu-create">
    <!-- Card 组件 封装的子组件-->
    <create-edit></create-edit>
  </div>
</template>
<script>
import CreateEdit from './components/CreateEdit'
export default {
  name: 'create',
  components: {
    CreateEdit
  }
}
</script>

<style lang='scss' scoped>
</style>
