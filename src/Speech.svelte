<script lang="ts">
  import { isoLangs } from './helpers/iso-languages';
  import LocalStorage from './helpers/local-storage';
  export let speak: { text: string } = { text: '' };

  const synth = window.speechSynthesis;
  let muted = false;
  let selectedSpeechVoice: SpeechSynthesisVoice | null = null;
  let browserSpeechVoices: SpeechSynthesisVoice[] = [];

  setTimeout(() => {
    browserSpeechVoices = synth.getVoices();
    const savedSpeechVoice = LocalStorage.getVoice();

    if (savedSpeechVoice) {
      // set voice from localstorage
      muted = savedSpeechVoice.disabled;
      const foundSpeechVoice = browserSpeechVoices.find(
        (s) => s.lang === savedSpeechVoice.lang
      );
      if (foundSpeechVoice) {
        selectedSpeechVoice = foundSpeechVoice;
      }
    } else {
      // set voice from browser locale
      const browserLocale = navigator.language;
      selectedSpeechVoice = browserSpeechVoices.find(
        (s) => s.lang === browserLocale
      );
    }

    selectedSpeechVoice =
      selectedSpeechVoice || browserSpeechVoices.find((s) => s.default);
    muted = muted ?? false;
  }, 500);

  $: if (selectedSpeechVoice) {
    LocalStorage.saveVoice({ lang: selectedSpeechVoice.lang, muted: muted });
  }

  $: if (speak?.text && selectedSpeechVoice && !muted) {
    const utterance = new SpeechSynthesisUtterance(speak.text);
    utterance.voice = selectedSpeechVoice;
    synth.speak(utterance);
  }
</script>

<div class="flex voice">
  <label>
    <b>Voice:</b>
    <select
      class="voice-select"
      bind:value={selectedSpeechVoice}
      disabled={muted}
    >
      {#each browserSpeechVoices as voice}
        <option value={voice}>
          {voice.name} - {isoLangs[voice.lang]?.name || voice.lang}
        </option>
      {/each}
    </select>
  </label>
  <label class="mute">
    <input type="checkbox" bind:checked={muted} />
    Mute
  </label>
</div>

<style>
  div.voice {
    margin-top: 1em;
  }
  div.voice .mute {
    margin-left: 1em;
  }
  .voice-select {
    width: 15em;
  }
</style>
