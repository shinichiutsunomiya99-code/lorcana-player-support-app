export const COLORS = {
  RUBY: 'RUBY',
  SAPPHIRE: 'SAPPHIRE',
  EMERALD: 'EMERALD',
  AMBER: 'AMBER',
  AMETHYST: 'AMETHYST',
  STEEL: 'STEEL',
  UNKNOWN: 'UNKNOWN'
};

export const COLOR_UI = {
  [COLORS.RUBY]: { label: 'Ruby', icon: '🟥', css: 'var(--ruby)', inkClass: 'ink-ruby' },
  [COLORS.SAPPHIRE]: { label: 'Sapphire', icon: '🟦', css: 'var(--sapphire)', inkClass: 'ink-sapphire' },
  [COLORS.EMERALD]: { label: 'Emerald', icon: '🟩', css: 'var(--emerald)', inkClass: 'ink-emerald' },
  [COLORS.AMBER]: { label: 'Amber', icon: '🟨', css: 'var(--amber)', inkClass: 'ink-amber' },
  [COLORS.AMETHYST]: { label: 'Amethyst', icon: '🟪', css: 'var(--amethyst)', inkClass: 'ink-amethyst' },
  [COLORS.STEEL]: { label: 'Steel', icon: '⬜', css: 'var(--steel)', inkClass: 'ink-steel' },
  [COLORS.UNKNOWN]: { label: 'Unknown', icon: '❓', css: 'var(--unknown)', inkClass: 'ink-unknown' }
};

export const RESULTS = {
  WIN: 'WIN',
  LOSE: 'LOSE',
  DRAW: 'DRAW'
};

export const PLAY_ORDER = {
  FIRST: 'FIRST',
  SECOND: 'SECOND',
  UNKNOWN: 'UNKNOWN'
};

export const NOTE_SCOPE = {
  GLOBAL: 'GLOBAL',
  DECK_SPECIFIC: 'DECK_SPECIFIC'
};
