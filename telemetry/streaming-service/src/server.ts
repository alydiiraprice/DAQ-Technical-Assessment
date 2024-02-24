import { count } from "console";
import net from "net";
import { WebSocket, WebSocketServer } from "ws";

interface VehicleData {
  battery_temperature: number;
  timestamp: number;
}

const TCP_PORT = 12000;
const WS_PORT = 8080;
const tcpServer = net.createServer();
const websocketServer = new WebSocketServer({ port: WS_PORT });
// new constants for task 2
const tempThreshold = 80;
const maxTime = 5000; 
const countThreshold = 3;

let exceedTempCount = 0;
let lastTime = 0;

// new function
function parseData(msg: Buffer): VehicleData | null {
  try {
    const jsonString = msg.toString().trim();
    const jsonData = JSON.parse(jsonString);
    return jsonData;
  } catch (error) {
    if (error instanceof SyntaxError && error.message.includes('Unexpected token }')) {
      // Remove the extra } character and parsing again
      const jsonStringWithoutExtraBracket = msg.toString().replace(/}\s*$/, '');
      try {
        const jsonData = JSON.parse(jsonStringWithoutExtraBracket);
        return jsonData;
      } catch (parseError) {
        console.error('Error parsing JSON data after removing extra bracket:', parseError);
        return null;
      }
    } else {
      console.error('Error parsing JSON data:', error);
      return null;
    }
  }
}

tcpServer.on("connection", (socket) => {
  console.log("TCP client connected");

  socket.on("data", (msg) => {
    console.log(`Received: ${msg.toString()}`);
    // call new function to ensure jsonData is of the correct type
    const jsonData = parseData(msg);
    if (jsonData !== null) {
    // task 2
    // store jsondata 
    // check if temperature > 80
    if (jsonData.battery_temperature > tempThreshold) {
      const currentTime = Date.now();
      if (currentTime - lastTime <= maxTime) {
        exceedTempCount++;

        if (exceedTempCount > countThreshold) {
          console.log("Error: Battery Temperature exceeded threshold more than 3 times in 5 seconds at: ", currentTime);
           // reset counters
            exceedTempCount = 0;
            lastTime = 0;
        } else {
          // time has elapsed
          exceedTempCount = 1;
        }
      }
      // update last timestamo
      lastTime = currentTime;
    } 

    

    // working : send to clients
      websocketServer.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(jsonData));
        }
      });
    }
  });

  socket.on("end", () => {
    console.log("Closing connection with the TCP client");
  });

  socket.on("error", (err) => {
    console.log("TCP client error: ", err);
  });
});

websocketServer.on("listening", () =>
  console.log(`Websocket server started on port ${WS_PORT}`)
);

websocketServer.on("connection", async (ws: WebSocket) => {
  console.log("Frontend websocket client connected");
  ws.on("error", console.error);
});

tcpServer.listen(TCP_PORT, () => {
  console.log(`TCP server listening on port ${TCP_PORT}`);
});
