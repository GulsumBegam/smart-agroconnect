import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";

// Global auth token storage (use AsyncStorage in production)
global.authToken = null;

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!global.authToken);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    console.log("Logged in:", user?.name);
  };

  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator isLoggedIn={isLoggedIn} onLogin={handleLogin} />
    </>
  );
}
