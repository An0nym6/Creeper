#!/usr/bin/python
# -*- coding: UTF-8 -*-

# 运行 Shell 脚本
import os

# 打开父页面文件
lines = []
with open('parent.txt') as f:
  lines = f.read().splitlines()

# 访问父页面，得到子一代页面
for i, line in enumerate(lines):
  os.system('./phantomjs visit.js %s c1-%d.txt' % (line, i))

# 访问子代页面，得到下一代页面
level = 1
while (level < 3):
  fileNum = 0
  counter = 0
  while (os.path.exists('c' + str(level) + '-' + str(fileNum) + '.txt')):
    with open('c' + str(level) + '-' + str(fileNum) + '.txt') as f:
      lines = f.read().splitlines()
    for i, line in enumerate(lines):
      os.system('./phantomjs visit.js %s c%d-%d.txt' % (line, level + 1, counter))
      counter += 1
    fileNum += 1
  level += 1
