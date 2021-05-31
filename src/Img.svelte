<script lang="ts">
  type KeyImage = { src: string; alt: string; color?: string };

  import { createEventDispatcher } from 'svelte';
  import ColorThief from 'colorthief';
  import { tick } from 'svelte';
  import { AllImages } from './helpers/all_images';

  export let key = '';
  export let autoRotate = true;

  const dispatch = createEventDispatcher();
  const colorThief = new ColorThief();

  let selectedKeyImage: KeyImage | null = null;
  let selectedKeyImageIndex = 0;
  let selectedKeyImages = [];
  let selectedImageColor = '';

  const images: {
    [key: string]: KeyImage[];
  } = {};

  AllImages.forEach((img) => {
    const firstChar = img.substr(0, 1).toUpperCase();
    images[firstChar] = images[firstChar] || [];
    images[firstChar].push({
      src: `images/${img}`,
      alt: img.split('_')[1].split('.png')[0],
    });
  });

  const getColor = () => {
    const img: HTMLImageElement = document.querySelector('img.char-image');
    return new Promise<[number, number, number]>((resolve, reject) => {
      if (!img) {
        reject();
        return;
      }

      if (img.complete) {
        const color = colorThief.getColor(img);
        resolve(color);
      } else {
        const cc = () => {
          const color = colorThief.getColor(img);
          resolve(color);
          img.removeEventListener('load', cc);
        };
        img.addEventListener('load', cc);
      }
    });
  };

  const prevImage = () => {
    let index = selectedKeyImageIndex;
    if (index === 0) {
      index = selectedKeyImages.length - 1;
    } else {
      index = index - 1;
    }
    selectedKeyImageIndex = index;
    setKeyImage();
  };

  const nextImage = () => {
    let index = selectedKeyImageIndex;
    if (index === selectedKeyImages.length - 1) {
      index = 0;
    } else {
      index = index + 1;
    }
    selectedKeyImageIndex = index;
    setKeyImage();
  };

  const setKeyImage = () => {
    selectedKeyImage = selectedKeyImages[selectedKeyImageIndex];
    if (selectedKeyImage) {
      tick()
        .then((_) => getColor())
        .then((color) => {
          selectedImageColor = `rgb(${color})`;
          dispatch('speak', { text: selectedKeyImage.alt });
          dispatch('color', { color: selectedImageColor });
        })
        .catch(stopAutoRotate);
    }
  };

  let autoSelectNextImageInterval: any;
  const startAutoRotate = (keyImages: KeyImage[]) => {
    stopAutoRotate();
    if (keyImages.length > 1) {
      autoSelectNextImageInterval = setInterval(nextImage, 5000);
    }
  };
  const stopAutoRotate = () => {
    autoSelectNextImageInterval && clearInterval(autoSelectNextImageInterval);
  };

  $: {
    const keyImages = images[key] || images[key.toUpperCase()];
    selectedKeyImages = keyImages?.length ? keyImages : [];
    selectedKeyImageIndex = 0;
    setKeyImage();
    autoRotate && startAutoRotate(keyImages);
  }
</script>

{#if selectedKeyImage}
  <div class="images" class:has-arrows={selectedKeyImages.length > 1}>
    {#if selectedKeyImages.length > 1}
      <div class="prev" on:click={() => prevImage()}>&lt;</div>
    {/if}
    <div class="image-wrapper">
      <img
        class="char-image"
        src={selectedKeyImage.src}
        alt={selectedKeyImage.alt}
      />
      <div
        class="text"
        class:capital={/^[A-Z]$/.test(key)}
        class:small={/^[a-z]$/.test(key)}
        style={`color: ${selectedImageColor}`}
        on:click={() => dispatch('speak', { text: selectedKeyImage.alt })}
      >
        {selectedKeyImage.alt}
      </div>
    </div>
    {#if selectedKeyImages.length > 1}
      <div class="next" on:click={() => nextImage()}>&gt;</div>
    {/if}
  </div>
{/if}

<style>
  div.images {
    display: flex;
    width: 320px;
    max-width: 320px;
  }
  @media (max-width: 768px) {
    div.images {
      width: 50%;
    }
  }
  div.image-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  div.image-wrapper img.char-image {
    width: calc(100% - 52px);
  }
  div.images.has-arrows div.image-wrapper img.char-image {
    width: calc(100% - 8px);
  }
  div.image-wrapper div.text {
    font-size: 2em;
    line-height: 1.5;
    cursor: pointer;
  }
  div.image-wrapper div.text.capital {
    text-transform: uppercase;
  }
  div.image-wrapper div.text.small {
    text-transform: lowercase;
  }
  div.image-wrapper div.text:hover {
    text-shadow: 0 0.5px 1px #777, 0 2px 6px #f2f2f2;
  }
  div.prev,
  div.next {
    width: 1em;
    font-size: 2em;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    -webkit-user-select: none;
    color: #f2f2f2;
  }
</style>
