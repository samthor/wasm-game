
#ifndef __BITMAP_H
#define __BITMAP_H

#include <stdint.h>

typedef struct {
  uint32_t *at;
  int w;
  int h;
} bitmap_t;

int spriteset_blit(bitmap_t *from, int i, bitmap_t *to, int ox, int oy);
int spriteset_blit_trans(bitmap_t *from, int i, bitmap_t *to, int ox, int oy);
int bitmap_set(bitmap_t *b, int x, int y, uint32_t v);

#endif//__BITMAP_H
