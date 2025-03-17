<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { type ScratchCell } from '@/models/ScratchCell'
import { getGridState, setGridState, getScratchedState, setScratchedState, clearStates } from '@/composables/states'

const GRID_ROWS = 100
const GRID_COLS = 100
const JACKPOT_PRIZE_AMOUNT = 1
const CONSOLATION_PRIZE_AMOUNT = 100

const grid = ref<ScratchCell[][]>([])
const hasScratched = ref(false)

const initGrid = (): void => {
  const savedGrid = getGridState()
  hasScratched.value = getScratchedState()

  if (savedGrid) {
    grid.value = JSON.parse(savedGrid)
    return
  }

  grid.value = Array(GRID_ROWS).fill(null).map(() =>
    Array(GRID_COLS).fill(null).map(() => ({
      scratched: false,
      hasConsolation: false,
      hasJackpot: false
    }))
  )
  placePrizes();
  simulateScratches();
}

const scratchCell = (i: number, j: number): void => {
  if (hasScratched.value || grid.value[i][j].scratched) return
  grid.value[i][j].scratched = true

  hasScratched.value = true
  setScratchedState(true)
  setGridState(grid.value)
}

const placePrizes = (): void => {
  const positions = new Set<string>()
  const totalAmount = CONSOLATION_PRIZE_AMOUNT + JACKPOT_PRIZE_AMOUNT

  // Collect unique positions for prizes
  while (positions.size < totalAmount) {
    const x = Math.floor(Math.random() * GRID_ROWS)
    const y = Math.floor(Math.random() * GRID_COLS)
    positions.add(`${x},${y}`)
  }

  // Convert Set to array to pick a random jackpot position
  const positionsArray = Array.from(positions)
  const jackpotIndex = Math.floor(Math.random() * positionsArray.length)
  const jackpotPos = positionsArray[jackpotIndex]

  // Place prizes on the grid
  positions.forEach(pos => {
    const [x, y] = pos.split(',').map(Number)

    if (pos === jackpotPos) {
      grid.value[x][y].hasJackpot = true
    } else {
      grid.value[x][y].hasConsolation = true
    }
  })
}

const simulateScratches = (): void => {
  const maxAmount = 5000
  const count = Math.floor(Math.random() * maxAmount)
  const positions = new Set<string>()

  // Collect unique positions to scratch
  while (positions.size < count) {
    const x = Math.floor(Math.random() * GRID_ROWS)
    const y = Math.floor(Math.random() * GRID_COLS)
    positions.add(`${x},${y}`)
  }

  // Apply scratches
  positions.forEach(pos => {
    const [x, y] = pos.split(',').map(Number)
    grid.value[x][y].scratched = true
  })

  setGridState(grid.value)
}

const resetGrid = (): void => {
  clearStates()
  initGrid()
}

onMounted(initGrid)
</script>

<template>
  <div class="scratch-grid" :class="{ 'scratch-grid--has-scratched': hasScratched }">
    <div v-for="(row, i) in grid" :key="i" class="scratch-grid__row">
      <div v-for="(cell, j) in row" :key="j" class="scratch-grid__cell" :class="{
        'scratch-grid__cell--scratched': cell.scratched,
        'scratch-grid__cell--has-consolation': cell.hasConsolation && cell.scratched,
        'scratch-grid__cell--has-jackpot': cell.hasJackpot && cell.scratched
      }" @mousedown="scratchCell(i, j)"></div>
    </div>
    <button @click="resetGrid" class="scratch-grid__reset-button">Reset</button>
  </div>
</template>

<style scoped lang="scss">
.scratch-grid {
  $self: &;

  display: flex;
  gap: 2px;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
  margin-block-end: 200px;

  &__row {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 2px;
    height: 10px;
  }

  &__cell {
    display: flex;
    aspect-ratio: 1;
    background-color: $white;
    position: relative;
    cursor: pointer;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background-color: $gray;
      transition: opacity 2s ease;
    }

    &--scratched {
      &::before {
        opacity: 0;
      }
    }

    &--has-consolation {
      background-color: $pink;
    }

    &--has-jackpot {
      background-color: $gold;
    }
  }

  &__reset-button {
    margin-top: 20px;
    padding: 8px 16px;
    background-color: #ff4444;
    color: $white;
    border: none;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
      filter: brightness(85%);
    }
  }

  &--has-scratched {
    #{$self}__cell {
      cursor: not-allowed;
    }
  }
}
</style>
