<script lang="ts">
  import { onMount } from 'svelte';
  import Char from './Char.svelte';
  import Img from './Img.svelte';
  import Kbd from './Kbd.svelte';
  import Speech from './Speech.svelte';
  import BodyColor from './BodyColor.svelte';
  import KeysListener from './KeysListener.svelte';
  import Utils from './helpers/utils';
  import LocalStorage from './helpers/local-storage';

  let regex = /^.*$/;
  let pressedKeys = [];
  // prettier-ignore
  let allKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  let lastKey: string;
  let selectedImageColor: string;
  let speak: { text: string } = { text: '' };

  onMount(() => {
    const { lastKey: savedLastKey, pressedKeys: savedPressedKeys } =
      LocalStorage.getKeys();
    pressedKeys = savedPressedKeys;
    lastKey = savedLastKey || '';
  });

  let throttleTimeoutId: any;
  const handleKeydown = (event: KeyboardEvent) => {
    if (
      isMobileDevice ||
      !regex.test(event.key) ||
      event.shiftKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      throttleTimeoutId
    ) {
      return;
    }

    if (lastKey !== event.key) {
      lastKey = event.key;
      // remove key from last location and push it in front
      const keyIndex = pressedKeys.indexOf(lastKey);
      if (keyIndex > -1) {
        pressedKeys.splice(keyIndex, 1);
      }
      pressedKeys = [lastKey, ...pressedKeys];
      LocalStorage.saveKeys({ lastKey, pressedKeys });
    }

    speak = { text: lastKey };

    throttleTimeoutId = setTimeout(() => {
      clearTimeout(throttleTimeoutId);
      throttleTimeoutId = null;
    }, 1000);
  };

  const selectPreviousKey = (k: string) => {
    lastKey = k;
    LocalStorage.saveKeys({ lastKey });

    speak = { text: lastKey };
  };

  const deleteKey = (index: number) => {
    const deletedKeys = pressedKeys.splice(index, 1);
    if (deletedKeys[0] === lastKey) {
      lastKey = pressedKeys[index] || '';
      LocalStorage.saveKeys({ lastKey });
    }
    pressedKeys = [...pressedKeys];
    LocalStorage.saveKeys({ pressedKeys });

    speak = { text: '' };
  };

  const reset = () => {
    lastKey = '';
    pressedKeys = [];
    LocalStorage.clearKeys();

    speak = { text: '' };
  };

  const isMobileDevice = Utils.isMobileDevice();
</script>

<svelte:window on:keydown={handleKeydown} />

<main>
  <h1>Let's learn characters!</h1>

  <BodyColor />

  {#if !isMobileDevice}
    <KeysListener on:regex={(event) => (regex = event.detail)} />
  {/if}

  <section>
    {#if lastKey}
      {#if 'speechSynthesis' in window}
        <Speech {speak} />
      {/if}
      <div class="showcase flex">
        <Char key={lastKey} color={selectedImageColor} />
        <Img
          key={lastKey}
          autoRotate={true}
          on:speak={(event) => (speak = { text: event.detail.text })}
          on:color={(event) => (selectedImageColor = event.detail.color)}
        />
      </div>
    {:else if isMobileDevice}
      <div class="instructions">Touch a key below to view pictures</div>
    {:else}
      <div class="instructions">Focus this window and press any alphabet</div>
    {/if}

    {#if isMobileDevice}
      <div><b>Touch a key below:</b></div>
      <div class="history">
        {#each allKeys as k, i}
          <Kbd
            key={k}
            selected={lastKey === k}
            canClose={false}
            on:selectKey={() => selectPreviousKey(k)}
            on:deleteKey={() => deleteKey(i)}
          />
        {/each}
      </div>
    {:else if pressedKeys.length > 0}
      <div><b>History:</b></div>
      <div class="history">
        {#each pressedKeys as k, i}
          <Kbd
            key={k}
            on:selectKey={() => selectPreviousKey(k)}
            on:deleteKey={() => deleteKey(i)}
          />
        {/each}
      </div>
      <button on:click={reset}>Reset History</button>
    {/if}
  </section>

  <p>
    Source code: <a
      target="_blank"
      href="https://github.com/pulkitmittal/learn-characters"
    >
      Github
    </a>
    |
    <span>Version: {process.env.APP_VERSION}</span>
  </p>
</main>

<style>
  main {
    text-align: center;
    margin: 0 auto;
    padding: 1em;
    box-sizing: border-box;
    width: 100%;
    min-width: 320px;
    max-width: 1080px;

    touch-action: manipulation;
    -ms-touch-action: manipulation;
    user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
  }

  div.showcase {
    padding: 1em 0;
    margin-bottom: 1em;
  }

  div.history {
    margin: 1em 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  div.instructions {
    font-size: 2em;
    padding: 140px 0;
  }

  h1 {
    margin: 0.5em 0;
    font-size: 2em;
  }
</style>
