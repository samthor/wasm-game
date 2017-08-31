
#include <string.h>

void *memset(void *dst, int c, size_t n) {
  if (n) {
    char *d = dst;
    do {
      *d++ = c;
    } while (--n);
  }
  return dst;
}

void *memcpy(void *restrict dst, const void *restrict src, size_t n) {
  void *orig = dst;
  while (n > 0) {
    ((char *)dst)[0] = ((char *)src)[0];
    ++dst;
    ++src;
    --n;
  }
  return orig;
}
