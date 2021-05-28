<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let key = '';
  export let selected = false;
  export let canClose = true;

  const dispatch = createEventDispatcher();

  let hoverEl = '';
</script>

<kbd
  class:hover={hoverEl === 'kbd'}
  class:selected
  class:can-close={canClose}
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
  {#if canClose}
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
  {/if}
</kbd>

<style>
  kbd {
    box-sizing: border-box;
    text-align: center;
    font-size: 2em;
    width: 2.5em;
    height: 2.5em;
    line-height: 2.5em;
    margin: 0.25em;
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
  kbd.can-close span.char {
    margin-right: -0.4em;
  }
  kbd.can-close span.close {
    float: right;
    box-shadow: none;
    font-size: 0.5em;
    border: 1px solid currentColor;
    border-radius: 50%;
    width: 1.1em;
    height: 1.1em;
    line-height: 1;
    background: white;
    margin-right: -0.5em;
    margin-top: -0.5em;
  }
  kbd.can-close span.close.hover {
    background: #bdbdbd;
  }
  kbd.selected {
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
      0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
  }
  @media (max-width: 428px) {
    kbd {
      font-size: 1.8em;
    }
  }
  @media (max-width: 375px) {
    kbd {
      font-size: 1.6em;
    }
  }
</style>
