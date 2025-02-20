import { View } from "react-native"

import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"

export default function Modal() {
	return (
		<View className="flex flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<Heading className="text-center">Modal</Heading>
			<Text className="text-center">This is a modal screen.</Text>
		</View>
	)
}
