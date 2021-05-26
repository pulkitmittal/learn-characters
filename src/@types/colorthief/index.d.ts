/// <reference types="colorthief" />

declare class ColorThief {
  getColor(
    sourceImage: HTMLImageElement,
    quality?: number
  ): [number, number, number];
  getPalette(
    sourceImage: HTMLImageElement,
    colorCount?: number,
    quality?: number
  ): [number, number, number][];
  getColorFromUrl(imageUrl: string, callback: () => {}, quality?: number): void;
  getImageData(imageUrl: string, callback: () => {}): void;
  getColorAsync(imageUrl: string, callback: () => {}, quality?: number): void;
}
declare module 'colorthief' {
  export = ColorThief;
}
