<template>
  <div>
    <!--用来标记当前 -->
    <advert-public
      is-edit
      :id="id"
    ></advert-public>
 </div>
</template>

<script>
import advertPublic from './components/advertPublic'
export default {
  name: 'redactAdvertise',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    advertPublic
  },
  data () {
    return {
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
