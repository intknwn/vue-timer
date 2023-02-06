<script setup>
import { ref } from 'vue'
const timers = ref([
  {
    title: 'Crunches',
    duration: 300,
  },
  {
    title: 'Squat',
    duration: 500,
    repeat: 2,
  },
])
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="8">
        <v-row>
          <v-col cols="4"></v-col>
          <v-col cols="8">
            <v-row>
              <v-col cols="12" v-for="timer in timers" :key="timer.title">
                <v-card class="timer-card d-flex">
                  <div class="pa-5 d-flex flex-column align-center gap-2">
                    <v-progress-circular
                      :rotate="-90"
                      :size="100"
                      :width="15"
                      :value="10"
                      color="primary"
                      class="mb-2"
                    >
                      <v-btn elevation="0" icon x-large>
                        <v-icon dark> mdi-play </v-icon>
                      </v-btn>
                    </v-progress-circular>
                    <v-chip v-if="timer.repeat">{{ timer.repeat }}x</v-chip>
                  </div>
                  <div class="d-flex flex-column justify-space-between">
                    <v-card-title>{{ timer.title }}</v-card-title>
                    <v-card-subtitle>Здесь будет url</v-card-subtitle>

                    <v-card-actions>
                      <v-btn outlined>
                        <v-icon> mdi-pencil </v-icon>
                      </v-btn>
                      <v-btn outlined elevation="0">
                        <v-icon> mdi-delete </v-icon>
                      </v-btn>
                    </v-card-actions>
                  </div>
                </v-card>
              </v-col>
              <v-col>
                <v-btn class="w-100">
                  <v-icon> mdi-plus-circle </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss">
.timer-card {
  position: relative;

  &__edit-button {
    position: absolute;
    top: 20px;
    right: 20px;
  }
}
</style>
