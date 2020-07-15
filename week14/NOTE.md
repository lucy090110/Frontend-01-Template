# 每周总结可以写在这里每周总结可以写在这里

Carousel 思想

每次 transform 两张，当前图片坐标到 (-1, 0)，下一张到 (0, 0)

核心代码：

current.style.transform = `translateX(${- 100 - 100 * position}%)`; // (-1, 0)，回到
next.style.transform = `translateX(${- 100 * nextPosition}%)`; // 回到 (0, 0)，减去相对第一张图片的偏移量
