<template>
  <div>
    <h2>Learn Meteor!</h2>
    
  </div>
</template>

<script>
import Students from '../../api/collections/Students'

export default {
  data() {
    return {
      title: "",
      url: "",
    }
  },
  meteor: {
    $subscribe: {
      'students': [],
    },
    students () {
      return Students.find({})
    },
  },
  methods: {
    
  },
}
</script>

<style scoped>
  ul {
    font-family: monospace;
  }
</style>
