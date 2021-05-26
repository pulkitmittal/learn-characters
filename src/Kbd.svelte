<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let key = '';

  const dispatch = createEventDispatcher();

  let hoverEl = '';
</script>

<kbd
  class:hover={hoverEl === 'kbd'}
  on:mouseout|stopPropagation={() => {
    hoverEl = '';
  }}
  on:mouseover|stopPropagation={() => {
    hoverEl = 'kbd';
  }}
  on:click={() => dispatch('selectKey')}
>
  <span class="char">
    {key === ' ' ? 'Space' : key}
  </span>
  <span
    class="close"
    class:hover={hoverEl === 'close'}
    on:mouseout|stopPropagation={() => {
      hoverEl = '';
    }}
    on:mouseover|stopPropagation={() => {
      hoverEl = 'close';
    }}
    on:click|stopPropagation={() => dispatch('deleteKey')}
  >
    &times;
  </span>
</kbd>

<style>
  kbd {
    box-sizing: border-box;
    text-align: center;
    font-size: 2em;
    width: 2.5em;
    height: 2.5em;
    line-height: 2.5em;
    margin: 8px;
    color: #555;
    cursor: pointer;
    text-shadow: 0 0.5px 1px #777, 0 2px 6px #f2f2f2;
    border: 1px solid #d4d4d4;
    border-radius: 10px;
    background: -webkit-linear-gradient(
      top,
      #f9f9f9 0%,
      #d2d2d2 80%,
      #c0c0c0 100%
    );
    font-family: sans-serif;
    display: inline-block;
    transition: transform 0.15s ease;
    -webkit-user-select: none;
  }
  kbd.hover:not(.big),
  kbd:focus:not(.big) {
    transform: translateY(2px);
  }
  kbd:active:not(.big) {
    transform: translateY(4px);
  }
  kbd span.char {
    margin-right: -8px;
  }
  kbd span.close {
    float: right;
    box-shadow: none;
    font-size: 0.5em;
    border: 1px solid currentColor;
    border-radius: 50%;
    width: 1em;
    height: 1em;
    line-height: 1;
    background: white;
    margin-right: -10px;
    margin-top: -10px;
  }
  kbd span.close.hover {
    background: #bdbdbd;
  }
</style>
