import { createStore, storeKey } from 'vuex'

export default createStore({
  state() {
    return {
      popular: [15, 30, 60, 600, 900, 1800],
      presets: [
        {
          isPreset: true,
          id: 1,
          seconds: 5,
        },
        {
          isPreset: true,
          id: 2,
          name: 'Squat',
          seconds: 5,
        },
      ],
      timers: [
        {
          id: 1,
          name: 'Crunches',
          seconds: 5,
          isActive: false,
          isDone: false,
          currentValue: 5,
        },
        {
          id: 2,
          name: 'Squat',
          seconds: 5,
          repeat: 2,
          isActive: false,
          isDone: false,
          currentValue: 5,
          repeatCounter: 1,
        },
      ],
      timerInEditor: null,
    }
  },
  getters: {
    activeTimer: (state) => {
      return state.timers.find((timer) => timer.isActive)
    },
    getTimerStatus: (state, getters) => (id) => {
      const { isActive, isDone } = getters.getTimerById(id)

      return { isActive, isDone }
    },
    getTimerById: (state) => (id) =>
      state.timers.find((timer) => timer.id === id),
    getPresetById: (state) => (id) =>
      state.presets.find((timer) => timer.id === id),
    getTimerProgress: (state, getters) => (id) => {
      const timer = getters.getTimerById(id)

      return (timer.currentValue / timer.seconds) * 100
    },
    timerFormattedValue: (state, getters) => (id) => {
      const timer = getters.getTimerById(id)

      return new Date(timer.currentValue * 1000).toISOString().slice(11, 19)
    },
    getNewTimerId: (state) => {
      const ids = state.timers.map((timer) => timer.id)
      const newId = Math.max(...ids) + 1

      return newId
    },
    getNewPresetId: (state) => {
      const ids = state.presets.map((preset) => preset.id)
      const newId = Math.max(...ids) + 1

      return newId
    },
    getNextTimer: (state, getters) => (id) => {
      const timer = getters.getTimerById(id)
      const index = state.timers.indexOf(timer)

      return state.timers[index + 1]
    },
    getRepeatStatus: (state, getters) => (id) => {
      const timer = getters.getTimerById(id)

      return timer.repeatCounter
    },
  },
  mutations: {
    addTimer(state, payload) {
      state.timers.push(payload.timer)
    },
    addPreset(state, payload) {
      state.presets.push(payload.timer)
    },
    toggleTimer(state, payload) {
      const timer = this.getters.getTimerById(payload.id)

      timer.isActive = !timer.isActive
    },
    tickTimer(state, payload) {
      const timer = this.getters.getTimerById(payload.id)

      timer.currentValue--
    },
    resetTimer(state, payload) {
      const timer = this.getters.getTimerById(payload.id)

      timer.currentValue = timer.seconds
      timer.isDone = false
    },
    deleteTimer(state, payload) {
      const timer = this.getters.getTimerById(payload.id)
      const index = state.timers.indexOf(timer)

      state.timers.splice(index, 1)
    },
    setDoneStatus(state, payload) {
      const timer = this.getters.getTimerById(payload.id)

      timer.isDone = payload.status
    },
    setTimerInEditor(state, payload) {
      const timer = payload.id ? this.getters.getTimerById(payload.id) : null

      state.timerInEditor = timer
    },
    removeTimerInEditor(state) {
      state.timerInEditor = null
    },
    updateTimer(state, payload) {
      const timer = this.getters.getTimerById(payload.timer.id)
      const index = state.timers.indexOf(timer)

      state.timers.splice(index, 1, payload.timer)
    },
    updateTimers(state, payload) {
      state.timers = payload.timers
    },
    increaseRepeatCounter(state, payload) {
      const timer = this.getters.getTimerById(payload.id)

      timer.repeatCounter++
    },
    resetRepeatCounter(state, payload) {
      const timer = this.getters.getTimerById(payload.id)

      timer.repeatCounter = 1
    },
  },
  actions: {},
  modules: {},
})
