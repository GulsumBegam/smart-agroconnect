import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { soilAPI } from "../services/api";
import VoiceAssistant from "../components/VoiceAssistant";

export default function SoilScreen() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const { data } = await soilAPI.analyze({});
      setResult(data);
    } catch (err) {
      Alert.alert("Error", "Soil analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const tamilResult = result
    ? `மண் வகை ${result.result.soilType}. pH ${result.result.ph}. ${result.result.recommendations[0]}`
    : "";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>🧪 Soil Analysis</Text>
      <Text style={styles.subtitle}>
        Upload a soil photo to get health analysis and recommendations
      </Text>

      <Pressable style={styles.cameraBtn} onPress={analyze}>
        <Text style={styles.cameraEmoji}>📸</Text>
        <Text style={styles.cameraText}>
          {loading ? "Analyzing..." : "Analyze Soil (Stub)"}
        </Text>
      </Pressable>

      {result && (
        <View style={styles.resultBox}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {result.status === "stub" ? "⚠️ Stub Mode" : "✅ Live"}
            </Text>
          </View>

          <Text style={styles.resultTitle}>Soil Report</Text>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Soil Type</Text>
            <Text style={styles.resultValue}>{result.result.soilType}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>pH Level</Text>
            <Text style={styles.resultValue}>{result.result.ph}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Nitrogen</Text>
            <Text style={styles.resultValue}>{result.result.nitrogen}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Phosphorus</Text>
            <Text style={styles.resultValue}>{result.result.phosphorus}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Potassium</Text>
            <Text style={styles.resultValue}>{result.result.potassium}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Organic Carbon</Text>
            <Text style={styles.resultValue}>{result.result.organicCarbon}</Text>
          </View>

          <Text style={styles.recTitle}>Recommendations</Text>
          {result.result.recommendations.map((rec, i) => (
            <Text key={i} style={styles.recItem}>
              • {rec}
            </Text>
          ))}

          <VoiceAssistant
            message={tamilResult}
            style={{ alignSelf: "flex-start", marginTop: 16 }}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4" },
  content: { padding: 20 },
  pageTitle: { fontSize: 24, fontWeight: "800", color: "#1a472a", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#6b7280", marginBottom: 24 },
  cameraBtn: {
    backgroundColor: "#7c3aed",
    borderRadius: 16,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#a78bfa",
    borderStyle: "dashed",
  },
  cameraEmoji: { fontSize: 48, marginBottom: 8 },
  cameraText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  resultBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusText: { fontSize: 12, fontWeight: "600", color: "#92400e" },
  resultTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  resultLabel: { fontSize: 14, color: "#6b7280" },
  resultValue: { fontSize: 14, fontWeight: "600", color: "#1a1a1a" },
  recTitle: { fontSize: 16, fontWeight: "700", marginTop: 16, marginBottom: 8 },
  recItem: { fontSize: 14, color: "#374151", lineHeight: 22, paddingLeft: 4 },
});
