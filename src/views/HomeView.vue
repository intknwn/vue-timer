<template>
  <Main />
</template>

<script>
import { defineComponent } from 'vue'
import Main from '@/components/MainScreen.vue'

export default defineComponent({
  name: 'HomeView',

  components: {
    Main,
  },
})
</script>
