const RETRO_FORMATS = {
  'went-well-improve': {
    label: 'Went Well / Improve / Actions',
    description: 'What went well, what to improve, and action items',
    columns: [
      { id: 'went-well', label: 'Went Well', emoji: '👍', color: 'bg-green-100',  border: 'border-green-600',  header: 'bg-green-600'  },
      { id: 'improve',   label: 'Improve',   emoji: '🔧', color: 'bg-orange-100', border: 'border-orange-600', header: 'bg-orange-600' },
      { id: 'actions',   label: 'Actions',   emoji: '📋', color: 'bg-blue-100',   border: 'border-blue-600',   header: 'bg-blue-600'   },
    ],
  },
  'start-stop-continue': {
    label: 'Start / Stop / Continue',
    description: 'Classic format: what to start, stop, and keep doing',
    columns: [
      { id: 'start',    label: 'Start',    emoji: '🚀', color: 'bg-green-100',  border: 'border-green-600', header: 'bg-green-600' },
      { id: 'stop',     label: 'Stop',     emoji: '🛑', color: 'bg-red-100',    border: 'border-red-600',   header: 'bg-red-600'   },
      { id: 'continue', label: 'Continue', emoji: '✅', color: 'bg-blue-100',   border: 'border-blue-600',  header: 'bg-blue-600'  },
    ],
  },
  '4ls': {
    label: '4Ls',
    description: 'Liked, Learned, Lacked, Longed For',
    columns: [
      { id: 'liked',      label: 'Liked',      emoji: '❤️',  color: 'bg-green-100',  border: 'border-green-600',  header: 'bg-green-600'  },
      { id: 'learned',    label: 'Learned',    emoji: '📚', color: 'bg-blue-100',   border: 'border-blue-600',   header: 'bg-blue-600'   },
      { id: 'lacked',     label: 'Lacked',     emoji: '⚠️',  color: 'bg-yellow-100', border: 'border-yellow-600', header: 'bg-yellow-600' },
      { id: 'longed-for', label: 'Longed For', emoji: '🌟', color: 'bg-purple-100', border: 'border-purple-600', header: 'bg-purple-600' },
    ],
  },
  'mad-sad-glad': {
    label: 'Mad / Sad / Glad',
    description: 'Emotion-based: what made you mad, sad, or glad',
    columns: [
      { id: 'mad',  label: 'Mad',  emoji: '😡', color: 'bg-red-100',    border: 'border-red-600',   header: 'bg-red-600'   },
      { id: 'sad',  label: 'Sad',  emoji: '😢', color: 'bg-blue-100',   border: 'border-blue-600',  header: 'bg-blue-600'  },
      { id: 'glad', label: 'Glad', emoji: '😊', color: 'bg-green-100',  border: 'border-green-600', header: 'bg-green-600' },
    ],
  },
};

const VALID_FORMAT_IDS = Object.keys(RETRO_FORMATS);

function getFormat(formatId) {
  return RETRO_FORMATS[formatId] || null;
}

function getColumns(formatId) {
  const fmt = RETRO_FORMATS[formatId];
  return fmt ? fmt.columns : [];
}

function isValidColumnId(formatId, columnId) {
  const cols = getColumns(formatId);
  return cols.some(c => c.id === columnId);
}

module.exports = { RETRO_FORMATS, VALID_FORMAT_IDS, getFormat, getColumns, isValidColumnId };
