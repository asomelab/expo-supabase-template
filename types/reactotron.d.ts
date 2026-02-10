import Reactotron from "reactotron-react-native";

declare global {
  interface Console {
    /**
     * Reactotron client for logging in development
     * Usage: console.tron.log("Hello from Reactotron")
     */
    tron: typeof Reactotron;
  }

  var __DEV__: boolean;
}

export { };

