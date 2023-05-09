<script setup>
import draggable from 'vuedraggable'
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import AddTimerDialog from './AddTimerDialog.vue'
import { prepareTimer, formatPresetValue } from '@/utils'

const store = useStore()

const timers = computed({
  get() {
    return store.state.timers
  },
  set(raw) {
    console.log(raw)
    const timers = raw.reduce((acc, timer) => {
      if (timer.isPreset) {
        const prepared = prepareTimer(timer, store.getters.getNewId)
        acc.push(prepared)
        return acc
      }

      acc.push(timer)

      return acc
    }, [])

    console.log(timers)

    store.commit('updateTimers', { timers })
  },
})
const presets = computed({
  get() {
    return store.state.presets
  },
  set() {},
})
const activeTimer = computed(() => store.getters.activeTimer)

let timerId = ref(null)

const toggleTimer = (id) => {
  const timer = store.getters.getTimerById(id)

  if (timer.currentValue === 0) {
    resetTimer(id)
    store.commit('resetRepeatCounter', { id })
  }

  if (activeTimer.value && activeTimer.value.id !== id) {
    clearInterval(timerId.value)
    resetTimer(activeTimer.value.id)
    store.commit('toggleTimer', { id: activeTimer.value.id })
    store.commit('toggleTimer', { id })
    timerId.value = setInterval(() => tick(id), 1000)
    return
  }

  if (activeTimer.value && activeTimer.value.id === id) {
    clearInterval(timerId.value)
    store.commit('toggleTimer', { id })
    return
  }

  store.commit('toggleTimer', { id })
  timerId.value = setInterval(() => tick(id), 1000)
}

const clearTimer = (id) => {
  clearInterval(id)
  timerId.value = null
}

const tick = (id) => {
  store.commit('tickTimer', { id })
}

const getBorderClass = (id) => {
  return activeTimer.value?.id === id ? 'active' : false
}

const resetTimer = (id) => {
  store.commit('resetTimer', { id })
}

const deleteTimer = (id) => {
  store.commit('deleteTimer', { id })
}

const setTimerInEditor = (id) => {
  const timer = store.getters.getTimerById(id)

  store.commit('setTimerInEditor', { id })
}

watch(
  () => activeTimer.value && activeTimer.value.currentValue,
  (currentValue) => {
    if (currentValue === 0) {
      if (
        activeTimer.value.repeat &&
        activeTimer.value.repeatCounter !== activeTimer.value.repeat
      ) {
        resetTimer(activeTimer.value.id)
        store.commit('increaseRepeatCounter', { id: activeTimer.value.id })
        return
      }

      const nextTimer = store.getters.getNextTimer(activeTimer.value.id)
      store.commit('setDoneStatus', { id: activeTimer.value.id, status: true })
      store.commit('toggleTimer', { id: activeTimer.value.id })
      clearTimer(timerId.value)

      if (nextTimer) {
        toggleTimer(nextTimer.id)
      }
    }
  }
)

const getTimerProgress = (id) => store.getters.getTimerProgress(id)
const getTimerStatusIcon = (id) => {
  const { isActive, isDone } = store.getters.getTimerStatus(id)

  if (!isActive && isDone) return 'mdi-restart'

  return isActive ? 'mdi-pause' : 'mdi-play'
}
const getTimerFormattedValue = (id) => store.getters.timerFormattedValue(id)

const getTimerRepeatStatus = (id) => {
  const { repeat, repeatCounter, isActive } = store.getters.getTimerById(id)

  return isActive ? `${repeatCounter}/${repeat}` : `${repeat}x`
}
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="8">
        <v-row>
          <v-col cols="4">
            <draggable
              v-model="presets"
              item-key="id"
              :group="{ name: 'timers', pull: true, put: false }"
            >
              <template #item="{ element: preset }">
                <v-card>
                  <v-card-title>{{
                    formatPresetValue(preset.seconds)
                  }}</v-card-title>
                  <v-card-subtitle>{{ preset.name }}</v-card-subtitle>
                </v-card>
              </template>
            </draggable>
            <v-col>
              <AddTimerDialog type="preset" />
            </v-col>
          </v-col>
          <v-col cols="8">
            <v-row>
              <v-col cols="12">
                <draggable v-model="timers" item-key="id" group="timers">
                  <template #item="{ element: timer }">
                    <v-card
                      class="timer-card d-flex"
                      :class="getBorderClass(timer.id)"
                    >
                      <div class="pa-5 d-flex flex-column align-center gap-2">
                        <v-progress-circular
                          :size="100"
                          :width="15"
                          :model-value="getTimerProgress(timer.id)"
                          color="primary"
                          class="mb-2"
                        >
                          <v-btn
                            elevation="0"
                            icon
                            x-large
                            @click="toggleTimer(timer.id)"
                          >
                            <v-icon dark>
                              {{ getTimerStatusIcon(timer.id) }}
                            </v-icon>
                          </v-btn>
                        </v-progress-circular>
                        <v-chip v-if="timer.repeat">{{
                          getTimerRepeatStatus(timer.id)
                        }}</v-chip>
                        <v-card-text>
                          {{ getTimerFormattedValue(timer.id) }}
                        </v-card-text>
                      </div>
                      <div class="d-flex flex-column justify-space-between">
                        <v-card-actions>
                          <v-btn outlined @click="setTimerInEditor(timer.id)">
                            <v-icon> mdi-pencil </v-icon>
                          </v-btn>
                          <v-btn
                            outlined
                            elevation="0"
                            @click="deleteTimer(timer.id)"
                          >
                            <v-icon> mdi-delete </v-icon>
                          </v-btn>
                        </v-card-actions>

                        <v-card-title>{{ timer.name }}</v-card-title>
                        <v-card-subtitle>Здесь будет url</v-card-subtitle>
                        <v-card-actions>
                          <v-btn
                            v-if="timer.isActive || timer.isDone"
                            outlined
                            @click="resetTimer(timer.id)"
                          >
                            <v-icon> mdi-restart </v-icon>
                          </v-btn>
                        </v-card-actions>
                      </div>
                    </v-card>
                  </template>
                </draggable>
              </v-col>
              <v-col>
                <AddTimerDialog />
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

  &.border-active {
    border: 1px solid red;
  }

  &.active {
    // box-shadow: 0px 2px 1px -1px rgb(var(--v-theme-primary)),
    //   0px 1px 1px 0px rgb(var(--v-theme-primary)),
    //   0px 1px 3px 0px rgb(var(--v-theme-primary));
  }

  &__edit-button {
    position: absolute;
    top: 20px;
    right: 20px;
  }
}
</style>
