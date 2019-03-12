import * as THREE from 'three';

const loader = new THREE.FontLoader();

class Loader {
  static fonts = {};
  static load(path: string, callback: (args: any) => any) {
    const font = Loader.fonts[path];
    if (font) {
      callback(Loader.fonts[path]);
    } else {
      loader.load(path, (font) => {
        Loader[path] = font;
        callback(font);
      });
    }
    return font;
  }
}

export default Loader;