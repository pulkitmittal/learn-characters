<script lang="ts">
  import LocalStorage from './helpers/local-storage';

  let bodyColor: any = LocalStorage.getBackground() || 'green';
  $: {
    document.body.classList.toggle('blue', bodyColor === 'blue');
    document.body.classList.toggle('orange', bodyColor === 'orange');
    document.body.classList.toggle('red', bodyColor === 'red');
    document.body.classList.toggle('green', bodyColor === 'green');
    LocalStorage.saveBackground(bodyColor);
  }
</script>

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

<style>
  div.checkboxes {
    margin-top: 1em;
  }
  div.checkboxes label {
    margin-left: 1em;
  }
</style>
