#!/usr/bin/env bash

function erase_last_line() {
    tput civis && \
    tput cuu1 && tput el1 && tput el && \
    tput cnorm
}

function erase_lines() {
     # takes argument $1: number of lines
     for ((i=1;i<=$1;i++)); do
        erase_last_line
     done
}

function hide_cursor() {
    tput civis
}

function show_cursor() {
    tput cnorm
}