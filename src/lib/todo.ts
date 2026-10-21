/** A value the owner hasn't filled in yet: a string that starts with "TODO". */
export const isTodo = (v: unknown): v is string => typeof v === 'string' && v.trim().toUpperCase().startsWith('TODO');
