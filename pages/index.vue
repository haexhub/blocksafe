<template>
  <div>
    <ip-fs />

    <!-- <button @click="addFile">Create Node</button> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { dispatch } from "vuex-pathify"

export default Vue.extend({
  name: 'IndexPage',

  methods: {
    async createNode () {
      //await dispatch("web3/createNode")
      await dispatch("web3/addFile", "hjuhuhu")
    },

  /*   async addFile () {
      try { 
        const node = await this.$ipfs({ silent: true})
        const { cid } = await node.add('Hello world')
  console.info(cid)
      } catch (error) {
        console.log(error)
      }
    }, */
  }
})
</script>
