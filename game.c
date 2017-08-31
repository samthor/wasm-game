#include <emscripten.h>
#include <string.h>
#include "bitmap.h"

static bitmap_t screen;
static bitmap_t assets;

EMSCRIPTEN_KEEPALIVE
int game_setup(uint32_t *d, int w, int h) {
  screen.at = d;
  screen.w = w;
  screen.h = h;
  return 0;
}

EMSCRIPTEN_KEEPALIVE
int asset_setup(uint32_t *d, int w, int h) {
  assets.at = d;
  assets.w = w;
  assets.h = h;
  return 0;
}

int clear() {
  memset(screen.at, 0, screen.w * screen.h * 4);
  return 0;
}

static int px = 0;
static int py = 0;

EMSCRIPTEN_KEEPALIVE
int game_render() {
  // TODO stuff

  px += 1;
  if (px >= screen.w) {
    px = 0;
  }

  clear();

  int c = 0;
  for (int x = 0; x < 10; ++x) {
    for (int y = 0; y < 5; ++y) {
      ++c;
      int asset = (c % 2) ? 0 : 2;
      spriteset_blit(&assets, asset, &screen, x * 16, y * 16);
    }
  }

  spriteset_blit_trans(&assets, 1, &screen, px, 16);
  spriteset_blit_trans(&assets, 3, &screen, px, 32);

  return 1;  // something changed
}