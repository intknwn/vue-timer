<template>
  <v-app>
    <v-app-bar absolute color="white" elevate-on-scroll>
      <v-toolbar-title>VueTimer</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    //
  }),
}
</script>
