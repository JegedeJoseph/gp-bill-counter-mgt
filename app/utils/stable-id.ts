/**
 * Generate a stable ID based on a prefix and a value
 * This ensures IDs are consistent between server and client
 */
export function getStableId(prefix: string, value: string | number): string {
  return `${prefix}-${value}`;
}

/**
 * Generate a stable ID for a list item
 */
export function getListItemId(listName: string, index: number): string {
  return `${listName}-item-${index}`;
}