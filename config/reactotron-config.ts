import AsyncStorage from "@react-native-async-storage/async-storage";
import Reactotron from "reactotron-react-native";

const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: "Lasu Financial",
    onDisconnect: () => {
      console.log("Reactotron disconnected");
    },
  })
  .useReactNative({
    asyncStorage: true,
    networking: {
      ignoreUrls: /symbolicate|127.0.0.1/,
    },
    editor: false,
    errors: { veto: (stackFrame) => false },
    overlay: false,
  })
  .connect();

if (__DEV__) {
  console.tron = reactotron;
}

export default reactotron;
