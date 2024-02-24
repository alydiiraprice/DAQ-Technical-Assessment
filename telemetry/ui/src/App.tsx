import { useState, useEffect } from "react";
import LiveValue from "./live_value";
import RedbackLogo from "./redback_logo.jpg";
import "./App.css";
import useWebSocket, { ReadyState } from "react-use-websocket";

const WS_URL = "ws://localhost:8080";

interface VehicleData {
  battery_temperature: number;
  timestamp: number;
}

function App() {
  // where is set temperature defined??
  const [temperature, setTemperature] = useState<number>(0);
  const {
    lastJsonMessage,
    readyState,
  }: { lastJsonMessage: VehicleData | null; readyState: ReadyState } =
    useWebSocket(WS_URL, {
      share: false,
      shouldReconnect: () => true,
    });

  useEffect(() => {
    switch (readyState) {
      case ReadyState.OPEN:
        console.log("Connected to streaming service");
        break;
      case ReadyState.CLOSED:
        console.log("Disconnected from streaming service");
        break;
      default:
        break;
    }
  }, [readyState]);

  useEffect(() => {
    // receives  object
    console.log("Received: ", lastJsonMessage);
    if (lastJsonMessage === null) {
      // test
      console.log("testing, received null");
      return;
    }
    // OG: 
    setTemperature(lastJsonMessage["battery_temperature"]);

    // it. 1
    // if (typeof lastJsonMessage.battery_temperature === 'vehicleData') {
    //   setTemperature(lastJsonMessage.battery_temperature);
    // } else {
    //   console.log("Invalid temperature value received");
    // }

    // it. 2
    // if (typeof lastJsonMessage.battery_temperature === 'string') {
    //   // Convert the string to a number
    //   const newTemperature = parseFloat(lastJsonMessage.battery_temperature);
      
    //   // Check if the conversion was successful
    //   if (!isNaN(newTemperature)) {
    //     // Set the temperature state with the converted number
    //     setTemperature(newTemperature);
    //   } else {
    //     console.log("Invalid temperature value received");
    //   }
    // } else {
    //   console.log(typeof lastJsonMessage.battery_temperature);
    //   console.log("Invalid temperature value received entirely");
    // }
  }, [lastJsonMessage]);

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={RedbackLogo}
          className="redback-logo"
          alt="Redback Racing Logo"
        />
        <p className="value-title">Live Battery Temperature</p>
        <LiveValue temp={temperature} />
      </header>
    </div>
  );
}

export default App;
