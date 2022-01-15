<template>
  <div>
    <ip-fs />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import IpFs from '../components/IpFs.vue'

export default Vue.extend({
  components: { IpFs },
  name: 'IndexPage'
})
</script>
