#!/bin/sh
cd /Users/tanjinping/desktop/blog/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log
