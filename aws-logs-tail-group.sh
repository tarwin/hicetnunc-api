#!/bin/bash

group_name='/aws/lambda/HenDevApi'
start_seconds_ago=3600
aws_cmd_opts='--profile hendev --region us-east-2'

# Usage: get_loglines "<log-group-name>" <start-time>
get_loglines() {
  aws $aws_cmd_opts --output text logs filter-log-events \
      --log-group-name "$1" \
      --interleaved \
      --start-time $2
}

# Usage: get_next_start_time <prev-start-time> "<loglines>"
get_next_start_time() {
  next_start_time=$( sed -nE 's/^EVENTS.([^[:blank:]]+).([[:digit:]]+).+$/\2/ p' <<< "$2" | tail -n1 )
  if [[ -n "$next_start_time" ]]; then
    echo $(( $next_start_time + 1 ))
  else
    echo $1
  fi
}

start_time=$(( ( $(date -u +"%s") - $start_seconds_ago ) * 1000 ))
while [[ -n "$start_time" ]]; do
  loglines=$( get_loglines "$group_name" $start_time )
  [ $? -ne 0 ] && break
  start_time=$( get_next_start_time $start_time "$loglines" )
  echo "$loglines"
  sleep 2
done