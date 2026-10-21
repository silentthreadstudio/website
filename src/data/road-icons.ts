// Line icons for "The road so far", one per stage. 24x24 grid, drawn with a stroke in currentColor.
// Each entry is the inner SVG markup; `thread` is the studio mark (a line ending in a weight).

export const ROAD_ICONS = {
  // First job: a terminal prompt.
  terminal: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M7 10l3 2-3 2M12.5 15H17"/>',
  // Media and radio apps: a signal going out.
  radio: '<circle cx="12" cy="12" r="1.6"/><path d="M8.6 8.6a4.8 4.8 0 0 0 0 6.8M15.4 8.6a4.8 4.8 0 0 1 0 6.8M5.8 5.8a8.8 8.8 0 0 0 0 12.4M18.2 5.8a8.8 8.8 0 0 1 0 12.4"/>',
  // A marketplace: a storefront with an awning.
  store: '<path d="M4.5 9.5L6 5h12l1.5 4.5M4 9.5h16M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M5.5 12v7h13v-7M10 19v-4h4v4"/>',
  // AI products: agents and models wired together.
  nodes: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><circle cx="12" cy="11" r="1.4"/><path d="M7.6 7.2l3.3 2.8M16.4 7.2l-3.3 2.8M12 12.4V16"/>',
  // Payments infrastructure: a card.
  card: '<rect x="3" y="6" width="18" height="12" rx="1.5"/><path d="M3 10h18M7 14.5h4"/>',
  // Guildhall: repositories as 3D worlds.
  cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9"/>',
  // Silent Thread: the mark.
  thread: '<path d="M12 2v14"/><circle cx="12" cy="18.5" r="2.5" fill="currentColor"/>',
} as const;

export type RoadIconName = keyof typeof ROAD_ICONS;
