import { ScrollView, Text, View, TouchableOpacity, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@expo/vector-icons";

/**
 * Server Creation Flow - Multi-step form
 * Step 1: Server name
 * Step 2: Server type selection
 * Step 3: Minecraft version
 * Step 4: RAM allocation
 * Step 5: Root domain selection
 * Step 6: Subdomain name
 * Step 7: Review and create
 */

type ServerType = "PaperMC" | "Fabric" | "Forge" | "Bedrock" | "Vanilla" | "Custom";

const SERVER_TYPES: { label: string; value: ServerType }[] = [
  { label: "PaperMC", value: "PaperMC" },
  { label: "Fabric", value: "Fabric" },
  { label: "Forge", value: "Forge" },
  { label: "Bedrock", value: "Bedrock" },
  { label: "Vanilla", value: "Vanilla" },
  { label: "Custom JAR", value: "Custom" },
];

const MINECRAFT_VERSIONS = ["1.20.4", "1.20.1", "1.19.2", "1.18.2", "1.17.1"];

const ROOT_DOMAINS = [
  "play.kumbidi.net",
  "mc.kumbidi.net",
  "server.kumbidi.net",
];

export default function ServerCreationScreen() {
  const router = useRouter();
  const colors = useColors();
  const [step, setStep] = useState(1);
  const [serverName, setServerName] = useState("");
  const [serverType, setServerType] = useState<ServerType>("PaperMC");
  const [version, setVersion] = useState("1.20.4");
  const [ramAllocation, setRamAllocation] = useState(2048);
  const [rootDomain, setRootDomain] = useState("play.kumbidi.net");
  const [subdomain, setSubdomain] = useState("");

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < 7) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleCreate = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Create server via API
    console.log({
      serverName,
      serverType,
      version,
      ramAllocation,
      rootDomain,
      subdomain,
    });
    router.back();
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return serverName.trim().length > 0;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return true;
      case 6:
        return subdomain.trim().length > 0;
      case 7:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text className="text-2xl font-bold text-foreground mb-2">Server Name</Text>
            <Text className="text-sm text-muted mb-6">
              Choose a name for your Minecraft server
            </Text>
            <TextInput
              placeholder="e.g., Survival SMP"
              placeholderTextColor={colors.muted}
              value={serverName}
              onChangeText={setServerName}
              className="bg-surface border border-border rounded-lg p-4 text-foreground mb-6"
              style={{ color: colors.foreground }}
            />
          </View>
        );

      case 2:
        return (
          <View>
            <Text className="text-2xl font-bold text-foreground mb-2">Server Type</Text>
            <Text className="text-sm text-muted mb-6">Select the server software</Text>
            <View className="gap-3">
              {SERVER_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  onPress={() => {
                    setServerType(type.value);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className={`p-4 rounded-lg border ${
                    serverType === type.value
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      serverType === type.value ? "text-background" : "text-foreground"
                    }`}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 3:
        return (
          <View>
            <Text className="text-2xl font-bold text-foreground mb-2">Minecraft Version</Text>
            <Text className="text-sm text-muted mb-6">Select the version to run</Text>
            <View className="gap-3">
              {MINECRAFT_VERSIONS.map((v) => (
                <TouchableOpacity
                  key={v}
                  onPress={() => {
                    setVersion(v);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className={`p-4 rounded-lg border ${
                    version === v ? "bg-primary border-primary" : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      version === v ? "text-background" : "text-foreground"
                    }`}
                  >
                    {v}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View>
            <Text className="text-2xl font-bold text-foreground mb-2">RAM Allocation</Text>
            <Text className="text-sm text-muted mb-6">
              Allocate memory for your server (MB)
            </Text>
            <View className="bg-surface rounded-lg p-6 mb-6">
              <Text className="text-4xl font-bold text-primary text-center">
                {ramAllocation}
              </Text>
              <Text className="text-center text-muted mt-2">MB</Text>
            </View>
            <View className="gap-3">
              {[512, 1024, 2048, 4096].map((ram) => (
                <TouchableOpacity
                  key={ram}
                  onPress={() => {
                    setRamAllocation(ram);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className={`p-4 rounded-lg border ${
                    ramAllocation === ram
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={`font-semibold text-center ${
                      ramAllocation === ram ? "text-background" : "text-foreground"
                    }`}
                  >
                    {ram} MB
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 5:
        return (
          <View>
            <Text className="text-2xl font-bold text-foreground mb-2">Root Domain</Text>
            <Text className="text-sm text-muted mb-6">
              Select a root domain for your server
            </Text>
            <View className="gap-3">
              {ROOT_DOMAINS.map((domain) => (
                <TouchableOpacity
                  key={domain}
                  onPress={() => {
                    setRootDomain(domain);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className={`p-4 rounded-lg border ${
                    rootDomain === domain
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      rootDomain === domain ? "text-background" : "text-foreground"
                    }`}
                  >
                    {domain}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 6:
        return (
          <View>
            <Text className="text-2xl font-bold text-foreground mb-2">Subdomain</Text>
            <Text className="text-sm text-muted mb-6">
              Choose a subdomain for your server
            </Text>
            <TextInput
              placeholder="e.g., survival"
              placeholderTextColor={colors.muted}
              value={subdomain}
              onChangeText={setSubdomain}
              className="bg-surface border border-border rounded-lg p-4 text-foreground mb-6"
              style={{ color: colors.foreground }}
            />
            <View className="bg-surface rounded-lg p-4">
              <Text className="text-xs text-muted mb-2">Full Address:</Text>
              <Text className="text-lg font-bold text-foreground font-mono">
                {subdomain || "subdomain"}.{rootDomain}
              </Text>
            </View>
          </View>
        );

      case 7:
        return (
          <View>
            <Text className="text-2xl font-bold text-foreground mb-6">Review</Text>
            <View className="bg-surface rounded-lg p-4 gap-4">
              <View className="border-b border-border pb-4">
                <Text className="text-xs text-muted mb-1">Server Name</Text>
                <Text className="text-lg font-semibold text-foreground">{serverName}</Text>
              </View>
              <View className="border-b border-border pb-4">
                <Text className="text-xs text-muted mb-1">Type & Version</Text>
                <Text className="text-lg font-semibold text-foreground">
                  {serverType} {version}
                </Text>
              </View>
              <View className="border-b border-border pb-4">
                <Text className="text-xs text-muted mb-1">RAM Allocation</Text>
                <Text className="text-lg font-semibold text-foreground">
                  {ramAllocation} MB
                </Text>
              </View>
              <View>
                <Text className="text-xs text-muted mb-1">Public Address</Text>
                <Text className="text-lg font-semibold text-foreground font-mono">
                  {subdomain}.{rootDomain}
                </Text>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Header */}
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={handleBack} className="mr-4">
            <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-foreground">Create Server</Text>
            <Text className="text-xs text-muted mt-1">
              Step {step} of 7
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="h-1 bg-border rounded-full mb-8 overflow-hidden">
          <View
            className="h-full bg-primary"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </View>

        {/* Step Content */}
        <View className="flex-1">{renderStep()}</View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View className="flex-row gap-3 pt-6 border-t border-border">
        <TouchableOpacity
          onPress={handleBack}
          className="flex-1 p-4 rounded-lg border border-border items-center"
        >
          <Text className="font-semibold text-foreground">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={step === 7 ? handleCreate : handleNext}
          disabled={!isStepValid()}
          className={`flex-1 p-4 rounded-lg items-center ${
            isStepValid() ? "bg-primary" : "bg-muted opacity-50"
          }`}
        >
          <Text className="font-semibold text-background">
            {step === 7 ? "Create Server" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
