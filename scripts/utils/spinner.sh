#!/usr/bin/env bash

spinner_abort() {
  [ -n "$SPINNER_PID" ] && kill $SPINNER_PID
  echo -e '\033[?25h'
  exit 0
}

spinner_loop() {
  while true; do
    let 'SPINNER_INDEX=++SPINNER_INDEX % SPINNER_LENGTH'
    echo -en "${SPINNER_FRAMES[$SPINNER_INDEX]}\033[1D"
    sleep 0.1
  done
}

spinner_start() {
  SPINNER_FRAMES=(⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏)
  SPINNER_INDEX=0
  SPINNER_LENGTH=${#SPINNER_FRAMES[@]}

  trap spinner_abort SIGINT
  echo -en '\033[?25l \x1B[0m'
  spinner_loop &
  SPINNER_PID=$!
}

spinner_stop() {
  kill $SPINNER_PID &> /dev/null
  wait $SPINNER_PID &> /dev/null
  echo -e '\033[?25h'
}

spinner_clear() {
    spinner_stop
    erase_last_line
}