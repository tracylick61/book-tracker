export const READING_GOAL_KEY = 'book-tracker-reading-goal'
export const DEFAULT_READING_GOAL = 12

export const isValidReadingGoal = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value > 0

export function loadReadingGoal(): number {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(READING_GOAL_KEY) ?? 'null')
    return isValidReadingGoal(saved) ? saved : DEFAULT_READING_GOAL
  } catch {
    return DEFAULT_READING_GOAL
  }
}
export function saveReadingGoal(value: number): boolean {
  if (!isValidReadingGoal(value)) return false
  try {
    localStorage.setItem(READING_GOAL_KEY, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
export function readingGoalProgress(read: number, target: number): number {
  if (!Number.isFinite(read) || read < 0 || !isValidReadingGoal(target)) return 0
  return Math.min(100, Math.max(0, Math.round(read / target * 100)))
}
