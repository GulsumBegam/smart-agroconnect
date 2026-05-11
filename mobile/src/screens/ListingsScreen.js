import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  StyleSheet,
} from "react-native";
import { listingsAPI } from "../services/api";
import ListingCard from "../components/ListingCard";

export default function ListingsScreen({ navigation }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data } = await listingsAPI.getAll();
      setListings(data);
    } catch (err) {
      console.error("Fetch listings error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛒 Marketplace</Text>
        <Pressable style={styles.createBtn} onPress={() => navigation.navigate("NewListing")}>
          <Text style={styles.createBtnText}>+ Sell</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchListings} />
        }
      >
        {listings.length === 0 && !loading ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌾</Text>
            <Text style={styles.emptyText}>No listings yet</Text>
            <Text style={styles.emptySubtext}>Be the first to sell produce!</Text>
          </View>
        ) : (
          listings.map((l) => (
            <ListingCard
              key={l._id}
              listing={l}
              onPress={(item) =>
                navigation.navigate("ListingDetail", { id: item._id })
              }
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#1a472a" },
  createBtn: {
    backgroundColor: "#2d8a4e",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  empty: { alignItems: "center", paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 8 },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#374151" },
  emptySubtext: { fontSize: 14, color: "#9ca3af", marginTop: 4 },
});
