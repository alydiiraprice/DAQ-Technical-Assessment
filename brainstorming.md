# Brainstorming

This file is used to document your thoughts, approaches and research conducted across all tasks in the Technical Assessment.

## Firmware

## Telemetry
## Telemetry: Task 1
Current behaviour:
- displays front-end correctly for around 30 seconds
- breaks, and stay displaying the last received number on the same page
- backend function (battery_emulator) connects to frontend ui and server

Thoughts:
- possible sources of error
    - tcp or websocket issues / being unstable causing timeout
    - server incorrectly handles requests (HTTP)
    - receiving the wrong type of variable causing TS to break
- assumption:
    - told not to touch anything in data-emulator directory,
    therefore, the battery_emulator function must work correctly

Process for solution:
- initial run of the server using docker, it crashes immediately after the input:
    {"battery_temperature":63.619096881601685,"timestamp":1708744685677}}
    - there is clearly an extra } outside the JSON object so it cannot be parsed correctly
    - need to handle this error case for input
- the distinct differences of correctly functioning input and breaking input is the extra }
- initial solution idea: create an error case which catches this, but allows the program to ignore and keep running
    - issues: continues to break, also generally not a good idea since the quantitative data inside
                the object is important and needs to be displayed as well, not avoided.

Final solution:
- create a function that can identify this case for an extra } and remove it
- after removal, continue to parse the object and pass it on to be displayed in the frontend
- see server.ts, the function 'parseData' has been written by me to identify, remove and then parse objects that fit into this error case
- see server.ts, after socket.on, call this parseData function before handing it to the websocket client
to be displayed on the frontend.

Research:
- understanding websockets
https://vishalrana9915.medium.com/understanding-websockets-in-depth-6eb07ab298b3 
- understanding tcp
https://www.fortinet.com/resources/cyberglossary/tcp-ip#:~:text=Transmission%20Control%20Protocol%20(TCP)%20is,data%20and%20messages%20over%20networks. 
- typescript throw catch errors
https://byby.dev/ts-try-catch-error-type
https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript 
- chatGPT to receive this line of code (replace part of a string): 
    const jsonStringWithoutExtraBracket = msg.toString().replace(/}\s*$/, '');
## Telemetry: Task 2
Breakdown of task aims:
- add a function or refactor code in server.ts to:
    1. identify when battery temperature is > 80
    2. track if this occurs more than 3 times in 5 seconds
    3. if 2. occurs, print the current timestamp and 'simple' (assume one-line) error message

Process for solution:
- integrate this code after the parseData() function from task 1 so object properties can be read correctly
- define constants
    the threshold = 80
    the maximum number of occurences = 3
    the time threshold = 5000ms

Final solution:

Research:

## Cloud