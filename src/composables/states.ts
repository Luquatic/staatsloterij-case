import { type ScratchCell } from '@/models/ScratchCell'

export const getGridState = (): string | null => {
  return localStorage.getItem('scratchGrid')
}

export const setGridState = (grid: ScratchCell[][]) => {
  localStorage.setItem('scratchGrid', JSON.stringify(grid))
}

export const getScratchedState = (): boolean => {
  return JSON.parse(localStorage.getItem('hasScratched') || 'false')
}

export const setScratchedState = (scratched: boolean) => {
  localStorage.setItem('hasScratched', JSON.stringify(scratched))
}

export const clearStates = () => {
  localStorage.clear()
}
