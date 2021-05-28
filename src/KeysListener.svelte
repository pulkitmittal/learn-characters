<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatcher = createEventDispatcher();

  // listening to keys
  let allowCapitalLetters = true,
    allowSmallLetters = true,
    allowNumbers = false;

  let listeningTo = '';
  // let regex = /^.*$/;

  const constructRegex = () => {
    const regex =
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
    dispatcher('regex', regex);
  };

  onMount(() => {
    constructRegex();
  });

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

    constructRegex();
  }
</script>

<div class="flex checkboxes">
  <label>
    <input type="checkbox" bind:checked={allowCapitalLetters} />
    Capital Letters
  </label>
  <label>
    <input type="checkbox" bind:checked={allowSmallLetters} />
    Small Letters
  </label>
  <label>
    <input type="checkbox" bind:checked={allowNumbers} />
    Numbers
  </label>
</div>

<div>
  Listening to <strong>{listeningTo}</strong>
</div>

<style>
  div.checkboxes {
    margin: 1em 0;
  }
  div.checkboxes label {
    margin-left: 1em;
  }
</style>
