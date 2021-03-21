<template>
  <div>
    <create-or-edit isedit :course-id="courseId"></create-or-edit>
 </div>
</template>

<script>
import CreateOrEdit from './components/CreateOrEdit'
export default {
  components: {
    CreateOrEdit
  },
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
