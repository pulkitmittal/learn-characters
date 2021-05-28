<script lang="ts">
  export let speak: { text: string } = { text: '' };

  const synth = window.speechSynthesis;
  let muted = false;
  let selectedSpeechVoice: SpeechSynthesisVoice | null = null;
  let browserSpeechVoices: SpeechSynthesisVoice[] = [];

  setTimeout(() => {
    browserSpeechVoices = synth.getVoices();
    const savedSpeechVoice = JSON.parse(
      localStorage.getItem('alphabets_speech_voice')
    );

    if (savedSpeechVoice) {
      muted = savedSpeechVoice.disabled;
      const foundSpeechVoice = browserSpeechVoices.find(
        (s) => s.lang === savedSpeechVoice.lang
      );
      if (foundSpeechVoice) {
        selectedSpeechVoice = foundSpeechVoice;
      }
    }

    selectedSpeechVoice =
      selectedSpeechVoice || browserSpeechVoices.find((s) => s.default);
    muted = muted ?? false;
  }, 500);

  $: if (selectedSpeechVoice) {
    localStorage.setItem(
      'alphabets_speech_voice',
      JSON.stringify({
        lang: selectedSpeechVoice.lang,
        disabled: muted,
      })
    );
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
          {voice.name}
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
