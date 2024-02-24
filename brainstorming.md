# Brainstorming

This file is used to document your thoughts, approaches and research conducted across all tasks in the Technical Assessment.

## Firmware

## Telemetry
Current behaviour:
- displays front-end fine until user input is given
   

Thoughts:
- possible sources of error
    - tcp or websocket issues / being unstable causing timeout
    - server incorrectly handles request
    - receiving the wrong type 
    - files not being imported/exported correctly and getting lost
- from inspecting elements in ui, issue occurs with live-data,
this could suggest live-data is not
    - being updated correctly
    - being parsed correctly / wrong type
    - being lost 
- running the server using docker, it crashes immediately after the input:
    {"battery_temperature":63.619096881601685,"timestamp":1708744685677}}
    there is clearly an extra } outside the JSON object so it cannot be parsed correctly
    i need to handle another case error for user input

Attempts:
- changed the live-action to a number before converting with .toprecision
    - result= displays NaN on frontend

Solution:

Research:

## Cloud