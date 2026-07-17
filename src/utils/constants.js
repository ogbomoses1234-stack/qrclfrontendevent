export const categoryColor = (cat) => {
  const map = { delivery: 'emerald', reminder: 'amber', thanks: 'pink', custom: 'blue' };
  return map[cat] || 'gray';
};

export const categoryIcon = (cat) => {
  const map = { delivery: 'ticket-alt', reminder: 'clock', thanks: 'heart', custom: 'pencil-alt' };
  return map[cat] || 'file-alt';
};

export const categoryEmoji = (cat) => {
  const map = { delivery: '🎫', reminder: '⏰', thanks: '💌', custom: '📋' };
  return map[cat] || '📄';
};

export const statusColors = {
  delivered: 'bg-green-100 text-green-700',
  scheduled: 'bg-blue-100 text-blue-700',
  failed: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600',
};

export const defaultTemplates = [
  {
    id: 'tpl1', name: '🎫 Entry Pass Delivery', category: 'delivery', showQR: true,
    body: 'Hello *{{1}}* 👋\n\nHere is your official entry pass for *{{2}}* on *{{3}}*.\n\nPlease present the QR code below at the gate.\n\nSee you there!',
  },
  {
    id: 'tpl2', name: '⏰ Event Day Reminder', category: 'reminder', showQR: true,
    body: '⏰ Reminder, *{{1}}*!\n\n*{{2}}* starts today at *{{3}}*.\n📍 Venue: *{{4}}*\n\nHave your QR code ready for quick check-in!',
  },
  {
    id: 'tpl3', name: '💌 Post-Event Thanks', category: 'thanks', showQR: false,
    body: 'Thank you for attending *{{2}}*, *{{1}}*! 🎉\n\nWe hope you had a fantastic experience. Please check your email for a feedback form.\n\nSee you at the next event!',
  },
  {
    id: 'tpl4', name: '📋 Custom Message', category: 'custom', showQR: true,
    body: 'Hi {{1}}, your pass for {{2}} on {{3}} is attached.',
  },
];

export const mappingFields = ['phone', 'name', 'event', 'qr', 'date'];

export const speedOptions = [
  { value: 3, label: 'Slow (3/sec)' },
  { value: 8, label: 'Smart (8/sec)' },
  { value: 12, label: 'Fast (12/sec)' },
];

export const waitUnitOptions = [
  { value: 'seconds', label: 'Seconds' },
  { value: 'minutes', label: 'Minutes' },
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
];

export const MAX_BATCH_SIZE = 500;
export const TOAST_DURATION = 3500;