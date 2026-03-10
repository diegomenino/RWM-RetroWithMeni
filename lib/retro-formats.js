const RETRO_FORMATS = {
  'start-stop-continue': {
    label: 'Start / Stop / Continue',
    description: 'Classic format: what to start, stop, and keep doing',
    columns: [
      { id: 'start',    label: 'Start',    emoji: '🚀', color: 'bg-green-50',  border: 'border-green-400', header: 'bg-green-400' },
      { id: 'stop',     label: 'Stop',     emoji: '🛑', color: 'bg-red-50',    border: 'border-red-400',   header: 'bg-red-400'   },
      { id: 'continue', label: 'Continue', emoji: '✅', color: 'bg-blue-50',   border: 'border-blue-400',  header: 'bg-blue-400'  },
    ],
  },
  '4ls': {
    label: '4Ls',
    description: 'Liked, Learned, Lacked, Longed For',
    columns: [
      { id: 'liked',      label: 'Liked',      emoji: '❤️',  color: 'bg-green-50',  border: 'border-green-400',  header: 'bg-green-400'  },
      { id: 'learned',    label: 'Learned',    emoji: '📚', color: 'bg-blue-50',   border: 'border-blue-400',   header: 'bg-blue-400'   },
      { id: 'lacked',     label: 'Lacked',     emoji: '⚠️',  color: 'bg-yellow-50', border: 'border-yellow-400', header: 'bg-yellow-400' },
      { id: 'longed-for', label: 'Longed For', emoji: '🌟', color: 'bg-purple-50', border: 'border-purple-400', header: 'bg-purple-400' },
    ],
  },
  'mad-sad-glad': {
    label: 'Mad / Sad / Glad',
    description: 'Emotion-based: what made you mad, sad, or glad',
    columns: [
      { id: 'mad',  label: 'Mad',  emoji: '😡', color: 'bg-red-50',    border: 'border-red-400',   header: 'bg-red-400'   },
      { id: 'sad',  label: 'Sad',  emoji: '😢', color: 'bg-blue-50',   border: 'border-blue-400',  header: 'bg-blue-400'  },
      { id: 'glad', label: 'Glad', emoji: '😊', color: 'bg-green-50',  border: 'border-green-400', header: 'bg-green-400' },
    ],
  },
  'went-well-improve': {
    label: 'Went Well / Improve / Actions',
    description: 'What went well, what to improve, and action items',
    columns: [
      { id: 'went-well', label: 'Went Well', emoji: '👍', color: 'bg-green-50',  border: 'border-green-400',  header: 'bg-green-400'  },
      { id: 'improve',   label: 'Improve',   emoji: '🔧', color: 'bg-orange-50', border: 'border-orange-400', header: 'bg-orange-400' },
      { id: 'actions',   label: 'Actions',   emoji: '📋', color: 'bg-blue-50',   border: 'border-blue-400',   header: 'bg-blue-400'   },
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
