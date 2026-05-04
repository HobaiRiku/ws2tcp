export function eventValue(event: Event): string {
  return String((event.target as { value?: string }).value ?? '')
}

export function eventNumber(event: Event): number {
  const value = Number(eventValue(event))
  return Number.isFinite(value) ? value : 0
}

export function eventChecked(event: Event): boolean {
  return Boolean((event.target as { checked?: boolean }).checked)
}
