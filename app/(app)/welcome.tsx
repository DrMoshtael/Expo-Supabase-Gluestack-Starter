import { useRouter } from "expo-router"
import React from "react"
import { View } from "react-native"

import { Image } from "expo-image"
import { SafeAreaView } from "react-native-safe-area-context"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { Heading } from "@/components/ui/heading"

export default function WelcomeScreen() {
	const router = useRouter()

	return (
		<SafeAreaView className="flex flex-1 bg-background p-4">
			<View className="flex flex-1 items-center justify-center gap-y-4 web:m-4 ">
				<Image
					source={require("@/assets/images/icon.png")}
					className="w-16 h-16 rounded-xl"
				/>
				<Heading className="text-center">
					Welcome to Expo Supabase Starter
				</Heading>
				<Text className="text-center">
					A comprehensive starter project for developing React Native and Expo
					applications with Supabase as the backend.
				</Text>
			</View>
			<View className="flex flex-col gap-y-4 web:m-4">
				<Button
					size="md"
					variant="solid"
					onPress={() => {
						router.push("/sign-up")
					}}
				>
					<Text className="text-white">Sign Up</Text>
				</Button>
				<Button
					size="md"
					variant="solid"
					onPress={() => {
						router.push("/sign-in")
					}}
				>
					<Text className="text-white">Sign In</Text>
				</Button>
			</View>
		</SafeAreaView>
	)
}
