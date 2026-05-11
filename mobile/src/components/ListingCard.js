import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function ListingCard({ listing, onPress }) {
  return (
    <Pressable style={styles.card} onPress={() => onPress?.(listing)}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {listing.title}
        </Text>
        <Text style={styles.price}>₹{listing.price}/{listing.unit}</Text>
      </View>

      <Text style={styles.category}>{listing.category}</Text>

      <View style={styles.footer}>
        <Text style={styles.quantity}>
          {listing.quantity} {listing.unit} available
        </Text>
        <Text style={styles.bids}>
          {listing.bids?.length || 0} bids
        </Text>
      </View>

      {listing.location ? (
        <Text style={styles.location}>📍 {listing.location}</Text>
      ) : null}

      <Text style={styles.seller}>
        by {listing.sellerName || "Unknown"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#2d8a4e",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2d8a4e",
  },
  category: {
    fontSize: 12,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  quantity: {
    fontSize: 13,
    color: "#374151",
  },
  bids: {
    fontSize: 13,
    color: "#d97706",
    fontWeight: "600",
  },
  location: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  seller: {
    fontSize: 12,
    color: "#9ca3af",
    fontStyle: "italic",
  },
});
