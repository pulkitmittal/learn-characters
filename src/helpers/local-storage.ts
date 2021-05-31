const PREFIX = 'learn-characters';

export default class LocalStorage {
  static saveBackground(bodyColor: string) {
    localStorage.setItem(`${PREFIX}_body_color`, bodyColor);
  }

  static getBackground() {
    return localStorage.getItem(`${PREFIX}_body_color`);
  }

  static saveKeys({
    lastKey,
    pressedKeys,
  }: {
    lastKey?: string;
    pressedKeys?: any[];
  }) {
    if (lastKey) {
      localStorage.setItem(`${PREFIX}_last_key`, lastKey);
    }
    if (pressedKeys) {
      localStorage.setItem(`${PREFIX}_keys`, JSON.stringify(pressedKeys));
    }
  }

  static getKeys() {
    const alphabets = localStorage.getItem(`${PREFIX}_keys`);
    const pressedKeys = (alphabets && JSON.parse(alphabets)) || [];
    const savedLastKey = localStorage.getItem(`${PREFIX}_last_key`);
    return {
      lastKey: savedLastKey,
      pressedKeys,
    };
  }

  static clearKeys() {
    localStorage.removeItem(`${PREFIX}_keys`);
    localStorage.removeItem(`${PREFIX}_last_key`);
  }

  static saveVoice({ lang, muted }: { lang: string; muted: boolean }) {
    localStorage.setItem(
      `${PREFIX}_speech_voice`,
      JSON.stringify({
        lang: lang,
        disabled: muted,
      })
    );
  }

  static getVoice() {
    const savedSpeechVoice = JSON.parse(
      localStorage.getItem(`${PREFIX}_speech_voice`)
    );
    return savedSpeechVoice as { lang: string; disabled: boolean };
  }
}
