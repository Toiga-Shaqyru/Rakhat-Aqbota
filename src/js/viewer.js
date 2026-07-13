import { translate, normalizeLang } from './translations.js';
import { cloneDefaultInviteTexts, defaultInviteTexts } from './defaultTexts.js';
import Alpine from 'alpinejs';
import { initReveal } from './reveal.js';

import '../css/base.css';
import '../css/themes.css';
import '../css/motion.css';
import '../css/viewer.css';

window.Alpine = Alpine;

const defaultInviteData = {
  theme: 'qazaq-gold',
  groom: 'Рахат',
  bride: 'Ақбота',
  date: '2026-08-17',
  time: '17:00',
  venue: 'Sanzhar Grand Ballroom',
  city: 'Алматы',
  address: 'Атагельды Исмаилова, 29а',
  map2gis: 'https://go.2gis.com/jeKRX',
  mapGoogle: '',
  lang: 'kk',
  texts: cloneDefaultInviteTexts(),
  musicId: 'rahat-akbota',
  openingId: 'romantic-floral',
  contactType: 'whatsapp',
  contactValue: '',
  rsvpUrl: 'https://tally.so/r/9q5zk5',
  blocks: {
    map: true,
    countdown: true,
    dressCode: false,
    rsvp: true
  }
};

function loadInviteData() {
  return structuredClone(defaultInviteData);
}

const assetUrl = (path) => {
  const normalizedPath = String(path).replace(/^\/+/, '');
  return `${import.meta.env.BASE_URL}${normalizedPath}`;
};

document.addEventListener('alpine:init', () => {
  Alpine.data('inviteViewer', () => ({
    previewMode: false,
    inviteOpened: false,
    showScrollHint: false,
    scrollHintTimer: null,
    openingAnimating: false,
    openingPhase: 'idle',
    isMusicPlaying: false,
    countdownTick: Date.now(),
    inviteData: loadInviteData(),

    loadDraftFromStorage() {
      // demo mode must not read saved builder draft
      if (new URLSearchParams(window.location.search).has('demo')) {
        return;
      }

      try {
        const rawDraft = localStorage.getItem('inviteBuilder:lastDraft');

        if (!rawDraft) {
          return;
        }

        const draft = JSON.parse(rawDraft);

        if (draft && typeof draft === 'object') {
          this.inviteData = {
            ...this.inviteData,
            ...draft,
            blocks: {
              ...this.inviteData.blocks,
              ...(draft.blocks || {})
            }
          };
        }
      } catch (error) {
        console.warn('Failed to load invite draft from localStorage', error);
      }
    },

    loadDraftFromUrlOrStorage() {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlDraft = params.get('draft');

        let draft = null;

        if (urlDraft) {
          draft = JSON.parse(urlDraft);
          localStorage.setItem('inviteBuilder:lastDraft', JSON.stringify(draft));
        } else {
          const rawDraft = localStorage.getItem('inviteBuilder:lastDraft');
          if (rawDraft) {
            draft = JSON.parse(rawDraft);
          }
        }

        if (draft && typeof draft === 'object') {
          this.inviteData = {
            ...this.inviteData,
            ...draft,
            blocks: {
              ...this.inviteData.blocks,
              ...(draft.blocks || {})
            },
            texts: {
              ...(this.inviteData.texts || {}),
              ...(draft.texts || {})
            }
          };
        }
      } catch (error) {
        console.warn('Failed to load invite draft', error);
      }
    },

    applyLangFromUrl() {
      const lang = new URLSearchParams(window.location.search).get('lang');

      if (['kk', 'ru'].includes(lang)) {
        this.inviteData.lang = lang;
      }
    },

    init() {
      // Standalone invite: clear stale builder draft
      try {
        localStorage.removeItem('inviteBuilder:lastDraft');
      } catch (error) {
        console.warn('Could not clear stale invite draft', error);
      }

      this.inviteData = loadInviteData();
      this.applyLangFromUrl();

      // BEGIN SCROLL INDICATOR LISTENER
      window.addEventListener(
        'scroll',
        () => {
          if (
            this.showScrollHint &&
            window.scrollY > 48
          ) {
            this.hideScrollIndicator();
          }
        },
        { passive: true }
      );
      // END SCROLL INDICATOR LISTENER

      window.setInterval(() => {
        this.countdownTick = Date.now();
      }, 1000);

      this.$nextTick(() => {
        initReveal(this.$root);
      });
    },

    get openingConfig() {
      const openings = {
        'romantic-floral': {
          webmSrc: assetUrl('assets/openings/romantic-floral/hero.webm'),
          mp4Src: assetUrl('assets/openings/romantic-floral/hero.mp4'),
          posterSrc: assetUrl('assets/openings/romantic-floral/poster.webp')
        },
        'classic-card': null
      };

      return openings[this.inviteData.openingId] || null;
    },

    get hasOpeningVideo() {
      return Boolean(this.openingConfig?.webmSrc || this.openingConfig?.mp4Src);
    },

    get openingVideoWebmSrc() {
      return this.openingConfig?.webmSrc || '';
    },

    get openingVideoMp4Src() {
      return this.openingConfig?.mp4Src || '';
    },

    get openingPosterSrc() {
      return this.openingConfig?.posterSrc || '';
    },

    get musicSrc() {
      const sources = {
        'rahat-akbota': assetUrl('assets/music/rahat-akbota.mp3')
      };

      return sources[this.inviteData.musicId] || '';
    },

    setLang(lang) {
      if (!['kk', 'ru'].includes(lang)) {
        return;
      }

      this.inviteData.lang = lang;
    },

          t(key, params = {}) {
        return translate(this.inviteData.lang, key, params);
      },

      inviteText(key) {
        const lang = this.inviteData.lang || 'kk';
        const customText = this.inviteData.texts?.[lang]?.[key];

        if (typeof customText === 'string' && customText.trim()) {
          return customText;
        }

        return defaultInviteTexts[lang]?.[key] || this.t(key);
      },

    get eventDate() {
      return new Date(`${this.inviteData.date}T${this.inviteData.time || '00:00'}:00+05:00`);
    },

    get dateDay() {
      if (Number.isNaN(this.eventDate.getTime())) return '—';

      return new Intl.DateTimeFormat('ru-RU', { day: '2-digit' }).format(this.eventDate);
    },

    get dateMonth() {
      if (Number.isNaN(this.eventDate.getTime())) {
        return '';
      }

      const lang = normalizeLang(this.inviteData.lang);
      const monthIndex = this.eventDate.getMonth();
      const year = this.eventDate.getFullYear();

      const months = {
        kk: [
          'қаңтар',
          'ақпан',
          'наурыз',
          'сәуір',
          'мамыр',
          'маусым',
          'шілде',
          'тамыз',
          'қыркүйек',
          'қазан',
          'қараша',
          'желтоқсан'
        ],
        ru: [
          'января',
          'февраля',
          'марта',
          'апреля',
          'мая',
          'июня',
          'июля',
          'августа',
          'сентября',
          'октября',
          'ноября',
          'декабря'
        ]
      };

      if (lang === 'kk') {
        return `${months.kk[monthIndex]} ${year} ж.`;
      }

      return `${months.ru[monthIndex]} ${year} г.`;
    },

    get localizedAddress() {
      if (this.inviteData.lang === 'ru') {
        return 'г. Алматы, ул. Атагельды Исмаилова, 29а';
      }

      return 'Алматы қаласы, Атагельды Исмаилова көшесі, 29а';
    },

    get countdownParts() {
      if (Number.isNaN(this.eventDate.getTime())) {
        return {
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00'
        };
      }

      const difference = Math.max(
        this.eventDate.getTime() - this.countdownTick,
        0
      );

      return {
        days: String(
          Math.floor(difference / 86_400_000)
        ).padStart(2, '0'),

        hours: String(
          Math.floor((difference / 3_600_000) % 24)
        ).padStart(2, '0'),

        minutes: String(
          Math.floor((difference / 60_000) % 60)
        ).padStart(2, '0'),

        seconds: String(
          Math.floor((difference / 1000) % 60)
        ).padStart(2, '0')
      };
    },

    get countdownText() {
      if (Number.isNaN(this.eventDate.getTime())) {
        return '';
      }

      const difference = this.eventDate.getTime() - this.countdownTick;

      if (difference <= 0) {
        return this.t('eventPassed');
      }

      const days = Math.floor(difference / 86_400_000);
      const hours = Math.floor((difference / 3_600_000) % 24);
      const minutes = Math.floor((difference / 60_000) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return this.t('countdownFull', {
        days,
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      });
    },

    get contactHref() {
      const value = String(this.inviteData.contactValue || '').trim();

      if (!value) return '#';

      if (this.inviteData.contactType === 'telegram') {
        const username = value.replace('@', '');
        return `https://t.me/${username}`;
      }

      const phone = value.replace(/[^\d]/g, '');
      return `https://wa.me/${phone}`;
    },

    openRsvp() {
      const baseUrl = String(this.inviteData.rsvpUrl || '').trim();

      if (!baseUrl) {
        return;
      }

      // В сайте используется kk, а старая логика Tally ожидает kz.
      const tallyLang = this.inviteData.lang === 'ru' ? 'ru' : 'kz';
      const separator = baseUrl.includes('?') ? '&' : '?';
      const url = `${baseUrl}${separator}lang=${encodeURIComponent(tallyLang)}`;

      window.open(url, '_blank', 'noopener,noreferrer');
    },

    async tryPlayMusic() {
      const audio = this.$refs.bgMusic;

      if (!audio || !this.musicSrc || this.inviteData.musicId === 'none') {
        return;
      }

      try {
        audio.volume = 0.65;
        await audio.play();
        this.isMusicPlaying = true;
      } catch (error) {
        this.isMusicPlaying = false;
        console.warn('Music playback was blocked or failed:', error);
      }
    },

    toggleMusic() {
      const audio = this.$refs.bgMusic;

      if (!audio || !this.musicSrc) {
        return;
      }

      if (audio.paused) {
        void this.tryPlayMusic();
        return;
      }

      audio.pause();
      this.isMusicPlaying = false;
    },

    // BEGIN SCROLL INDICATOR METHODS

    showScrollIndicator() {
      if (this.scrollHintTimer) {
        window.clearTimeout(this.scrollHintTimer);
      }

      this.showScrollHint = true;

      this.scrollHintTimer = window.setTimeout(() => {
        this.showScrollHint = false;
        this.scrollHintTimer = null;
      }, 8000);
    },

    hideScrollIndicator() {
      this.showScrollHint = false;

      if (this.scrollHintTimer) {
        window.clearTimeout(this.scrollHintTimer);
        this.scrollHintTimer = null;
      }
    },

    scrollToContent() {
      this.hideScrollIndicator();

      window.scrollBy({
        top: Math.max(window.innerHeight * 0.72, 420),
        behavior: 'smooth'
      });
    },

    // END SCROLL INDICATOR METHODS

    openInvite() {
      const openingVideo = this.$refs.openingVideo;
      const openingBgVideo = this.$refs.openingBgVideo;

      if (openingVideo) {
        openingVideo.pause();
      }

      if (openingBgVideo) {
        openingBgVideo.pause();
      }

      window.scrollTo({ top: 0, behavior: 'auto' });

      this.openingAnimating = true;
      this.openingPhase = 'closing';

      void this.tryPlayMusic();

      window.setTimeout(() => {
        this.inviteOpened = true;

        // BEGIN SHOW SCROLL INDICATOR
        window.setTimeout(() => {
          if (window.scrollY <= 48) {
            this.showScrollIndicator();
          }
        }, 1350);
        // END SHOW SCROLL INDICATOR
        this.openingPhase = 'opening';

        this.$nextTick(() => {
          initReveal(this.$root);
        });
      }, 850);

      window.setTimeout(() => {
        this.openingAnimating = false;
        this.openingPhase = 'idle';
      }, 3300);

      console.log('Invite opened. Music placeholder:', this.inviteData.musicId);
    }
  }));
});

Alpine.start();









