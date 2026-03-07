import { ScrollView, Text, View, TouchableOpacity, FlatList, RefreshControl, StyleSheet, ViewStyle } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@expo/vector-icons";

/**
 * Dashboard Screen - Main entry point
 * Displays list of created Minecraft servers with status, RAM usage, and player count
 * Floating "+" button opens server creation flow
 */

interface ServerCard {
  id: string;
  name: string;
  status: "running" | "stopped" | "error";
  ramUsage: number;
  ramAllocation: number;
  playerCount: number;
  maxPlayers: number;
  publicAddress: string;
  lastStarted?: string;
}

const styles = StyleSheet.create({
  serverCard: {
    marginBottom: 16,
  },
  fab: {
    position: "absolute",
    bottom: 32,
    left: 32,
  },
  pressableStyle: {
    marginBottom: 16,
  },
  fabStyle: {
    position: "absolute",
    bottom: 32,
    left: 32,
  },
});

export default function DashboardScreen() {
  const router = useRouter();
  const colors = useColors();
  const [servers, setServers] = useState<ServerCard[]>([
    {
      id: "1",
      name: "Survival SMP",
      status: "running",
      ramUsage: 1200,
      ramAllocation: 2048,
      playerCount: 3,
      maxPlayers: 20,
      publicAddress: "survival.play.kumbidi.net:25565",
      lastStarted: "2 hours ago",
    },
    {
      id: "2",
      name: "Creative World",
      status: "stopped",
      ramUsage: 0,
      ramAllocation: 1024,
      playerCount: 0,
      maxPlayers: 10,
      publicAddress: "creative.play.kumbidi.net:25565",
    },
  ]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call to refresh server statuses
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleCreateServer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/server-creation");
  };

  const handleServerPress = (serverId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/server-management",
      params: { id: serverId },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return colors.success;
      case "stopped":
        return colors.error;
      case "error":
        return colors.error;
      default:
        return colors.muted;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const renderServerCard = ({ item }: { item: ServerCard }) => {
    return (
    <TouchableOpacity
      onPress={() => handleServerPress(item.id)}
      // @ts-ignore - React Native style prop typing issue
      style={({ pressed }: any) => ({
        ...styles.pressableStyle,
        opacity: pressed ? 0.7 : 1,
      })}
      className="mb-4"
    >
      <View className="bg-surface rounded-xl p-4 border border-border">
        {/* Header: Name and Status */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold text-foreground flex-1">{item.name}</Text>
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: getStatusColor(item.status) + "20" }}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: getStatusColor(item.status) }}
            >
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </View>

        {/* Public Address */}
        <Text className="text-sm text-muted mb-3 font-mono">{item.publicAddress}</Text>

        {/* Stats Row 1: RAM Usage */}
        <View className="mb-3">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-xs text-muted">RAM Usage</Text>
            <Text className="text-xs font-semibold text-foreground">
              {item.ramUsage} / {item.ramAllocation} MB
            </Text>
          </View>
          <View className="h-2 bg-border rounded-full overflow-hidden">
            <View
              className="h-full bg-primary"
              style={{ width: `${(item.ramUsage / item.ramAllocation) * 100}%` }}
            />
          </View>
        </View>

        {/* Stats Row 2: Player Count */}
        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-muted">Players Online</Text>
          <Text className="text-xs font-semibold text-foreground">
            {item.playerCount} / {item.maxPlayers}
          </Text>
        </View>

        {/* Last Started */}
        {item.lastStarted && (
          <Text className="text-xs text-muted mt-2">{item.lastStarted}</Text>
        )}
      </View>
    </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer className="relative">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-3xl font-bold text-foreground">CraftDroid</Text>
        <Text className="text-sm text-muted mt-1">Minecraft Server Host</Text>
      </View>

      {/* Server List */}
      {servers.length > 0 ? (
        <FlatList
          data={servers}
          renderItem={renderServerCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <MaterialIcons name="storage" size={48} color={colors.muted} />
          <Text className="text-lg font-semibold text-foreground mt-4">No Servers Yet</Text>
          <Text className="text-sm text-muted text-center mt-2">
            Tap the + button to create your first Minecraft server
          </Text>
        </View>
      )}

      {/* Floating Action Button - Create Server */}
      <TouchableOpacity
        onPress={handleCreateServer}
        // @ts-ignore - React Native style prop typing issue
        style={({ pressed }: any) => ({
          ...styles.fabStyle,
          transform: [{ scale: pressed ? 0.95 : 1 }],
          opacity: pressed ? 0.8 : 1,
        })}
        className="absolute bottom-8 left-8 w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg"
      >
        <MaterialIcons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </ScreenContainer>
  );
}
