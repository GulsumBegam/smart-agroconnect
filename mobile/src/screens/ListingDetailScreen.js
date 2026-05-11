import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { listingsAPI } from "../services/api";
import VoiceAssistant from "../components/VoiceAssistant";

export default function ListingDetailScreen({ route }) {
  const { id } = route.params;
  const [listing, setListing] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await listingsAPI.getOne(id);
        setListing(data);
      } catch (err) {
        console.error("Fetch listing error:", err.message);
      }
    })();
  }, [id]);

  const placeBid = async () => {
    if (!bidAmount) {
      Alert.alert("Error", "Enter a bid amount");
      return;
    }
    try {
      await listingsAPI.placeBid(id, {
        amount: parseFloat(bidAmount),
        message: bidMessage,
      });
      Alert.alert("✅ Bid Placed!", "Your bid has been submitted");
      setBidAmount("");
      setBidMessage("");
      const { data } = await listingsAPI.getOne(id);
      setListing(data);
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Bid failed");
    }
  };

  if (!listing) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  const tamilDesc = `${listing.title}. விலை ${listing.price} ரூபாய் ${listing.unit}. ${listing.bids?.length || 0} ஏலங்கள் வந்துள்ளன.`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{listing.title}</Text>
      <Text style={styles.category}>{listing.category}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{listing.price}/{listing.unit}</Text>
        <Text style={styles.quantity}>
          {listing.quantity} {listing.unit} available
        </Text>
      </View>

      {listing.description ? (
        <Text style={styles.description}>{listing.description}</Text>
      ) : null}

      {listing.location ? (
        <Text style={styles.location}>📍 {listing.location}</Text>
      ) : null}

      <Text style={styles.seller}>
        Seller: {listing.sellerName} ({listing.sellerPhone})
      </Text>

      <VoiceAssistant message={tamilDesc} style={{ alignSelf: "flex-start", marginTop: 12 }} />

      <Text style={styles.sectionTitle}>
        Bids ({listing.bids?.length || 0})
      </Text>
      {(listing.bids || []).map((bid, i) => (
        <View key={bid._id || i} style={styles.bidCard}>
          <Text style={styles.bidAmount}>₹{bid.amount}</Text>
          <Text style={styles.bidder}>{bid.bidderName}</Text>
          {bid.message ? (
            <Text style={styles.bidMsg}>{bid.message}</Text>
          ) : null}
        </View>
      ))}

      {listing.status === "open" && (
        <View style={styles.bidForm}>
          <Text style={styles.sectionTitle}>Place Your Bid</Text>
          <TextInput
            style={styles.input}
            placeholder="Bid amount (₹)"
            value={bidAmount}
            onChangeText={setBidAmount}
            keyboardType="decimal-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Message (optional)"
            value={bidMessage}
            onChangeText={setBidMessage}
            multiline
          />
          <Pressable style={styles.bidBtn} onPress={placeBid}>
            <Text style={styles.bidBtnText}>Submit Bid</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4" },
  content: { padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loading: { fontSize: 16, color: "#6b7280" },
  title: { fontSize: 24, fontWeight: "800", color: "#1a1a1a", marginBottom: 4 },
  category: {
    fontSize: 13,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  price: { fontSize: 22, fontWeight: "800", color: "#2d8a4e" },
  quantity: { fontSize: 14, color: "#374151" },
  description: { fontSize: 15, color: "#374151", lineHeight: 22, marginBottom: 12 },
  location: { fontSize: 14, color: "#6b7280", marginBottom: 4 },
  seller: { fontSize: 14, color: "#9ca3af", fontStyle: "italic", marginBottom: 12 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 16,
    marginBottom: 8,
  },
  bidCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#d97706",
  },
  bidAmount: { fontSize: 16, fontWeight: "700", color: "#d97706" },
  bidder: { fontSize: 13, color: "#374151", marginTop: 2 },
  bidMsg: { fontSize: 12, color: "#6b7280", marginTop: 2, fontStyle: "italic" },
  bidForm: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 10,
    backgroundColor: "#f9fafb",
  },
  bidBtn: {
    backgroundColor: "#d97706",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  bidBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
