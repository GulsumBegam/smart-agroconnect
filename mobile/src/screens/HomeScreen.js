import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";

export default function HomeScreen({ navigation }) {
  const features = [
    {
      title: "🛒 Marketplace",
      desc: "Buy & sell produce directly",
      screen: "Listings",
      color: "#2d8a4e",
    },
    {
      title: "🌾 Crop Advisor",
      desc: "AI-powered crop recommendations",
      screen: "Predict",
      color: "#d97706",
    },
    {
      title: "🧪 Soil Analysis",
      desc: "Check soil health from photos",
      screen: "Soil",
      color: "#7c3aed",
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.emoji}>🌾</Text>
        <Text style={styles.heroTitle}>Smart AgroConnect</Text>
        <Text style={styles.heroSubtitle}>
          விவசாயிகளுக்கான ஸ்மார்ட் தளம்
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.grid}>
        {features.map((f) => (
          <Pressable
            key={f.screen}
            style={[styles.featureCard, { borderLeftColor: f.color }]}
            onPress={() => navigation.navigate(f.screen)}
          >
            <Text style={styles.featureTitle}>{f.title}</Text>
            <Text style={styles.featureDesc}>{f.desc}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          📱 Use the bottom tabs to navigate.{"\n"}
          🔊 Look for the Tamil voice button on any screen.{"\n"}
          🌱 Start by registering or logging in.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4",
  },
  content: {
    padding: 20,
  },
  hero: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#1a472a",
    borderRadius: 16,
    marginBottom: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#bbf7d0",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  grid: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    color: "#6b7280",
  },
  infoBox: {
    backgroundColor: "#ecfdf5",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  infoText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
  },
});
