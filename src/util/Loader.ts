import * as THREE from 'three';

const fontLoader: THREE.FontLoader = new THREE.FontLoader();
const textureLoader: THREE.TextureLoader = new THREE.TextureLoader();

// cache
const fonts: {
  [path: string]: THREE.Font
} = {};
const textures: {
  [path: string]: THREE.Texture
} = {};

class Loader {
  static loadFont(path: string, callback?: (args: any) => any): void {
    const font: THREE.Font | undefined = fonts[path];
    if (font && callback) {
      callback(font);
    } else {
      fontLoader.load(path, (font) => {
        fonts[path] = font;
        if (callback) {
          callback(font);
        }
      });
    }
  }
  static loadTexture(path: string): THREE.Texture {
    return textures[path] = textures[path] || textureLoader.load(path);
  }
}

export default Loader;