import { router } from "expo-router"
import { Button, ButtonText } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { Heading } from "@/components/ui/heading"
import { VStack } from "@/components/ui/vstack"

export default function Home() {
	return (
		<VStack className="w-full h-full bg-background-0 items-center">
			<VStack className="md:w-1/2 p-4 gap-y-4 pt-24 items-center">
				<Heading className="text-center text-6xl mb-12">Home</Heading>
				<Text className="text-center">
					You are now authenticated and this session will persist even after closing the app.
				</Text>
				<Button variant="solid" size="md" onPress={() => router.push("/(app)/modal")}>
					<ButtonText>Open Modal</ButtonText>
				</Button>
			</VStack>
		</VStack>
	)
}
