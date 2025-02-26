import FontAwesome from "@expo/vector-icons/FontAwesome"
import "@/global.css"
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider"
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native"
import { useFonts } from "expo-font"
import { Stack, Redirect, useSegments } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import "react-native-reanimated"
import { useColorScheme } from "@/components/useColorScheme"
import { useSupabase } from "@/context/supabase-provider"

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router"

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: "(app)",
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	const segments = useSegments()
	const { session } = useSupabase()
	const [loaded, error] = useFonts({
		SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	})

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error
	}, [error])

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync()
		}
	}, [loaded])

	if (!loaded) {
		return null
	} 

	//Make sure we don't get stuck on the welcome page if we're logged in
	const inWelcomePage = segments[1] === "welcome"
	if (session && inWelcomePage) {
		return <Redirect href="/(app)/(protected)" />
	}

	//Make sure we don't get stuck on the welcome page if we're logged in
	const inWelcomePage = segments[1] === "welcome"
	if (session && inWelcomePage) {
		return <Redirect href="/(app)/(protected)" />
	}

	return (
		<GluestackUIProvider mode="system">
			<RootLayoutNav />
		</GluestackUIProvider>
	)
}

function RootLayoutNav() {
	const { colorScheme } = useColorScheme()

	return (
		<GluestackUIProvider mode="system">
			<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
				<Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
					<Stack.Screen name="(protected)" />
					<Stack.Screen name="welcome" />
					<Stack.Screen
						name="sign-up"
						options={{
							presentation: "modal",
							headerShown: true,
							headerTitle: "Sign Up",
							gestureEnabled: true,
						}}
					/>
					<Stack.Screen
						name="sign-in"
						options={{
							presentation: "modal",
							headerShown: true,
							headerTitle: "Sign In",
							gestureEnabled: true,
						}}
					/>
					<Stack.Screen
						name="forgot-password"
						options={{
							presentation: "modal",
							headerShown: true,
							headerTitle: "Forgot Password",
							gestureEnabled: true,
						}}
					/>
					<Stack.Screen
						name="create-password"
						options={{
							presentation: "modal",
							headerShown: false,
							headerTitle: "Create Password",
							gestureEnabled: true,
						}}
					/>
					<Stack.Screen
						name="modal"
						options={{
							presentation: "modal",
							headerShown: true,
							headerTitle: "Modal",
							gestureEnabled: true,
						}}
					/>
				</Stack>
			</ThemeProvider>
		</GluestackUIProvider>
	)
}
