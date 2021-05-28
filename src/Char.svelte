<script lang="ts">
  import { fly, fade } from 'svelte/transition';

  export let key = '';
  export let color = '';
</script>

<div
  class="char"
  style={`color: ${color};`}
  in:fly={{ x: -400, duration: 500 }}
  out:fade
>
  {key === ' ' ? 'Space' : key}
</div>

<style>
  div.char {
    font-size: 16em;
    font-weight: bold;
    width: 320px;
    max-width: 320px;
    text-shadow: 0px 0px 8px #f2f2f2;
  }

  @media (max-width: 768px) {
    div.char {
      width: 50%;
    }
  }

  @media (max-width: 428px) {
    div.char {
      font-size: 12em;
    }
  }
</style>
