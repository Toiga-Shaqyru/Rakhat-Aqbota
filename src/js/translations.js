export const translations = {
  kk: {
    inviteKicker: 'Үйлену тойына шақыру',
    openText: 'Құрметті қонақ, шақыруды ашып, той мәліметтерімен танысыңыз.',
    openButton: 'Ашу',

    heroSubtitle: 'Қуанышымыздың қадірлі қонағы болыңыз',
    dearGuestsTitle: 'Құрметті ағайын, құда, жекжат, дос-жарандар!',
    dearGuestsText: 'Сіздерді өміріміздегі ең маңызды күндердің бірі — үйлену тойымыздың қадірлі қонағы болуға шақырамыз.',

    dateTitle: 'Той күні',
    venueTitle: 'Мекенжай',
    dressCodeTitle: 'Dress code',
    dressCodeText: 'Ашық, жылы, мерекелік түстер құпталады.',
    closingText: 'Құрметпен,',

    contactButton: 'Байланысу',
    rsvpButton: 'Келемін!',
    rsvpTitle: 'Жауабыңыз',
    rsvpQuestion: 'Тойға келесіз бе?',

    countdownTitle: 'Тойдың басталуына дейін',
    countdownDays: 'Күн',
    countdownHours: 'Сағат',
    countdownMinutes: 'Минут',
    countdownSeconds: 'Секунд',

    eventPassed: 'Той өтті',
    eventToday: 'Той бүгін',
    daysLeft: 'Тойға {days} күн қалды',
    countdownFull: 'Тойдың басталуына {days} күн {hours} сағат {minutes} минут {seconds} секунд қалды'
  },

  ru: {
    inviteKicker: 'Приглашение на свадьбу',
    openText: 'Дорогой гость, откройте приглашение и ознакомьтесь с деталями торжества.',
    openButton: 'Открыть',

    heroSubtitle: 'Будем рады видеть вас на нашем торжестве',
    dearGuestsTitle: 'Дорогие гости!',
    dearGuestsText: 'Приглашаем вас стать почётными гостями одного из самых важных дней в нашей жизни — нашей свадьбы.',

    dateTitle: 'Дата свадьбы',
    venueTitle: 'Место проведения',
    dressCodeTitle: 'Dress code',
    dressCodeText: 'Приветствуются светлые, тёплые и праздничные оттенки.',
    closingText: 'С уважением,',

    contactButton: 'Связаться',
    rsvpButton: 'Приду!',
    rsvpTitle: 'Ваш ответ',
    rsvpQuestion: 'Вы придёте на свадьбу?',

    countdownTitle: 'До начала торжества',
    countdownDays: 'Дней',
    countdownHours: 'Часов',
    countdownMinutes: 'Минут',
    countdownSeconds: 'Секунд',

    eventPassed: 'Свадьба прошла',
    eventToday: 'Свадьба сегодня',
    daysLeft: 'До свадьбы {days} дн.',
    countdownFull: 'До начала торжества осталось: {days} дн. {hours} ч. {minutes} мин. {seconds} сек.'
  },

  en: {
    inviteKicker: 'Wedding invitation',
    openText: 'Dear guest, open the invitation and discover the wedding details.',
    openButton: 'Open',

    heroSubtitle: 'We would be honoured to celebrate this day with you',
    dearGuestsTitle: 'Dear guests!',
    dearGuestsText: 'We invite you to be our honoured guests on one of the most important days of our lives — our wedding day.',

    dateTitle: 'Wedding date',
    venueTitle: 'Venue',
    dressCodeTitle: 'Dress code',
    dressCodeText: 'Light, warm and festive colours are welcome.',
    closingText: 'With love,',

    contactButton: 'Contact',
    rsvpButton: 'I will attend',
    rsvpTitle: 'Your response',
    rsvpQuestion: 'Will you attend?',

    eventPassed: 'The wedding has passed',
    eventToday: 'The wedding is today',
    daysLeft: '{days} days left'
  }
};

export function normalizeLang(lang) {
  if (['kk', 'ru', 'en'].includes(lang)) {
    return lang;
  }

  return 'kk';
}

export function translate(lang, key, params = {}) {
  const normalizedLang = normalizeLang(lang);
  const dictionary = translations[normalizedLang] || translations.kk;
  let value = dictionary[key] || translations.kk[key] || key;

  Object.entries(params).forEach(([paramKey, paramValue]) => {
    value = value.replaceAll(`{${paramKey}}`, String(paramValue));
  });

  return value;
}
