import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { authAPI } from "../services/api";
import VoiceAssistant from "../components/VoiceAssistant";

export default function LoginScreen({ navigation, onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!phone || !password) {
      Alert.alert("Error", "Phone and password are required");
      return;
    }
    if (isRegister && !name) {
      Alert.alert("Error", "Name is required for registration");
      return;
    }

    setLoading(true);
    try {
      const apiCall = isRegister
        ? authAPI.register({ phone, name, password })
        : authAPI.login({ phone, password });

      const { data } = await apiCall;
      global.authToken = data.token;
      onLogin?.(data.user);
    } catch (err) {
      const msg = err.response?.data?.error || "Something went wrong";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const tamilHelp = isRegister
    ? "பதிவு செய்ய உங்கள் பெயர், தொலைபேசி எண் மற்றும் கடவுச்சொல்லை உள்ளிடவும்."
    : "உள்நுழைய உங்கள் தொலைபேசி எண் மற்றும் கடவுச்சொல்லை உள்ளிடவும்.";

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.emoji}>🌾</Text>
        <Text style={styles.title}>
          {isRegister ? "பதிவு செய்க" : "உள்நுழைய"}
        </Text>
        <Text style={styles.subtitle}>
          {isRegister ? "Create Account" : "Welcome Back"}
        </Text>

        {isRegister && (
          <TextInput
            style={styles.input}
            placeholder="பெயர் / Name"
            value={name}
            onChangeText={setName}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="தொலைபேசி / Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="கடவுச்சொல் / Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? "⏳ காத்திருங்கள்..."
              : isRegister
              ? "பதிவு செய்க"
              : "உள்நுழைய"}
          </Text>
        </Pressable>

        <Pressable
          style={styles.switchBtn}
          onPress={() => setIsRegister(!isRegister)}
        >
          <Text style={styles.switchText}>
            {isRegister
              ? "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைய"
              : "புதிய கணக்கு வேண்டுமா? பதிவு செய்க"}
          </Text>
        </Pressable>

        <VoiceAssistant message={tamilHelp} style={{ alignSelf: "center", marginTop: 16 }} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  emoji: {
    fontSize: 40,
    textAlign: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a472a",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: "#f9fafb",
  },
  button: {
    backgroundColor: "#1a472a",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  switchBtn: {
    marginTop: 16,
    alignItems: "center",
  },
  switchText: {
    color: "#2d8a4e",
    fontSize: 14,
  },
});
