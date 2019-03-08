class Util {
  static fill(target: any | any[], source: any, propertyName?: string) {
    if (Array.isArray(target)) {
      for (let i = target.length - 1; i >= 0; i--) {
        if (propertyName) {
          target[i][propertyName] = source;
        } else {
          target[i] = source;
        }
      }
    } else {
      if (propertyName) {
        target[propertyName] = source;
      } else {
        target = source;
      }
    }
  }
}

export default Util;