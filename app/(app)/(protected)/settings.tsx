import { View } from "react-native"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { Heading } from "@/components/ui/heading"
import { useSupabase } from "@/context/supabase-provider"

export default function Settings() {
	const { signOut } = useSupabase()

	return (
		<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<Heading className="text-center">Sign Out</Heading>
			<Text className="text-center">
				Sign out and return to the welcome screen.
			</Text>
			<Button className="w-full" size="md" variant="solid" onPress={signOut}>
				<Text>Sign Out</Text>
			</Button>
		</View>
	)
}
