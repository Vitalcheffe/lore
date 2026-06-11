#!/bin/bash
# Auto-restart Next.js dev server
while true; do
  cd /home/z/my-project
  bun --bun run dev
  sleep 2
done
