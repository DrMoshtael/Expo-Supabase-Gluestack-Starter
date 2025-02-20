import { router } from "expo-router"
import { View } from "react-native"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { Heading } from "@/components/ui/heading"

export default function Home() {
	return (
		<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<Heading className="text-center">Home</Heading>
			<Text className="text-center">
				You are now authenticated and this session will persist even after
				closing the app.
			</Text>
			<Button
				className="w-full"
				variant="solid"
				size="md"
				onPress={() => router.push("/(app)/modal")}
			>
				<Text>Open Modal</Text>
			</Button>
		</View>
	)
}
