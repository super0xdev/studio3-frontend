import { getEditorDefaults } from '@pqina/pintura';

export const EDITOR_CONFIG = getEditorDefaults({
  stickers: ['🚀', '😄', '👍', '👎', '🪙', '💰'],
  cropSelectPresetOptions: [
    [undefined, 'Custom'],
    [1, 'Square'],

    // shown when cropSelectPresetFilter is set to 'landscape'
    [2 / 1, '2:1'],
    [3 / 2, '3:2'],
    [4 / 3, '4:3'],
    [16 / 10, '16:10'],
    [16 / 9, '16:9'],

    // shown when cropSelectPresetFilter is set to 'portrait'
    [1 / 2, '1:2'],
    [2 / 3, '2:3'],
    [3 / 4, '3:4'],
    [10 / 16, '10:16'],
    [9 / 16, '9:16'],
  ],
});
