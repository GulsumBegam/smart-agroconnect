import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { predictAPI } from "../services/api";
import VoiceAssistant from "../components/VoiceAssistant";

export default function PredictScreen() {
  const [tab, setTab] = useState("crop");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [cropInputs, setCropInputs] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  const [priceInputs, setPriceInputs] = useState({
    crop: "rice",
    market: "default",
    month: "1",
  });

  const updateCropInput = (key, val) =>
    setCropInputs((prev) => ({ ...prev, [key]: val }));

  const updatePriceInput = (key, val) =>
    setPriceInputs((prev) => ({ ...prev, [key]: val }));

  const predictCrop = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = {};
      for (const [k, v] of Object.entries(cropInputs)) {
        data[k] = parseFloat(v) || 0;
      }
      const { data: res } = await predictAPI.crop(data);
      setResult(res);
    } catch (err) {
      Alert.alert("Error", "Prediction failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const predictPrice = async () => {
    setLoading(true);
    setResult(null);
    try {
      const { data: res } = await predictAPI.price({
        crop: priceInputs.crop,
        market: priceInputs.market,
        month: parseInt(priceInputs.month) || 1,
      });
      setResult(res);
    } catch (err) {
      Alert.alert("Error", "Prediction failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const cropFields = [
    { key: "nitrogen", label: "Nitrogen (N)", emoji: "🟤" },
    { key: "phosphorus", label: "Phosphorus (P)", emoji: "🔵" },
    { key: "potassium", label: "Potassium (K)", emoji: "🟡" },
    { key: "temperature", label: "Temperature (°C)", emoji: "🌡️" },
    { key: "humidity", label: "Humidity (%)", emoji: "💧" },
    { key: "ph", label: "pH", emoji: "⚗️" },
    { key: "rainfall", label: "Rainfall (mm)", emoji: "🌧️" },
  ];

  const tamilResult = result?.recommendations
    ? `சிறந்த பயிர் ${result.recommendations[0].crop}. மதிப்பெண் ${result.recommendations[0].score}.`
    : result?.predicted_price_per_quintal
    ? `${result.crop} விலை ${result.predicted_price_per_quintal} ரூபாய் குவிண்டால்.`
    : "";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>🌾 AI Advisor</Text>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, tab === "crop" && styles.tabActive]}
          onPress={() => setTab("crop")}
        >
          <Text style={[styles.tabText, tab === "crop" && styles.tabTextActive]}>
            Crop
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, tab === "price" && styles.tabActive]}
          onPress={() => setTab("price")}
        >
          <Text style={[styles.tabText, tab === "price" && styles.tabTextActive]}>
            Price
          </Text>
        </Pressable>
      </View>

      {tab === "crop" ? (
        <View>
          {cropFields.map((f) => (
            <View key={f.key} style={styles.fieldRow}>
              <Text style={styles.fieldEmoji}>{f.emoji}</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder={f.label}
                value={cropInputs[f.key]}
                onChangeText={(v) => updateCropInput(f.key, v)}
                keyboardType="decimal-pad"
              />
            </View>
          ))}
          <Pressable style={styles.predictBtn} onPress={predictCrop}>
            <Text style={styles.predictBtnText}>
              {loading ? "⏳ Predicting..." : "🔍 Get Recommendation"}
            </Text>
          </Pressable>
        </View>
      ) : (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Crop name (e.g. rice)"
            value={priceInputs.crop}
            onChangeText={(v) => updatePriceInput("crop", v)}
          />
          <TextInput
            style={styles.input}
            placeholder="Market (default)"
            value={priceInputs.market}
            onChangeText={(v) => updatePriceInput("market", v)}
          />
          <TextInput
            style={styles.input}
            placeholder="Month (1-12)"
            value={priceInputs.month}
            onChangeText={(v) => updatePriceInput("month", v)}
            keyboardType="number-pad"
          />
          <Pressable style={styles.predictBtn} onPress={predictPrice}>
            <Text style={styles.predictBtnText}>
              {loading ? "⏳ Predicting..." : "💰 Predict Price"}
            </Text>
          </Pressable>
        </View>
      )}

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>📊 Result</Text>

          {result.recommendations ? (
            result.recommendations.map((r, i) => (
              <View key={r.crop} style={styles.recRow}>
                <Text style={styles.recRank}>#{i + 1}</Text>
                <Text style={styles.recCrop}>
                  {r.crop.charAt(0).toUpperCase() + r.crop.slice(1)}
                </Text>
                <Text style={styles.recScore}>
                  {(r.score * 100).toFixed(1)}%
                </Text>
              </View>
            ))
          ) : null}

          {result.predicted_price_per_quintal ? (
            <View>
              <Text style={styles.priceResult}>
                ₹{result.predicted_price_per_quintal} / quintal
              </Text>
              <Text style={styles.priceRange}>
                Range: ₹{result.confidence_low} – ₹{result.confidence_high}
              </Text>
            </View>
          ) : null}

          <VoiceAssistant message={tamilResult} style={{ alignSelf: "flex-start", marginTop: 12 }} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4" },
  content: { padding: 20 },
  pageTitle: { fontSize: 24, fontWeight: "800", color: "#1a472a", marginBottom: 16 },
  tabs: { flexDirection: "row", marginBottom: 16, gap: 8 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
  },
  tabActive: { backgroundColor: "#1a472a" },
  tabText: { fontSize: 14, fontWeight: "600", color: "#374151" },
  tabTextActive: { color: "#fff" },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  fieldEmoji: { fontSize: 20, marginRight: 8, width: 30 },
  fieldInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  predictBtn: {
    backgroundColor: "#2d8a4e",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  predictBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  resultBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#2d8a4e",
  },
  resultTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  recRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  recRank: { fontSize: 14, fontWeight: "700", color: "#6b7280", width: 30 },
  recCrop: { flex: 1, fontSize: 16, fontWeight: "600", color: "#1a1a1a" },
  recScore: { fontSize: 16, fontWeight: "700", color: "#2d8a4e" },
  priceResult: { fontSize: 24, fontWeight: "800", color: "#2d8a4e" },
  priceRange: { fontSize: 14, color: "#6b7280", marginTop: 4 },
});
