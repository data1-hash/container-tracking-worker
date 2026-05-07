export function cx(...classes: Array<string | false | undefined>) { return classes.filter(Boolean).join(' '); }
export function formatDate(value?: string) { return value ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value)) : '—'; }
