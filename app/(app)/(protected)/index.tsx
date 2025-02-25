import { router } from "expo-router"
import { Button, ButtonText } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { Heading } from "@/components/ui/heading"
import { VStack } from "@/components/ui/vstack"

export default function Home() {
	return (
		<VStack className="md:w-1/2 md:items-center md:justify-center">
			<VStack className="p-4 gap-y-4 mt-24">
				<Heading className="text-center text-6xl mb-12">Home</Heading>
				<Text className="text-center">
					You are now authenticated and this session will persist even after closing the app.
				</Text>
				<Button className="w-full" variant="solid" size="md" onPress={() => router.push("/(app)/modal")}>
					<ButtonText>Open Modal</ButtonText>
				</Button>
			</VStack>
		</VStack>
	)
}
