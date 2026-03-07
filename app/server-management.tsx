import { ScrollView, Text, View, TouchableOpacity, TextInput, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@expo/vector-icons";

/**
 * Server Management Screen - Tabbed interface
 * Tab 1: Files - File browser and management
 * Tab 2: Terminal - Server console and commands
 * Tab 3: Config - Server configuration editor
 */

type Tab = "files" | "terminal" | "config";

export default function ServerManagementScreen() {
  const router = useRouter();
  const colors = useColors();
  const params = useLocalSearchParams();
  const serverId = params.id as string;

  const [activeTab, setActiveTab] = useState<Tab>("files");
  const [command, setCommand] = useState("");
  const [logs, setLogs] = useState([
    "[10:30:45] Server started",
    "[10:30:46] Loading world...",
    "[10:30:50] Players can now join",
  ]);

  const handleTabChange = (tab: Tab) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  };

  const handleSendCommand = () => {
    if (command.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setLogs([...logs, `> ${command}`]);
      setCommand("");
    }
  };

  const renderFilesTab = () => (
    <View className="flex-1">
      <View className="bg-surface rounded-lg p-4 mb-4">
        <Text className="text-sm text-muted mb-3">Current Directory: /servers/server1</Text>
        <View className="gap-2">
          {["world", "plugins", "logs", "server.properties", "server.jar"].map((file) => (
            <View key={file} className="flex-row items-center p-3 bg-background rounded-lg">
              <MaterialIcons
                name={file.includes(".") ? "description" : "folder"}
                size={20}
                color={colors.primary}
              />
              <Text className="text-foreground ml-3 flex-1">{file}</Text>
              <MaterialIcons name="more-vert" size={20} color={colors.muted} />
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity className="bg-primary p-4 rounded-lg items-center">
        <Text className="text-background font-semibold">Upload File</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTerminalTab = () => (
    <View className="flex-1">
      <View className="flex-1 bg-background rounded-lg p-4 mb-4 border border-border">
        <FlatList
          data={logs}
          renderItem={({ item }) => (
            <Text className="text-xs text-muted font-mono mb-2">{item}</Text>
          )}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={true}
        />
      </View>
      <View className="flex-row gap-2">
        <TextInput
          placeholder="Enter command..."
          placeholderTextColor={colors.muted}
          value={command}
          onChangeText={setCommand}
          className="flex-1 bg-surface border border-border rounded-lg p-3 text-foreground"
          style={{ color: colors.foreground }}
        />
        <TouchableOpacity
          onPress={handleSendCommand}
          className="bg-primary p-3 rounded-lg items-center justify-center"
        >
          <MaterialIcons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderConfigTab = () => (
    <View className="flex-1">
      <View className="gap-4">
        {[
          { label: "Max Players", value: "20", icon: "people" },
          { label: "Difficulty", value: "Normal", icon: "tune" },
          { label: "Gamemode", value: "Survival", icon: "videogame-asset" },
          { label: "MOTD", value: "Welcome to my server!", icon: "message" },
        ].map((config) => (
          <View key={config.label} className="bg-surface rounded-lg p-4">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name={config.icon as any} size={20} color={colors.primary} />
              <Text className="text-sm text-muted ml-2">{config.label}</Text>
            </View>
            <TextInput
              value={config.value}
              className="bg-background border border-border rounded-lg p-3 text-foreground"
              style={{ color: colors.foreground }}
            />
          </View>
        ))}
        <TouchableOpacity className="bg-primary p-4 rounded-lg items-center mt-4">
          <Text className="text-background font-semibold">Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-2xl font-bold text-foreground">Survival SMP</Text>
          <Text className="text-sm text-success mt-1">● Running</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row gap-2 mb-6 border-b border-border">
        {(["files", "terminal", "config"] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => handleTabChange(tab)}
            className={`flex-1 py-3 items-center border-b-2 ${
              activeTab === tab ? "border-primary" : "border-transparent"
            }`}
          >
            <Text
              className={`font-semibold capitalize ${
                activeTab === tab ? "text-primary" : "text-muted"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView className="flex-1">
        {activeTab === "files" && renderFilesTab()}
        {activeTab === "terminal" && renderTerminalTab()}
        {activeTab === "config" && renderConfigTab()}
      </ScrollView>

      {/* Action Buttons */}
      <View className="flex-row gap-3 pt-6 border-t border-border">
        <TouchableOpacity className="flex-1 bg-error p-4 rounded-lg items-center">
          <Text className="text-background font-semibold">Stop Server</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-success p-4 rounded-lg items-center">
          <Text className="text-background font-semibold">Restart</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
