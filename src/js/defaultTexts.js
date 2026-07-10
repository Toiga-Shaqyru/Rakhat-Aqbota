export const defaultInviteTexts = {
  kk: {
    heroSubtitle: 'Қуанышымызға ортақ болыңыздар',
    dearGuestsText: 'Сіздерді Рахат пен Ақботаның үйлену тойына шақырамыз! Қуанышымызға ортақ болып, қадірлі қонағымыз болыңыздар.',
    dressCodeText: 'Ашық, жылы, мерекелік түстер құпталады.'
  },

  ru: {
    heroSubtitle: 'Будем рады разделить этот день вместе с вами',
    dearGuestsText: 'Приглашаем вас на торжество, посвящённое бракосочетанию Рахата и Ақботы. Будем рады разделить этот особенный день вместе с вами!',
    dressCodeText: 'Приветствуются светлые, тёплые и праздничные оттенки.'
  },

  en: {
    heroSubtitle: 'We would be honoured to celebrate this day with you',
    dearGuestsText: 'We invite you to be our honoured guests on one of the most important days of our lives — our wedding day.',
    dressCodeText: 'Light, warm and festive colours are welcome.'
  }
};

export function cloneDefaultInviteTexts() {
  return JSON.parse(JSON.stringify(defaultInviteTexts));
}
