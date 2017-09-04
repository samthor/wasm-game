
/**
 * @param {!ArrayBuffer} bytes
 * @param {!Object<string, !Function>} callbacks
 * @return {{wa: !WebAssembly.Instance, buffer: !TypedArray}}
 */
export async function create(bytes, callbacks={}) {
  const memory = new WebAssembly.Memory({initial: 256, maximum: 256});
  const buffer = new Uint8Array(memory.buffer);

  const stdlib = {
    memcpy: function(dst, src, n) {
      buffer.copyWithin(dst, src, src + n);
    },
    memset: function(dst, c, n) {
      buffer.fill(c, dst, dst + n);
    },
  };

  const importObject = (function() {
    const env = {
      'abortStackOverflow': () => { throw new Error('abortStackOverflow'); },
      'table': new WebAssembly.Table({initial: 0, maximum: 0, element: 'anyfunc'}),
      'tableBase': 0,
      'memory': memory,
      'memoryBase': 1024,
      'STACKTOP': 0,
      'STACK_MAX': memory.buffer.byteLength,
      'DYNAMICTOP_PTR': 0,
    };
    for (const key in callbacks) {
      env['_' + key] = callbacks[key];
    }
    for (const key in stdlib) {
      env['_' + key] = stdlib[key];
    }
    return {env};
  }());

  return {wa: await WebAssembly.instantiate(bytes, importObject), memory};
}

/**
 * @param {string} src
 * @return {!Image}
 */
export async function loadImage(src) {
  return await new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = reject;
  });
}

/**
 * @param {(!Image|string)} src
 * @return {!ImageData}
 */
export async function loadImageData(src) {
  if (typeof src === 'string') {
    src = await loadImage(src);
  }

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = src.width;
  canvas.height = src.height;

  context.drawImage(src, 0, 0);
  return context.getImageData(0, 0, src.width, src.height);
}

export class Alloc {
  /**
   * @param {!WebAssembly.Memory) memory
   */
  constructor(memory) {
    this.memory_ = memory;
    this.position_ = memory.buffer.byteLength;
  }

  /**
   * @param {number} size
   * @return {!Uint8ClampedArray}
   */
  alloc(size) {
    let at = this.position_ - size;
    at -= (at % 8);  // put on boundary
    this.position_ = at;

    return new Uint8ClampedArray(this.memory_.buffer, at, size);
  }

  /**
   * @param {!TypedArray} from
   * @return {!Uint8ClampedArray}
   */
  copy(from) {
    const buffer = this.alloc(from.byteLength);
    buffer.set(from);
    return buffer;
  }

}