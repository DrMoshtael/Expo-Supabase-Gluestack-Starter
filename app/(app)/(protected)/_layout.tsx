import { Tabs, Redirect, useSegments, SplashScreen, router } from "expo-router"
import React from "react"
import { useColorScheme } from "@/components/useColorScheme"
import { useSupabase } from "@/context/supabase-provider"
import { Button, ButtonIcon } from "@/components/ui/button"
import { MoonIcon, SettingsIcon } from "@/components/ui/icon"
import { HomeIcon } from "lucide-react-native"
import { Icon } from "@/components/ui/icon"

export default function ProtectedLayout() {
	const { session, initialized } = useSupabase()
	const segments = useSegments()
	const { colorScheme, toggleColorScheme } = useColorScheme()

	if (!initialized) {
		SplashScreen.preventAutoHideAsync();
		return null; // Render nothing while loading (keeps splash screen visible)
	}

	const inWelcomePage = segments[1] === "welcome"

	if (!session && !inWelcomePage) {
		return <Redirect href="/(app)/welcome" />
	}

	const headerRightButton = () => (
		<Button className="rounded-full bg-transparent" size="lg" onPress={() => toggleColorScheme()}>
			<ButtonIcon as={MoonIcon} className="color-primary-950" />
		</Button>
	)

	return (
		<Tabs
			screenOptions={{
				headerShown: true,
				tabBarShowLabel: false,
				headerRight: headerRightButton,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => <Icon as={HomeIcon} size="xl" color={color}/>,
					tabBarShowLabel: true
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "Settings",
					tabBarIcon: ({ color }) => <Icon as={SettingsIcon} size="xl" color={color} />,
					tabBarShowLabel: true
				}} />
		</Tabs>
	)
}
