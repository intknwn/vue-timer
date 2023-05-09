<script setup>
import { ref, reactive, computed, defineProps } from 'vue'
import { useStore } from 'vuex'
import { delay, prepareTimer, formatPresetValue } from '@/utils'
import useDialog from '../composables/dialog'
const store = useStore()
const props = defineProps({
  type: {
    type: String,
    default: 'timer',
  },
})

const timerInEditor = computed(() => store.state.timerInEditor)
const selected = ref(null)
const popular = computed(() => store.state.popular)
const { isDialogOpen } = useDialog(timerInEditor)

const fields = reactive({
  name: null,
  hours: null,
  minutes: null,
  seconds: null,
  repeat: null,
})

const parsed = computed(() => {
  if (!timerInEditor.value && !selected.value) return fields

  const totalSeconds = selected.value || timerInEditor.value?.seconds

  return {
    name: fields.name || timerInEditor.value?.name,
    hours: fields.hours || Math.floor(totalSeconds / 3600),
    minutes: fields.minutes || Math.floor(totalSeconds / 60),
    seconds: fields.seconds || totalSeconds % 60,
    repeat: fields.repeat || timerInEditor.value?.repeat,
  }
})

const timer = reactive({
  name: computed({
    get() {
      return parsed.value.name
    },
    set(name) {
      fields.name = name
    },
  }),
  hours: computed({
    get() {
      return parsed.value.hours
    },
    set(hours) {
      fields.hours = hours
    },
  }),
  minutes: computed({
    get() {
      return parsed.value.minutes
    },
    set(minutes) {
      fields.minutes = minutes
    },
  }),
  seconds: computed({
    get() {
      return parsed.value.seconds
    },
    set(seconds) {
      fields.seconds = seconds
    },
  }),
  repeat: computed({
    get() {
      return parsed.value.repeat
    },
    set(times) {
      fields.repeat = times
    },
  }),
})

const selectPopularValue = (value) => {
  fields.name = null
  fields.hours = null
  fields.minutes = null
  fields.seconds = null

  selected.value = value
}

const resetFields = () => {
  Object.keys(fields).forEach((key) => {
    fields[key] = null
  })
}

const generateItems = (amount) =>
  new Array(amount).fill(null).map((_, index) => index)

const updateExistingTimer = (timer) => {
  const payload = {
    timer: {
      ...timerInEditor.value,
      ...prepareTimer(timer, timerInEditor.value.id),
    },
  }
  console.log(payload)
  store.commit('updateTimer', payload)
}

const handleAddButtonClick = async () => {
  if (timerInEditor.value) {
    updateExistingTimer(timer)
    store.commit('removeTimerInEditor')
  } else {
    const id =
      props.type === 'timer'
        ? store.getters.getNewTimerId
        : store.getters.getNewPresetId
    const prepared = prepareTimer(timer, id)
    props.type === 'timer'
      ? store.commit('addTimer', { timer: prepared })
      : store.commit('addPreset', { timer: prepared })
  }

  isDialogOpen.value = false
  await delay(1000)
  resetFields()
}

const handleCloseButtonClick = async () => {
  if (timerInEditor.value) {
    store.commit('removeTimerInEditor')
    return
  }

  isDialogOpen.value = false
  await delay(1000)
  resetFields()
}
</script>

<template>
  <v-row justify="center">
    <v-dialog
      v-model="isDialogOpen"
      persistent
      max-width="600px"
      open-on-click
      @keydown.esc="handleCloseButtonClick"
    >
      <template v-slot:activator="{ props: slotProps }">
        <v-btn color="primary" dark v-bind="slotProps" append-icon="mdi-plus">
          {{ props.type === 'timer' ? 'Add Timer' : 'Add Preset' }}
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{
            props.type === 'timer' ? 'Add Timer' : 'Add Preset'
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Name (optional)"
                  v-model="timer.name"
                ></v-text-field>
              </v-col>

              <v-col cols="3">
                <v-combobox
                  label="Hours"
                  persistent-hint
                  :items="generateItems(24)"
                  v-model="timer.hours"
                ></v-combobox>
              </v-col>

              <v-col cols="3">
                <v-combobox
                  label="Minutes"
                  :items="generateItems(60)"
                  v-model="timer.minutes"
                ></v-combobox>
              </v-col>

              <v-col cols="3">
                <v-combobox
                  label="Seconds"
                  :items="generateItems(60)"
                  v-model="timer.seconds"
                ></v-combobox>
              </v-col>

              <v-col cols="3">
                <v-combobox
                  label="Repeat"
                  :items="generateItems(10)"
                  v-model="timer.repeat"
                ></v-combobox>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="d-flex gap-2">
                <v-chip
                  link
                  v-for="value in popular"
                  :key="value"
                  @click="selectPopularValue(value)"
                >
                  {{ formatPresetValue(value) }}
                </v-chip>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="handleCloseButtonClick">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="handleAddButtonClick">
            {{ timerInEditor ? 'Save' : 'Add' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style>
.d-flex {
  display: flex;
  gap: 6px;
}
</style>
