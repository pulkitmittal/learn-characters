<script lang="ts">
  import { onMount } from 'svelte';
  import Char from './Char.svelte';
  import Img from './Img.svelte';
  import Kbd from './Kbd.svelte';

  // body color
  let bodyColor: any = localStorage.getItem('alphabets_body_color') || 'green';
  $: {
    document.body.classList.toggle('blue', bodyColor === 'blue');
    document.body.classList.toggle('orange', bodyColor === 'orange');
    document.body.classList.toggle('red', bodyColor === 'red');
    document.body.classList.toggle('green', bodyColor === 'green');
    localStorage.setItem('alphabets_body_color', bodyColor);
  }

  // listening to keys
  let allowCapitalLetters = true,
    allowSmallLetters = true,
    allowNumbers = false;

  let listeningTo = '';
  let regex = /^.*$/;

  $: {
    const allKeys = ['capital letters', 'small letters', 'numbers'];
    const listeningToArr = [
      allowCapitalLetters ? allKeys[0] : '',
      allowSmallLetters ? allKeys[1] : '',
      allowNumbers ? allKeys[2] : '',
    ].filter((v) => !!v);

    listeningTo =
      listeningToArr.length === 0
        ? `${allKeys.slice(0, -1).join(', ')} and ${allKeys.slice(-1)[0]}`
        : listeningToArr.length > 1
        ? `${listeningToArr.slice(0, -1).join(', ')} and ${
            listeningToArr.slice(-1)[0]
          }`
        : listeningToArr.join('');

    regex =
      allowCapitalLetters && allowNumbers && allowSmallLetters
        ? /^[a-zA-Z0-9]$/
        : allowCapitalLetters && allowNumbers
        ? /^[A-Z0-9]$/
        : allowCapitalLetters && allowSmallLetters
        ? /^[a-zA-Z]$/
        : allowSmallLetters && allowNumbers
        ? /^[a-z0-9]$/
        : allowCapitalLetters
        ? /^[A-Z]$/
        : allowSmallLetters
        ? /^[a-z]$/
        : allowNumbers
        ? /^[0-9]$/
        : /^[a-zA-Z0-9]$/;
  }

  const synth = window.speechSynthesis;
  let pressedKeys = [];
  let lastPressedKey: string;
  let selectedImageColor: string;

  onMount(() => {
    const alphabets = localStorage.getItem('alphabets_keys');
    pressedKeys = (alphabets && JSON.parse(alphabets)) || [];
    const lastKey = localStorage.getItem('alphabets_last_key');
    lastPressedKey = lastKey || '';
  });

  function handleKeydown(event: KeyboardEvent) {
    if (
      !regex.test(event.key) ||
      event.shiftKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return;
    }

    if (lastPressedKey !== event.key) {
      lastPressedKey = event.key;
      // remove key from last location and push it in front
      const keyIndex = pressedKeys.indexOf(lastPressedKey);
      if (keyIndex > -1) {
        pressedKeys.splice(keyIndex, 1);
      }
      pressedKeys = [lastPressedKey, ...pressedKeys];
    }
    synth.speak(new SpeechSynthesisUtterance(lastPressedKey));
    localStorage.setItem('alphabets_keys', JSON.stringify(pressedKeys));
    localStorage.setItem('alphabets_last_key', lastPressedKey);
  }

  function setKey(k: string) {
    lastPressedKey = k;
    synth.speak(new SpeechSynthesisUtterance(lastPressedKey));
    localStorage.setItem('alphabets_last_key', lastPressedKey);
  }

  function deleteKey(index: number) {
    const deletedKeys = pressedKeys.splice(index, 1);
    if (deletedKeys[0] === lastPressedKey) {
      lastPressedKey = pressedKeys[index] || '';
    }
    pressedKeys = [...pressedKeys];
    localStorage.setItem('alphabets_last_key', lastPressedKey);
    localStorage.setItem('alphabets_keys', JSON.stringify(pressedKeys));
  }

  function speakText(text: string) {
    synth.speak(new SpeechSynthesisUtterance(text));
  }

  function reset() {
    lastPressedKey = '';
    pressedKeys = [];
    localStorage.removeItem('alphabets_keys');
    localStorage.removeItem('alphabets_last_key');
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<main>
  <h1>Let's learn characters!</h1>

  <div class="flex checkboxes">
    <legend>Background:</legend>
    <label>
      <input type="radio" bind:group={bodyColor} value="blue" />
      Blue
    </label>
    <label>
      <input type="radio" bind:group={bodyColor} value="orange" />
      Orange
    </label>
    <label>
      <input type="radio" bind:group={bodyColor} value="red" />
      Red
    </label>
    <label>
      <input type="radio" bind:group={bodyColor} value="green" />
      Green
    </label>
  </div>

  <div class="flex checkboxes">
    <legend>Listen to:</legend>
    <label>
      <input type="checkbox" bind:checked={allowCapitalLetters} />
      Allow Capital Letters
    </label>
    <label>
      <input type="checkbox" bind:checked={allowSmallLetters} />
      Allow Small Letters
    </label>
    <label>
      <input type="checkbox" bind:checked={allowNumbers} />
      Allow Numbers
    </label>
  </div>

  <p>
    Listening to <strong>{listeningTo}</strong>
  </p>

  <section>
    {#if pressedKeys.length > 0}
      {#if lastPressedKey}
        <div class="showcase flex">
          <Char key={lastPressedKey} color={selectedImageColor} />
          <Img
            key={lastPressedKey}
            on:speak={(event) => speakText(event.detail.text)}
            on:color={(event) => (selectedImageColor = event.detail.color)}
          />
        </div>
      {/if}

      <div><strong>History:</strong></div>
      <div class="history">
        {#each pressedKeys as k, i}
          <Kbd
            key={k}
            on:selectKey={() => setKey(k)}
            on:deleteKey={() => deleteKey(i)}
          />
        {/each}
      </div>
      <button on:click={reset}>Reset History</button>
    {:else}
      <p>Focus this window and press any key</p>
    {/if}
  </section>

  <p>
    Source code: <a
      target="_blank"
      href="https://github.com/pulkitmittal/learn-characters"
    >
      Github
    </a>
  </p>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
    min-width: 320px;
    max-width: 1280px;
  }

  div.checkboxes {
    margin-top: 1em;
  }

  div.checkboxes label {
    margin-left: 1em;
  }

  div.showcase {
    padding: 16px 0;
    margin-bottom: 16px;
  }

  div.history {
    margin: 16px 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
