import React, { useState } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import * as Speech from "expo-speech";

export default function VoiceAssistant({ message, style }) {
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    if (!message) return;
    Speech.stop();
    setSpeaking(true);
    Speech.speak(message, {
      language: "ta-IN",
      pitch: 1.0,
      rate: 0.9,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => {
        Speech.speak(message, {
          language: "en-IN",
          pitch: 1.0,
          rate: 0.9,
          onDone: () => setSpeaking(false),
        });
      },
    });
  };

  const stop = () => {
    Speech.stop();
    setSpeaking(false);
  };

  return (
    <Pressable
      style={[styles.button, style]}
      onPress={speaking ? stop : speak}
      accessibilityLabel={speaking ? "Stop speaking" : "Read aloud in Tamil"}
    >
      <Text style={styles.icon}>{speaking ? "🔇" : "🔊"}</Text>
      <Text style={styles.label}>
        {speaking ? "நிறுத்து" : "கேட்டு"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a472a",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
