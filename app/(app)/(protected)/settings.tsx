import { VStack } from "@/components/ui/vstack"
import { Button, ButtonText } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { Heading } from "@/components/ui/heading"
import { useSupabase } from "@/context/supabase-provider"
import { router } from "expo-router"

export default function Settings() {
	const { signOut } = useSupabase()

	const handleSignOut = async () => {
		try {
			await signOut()
		} catch (error) {
			console.error(error)
		}
	}

	const handleUpdatePassword = () => {
		router.push("/(app)/create-password")
	}

	return (
		<VStack>
			<VStack className="p-4 gap-y-4 max-w-2xl mt-24">
				<Heading className="text-center text-6xl mb-12">Settings</Heading>
				<Text className="text-center">Sign out and return to the welcome screen.</Text>
				<Button className="w-full" size="md" variant="solid" onPress={handleUpdatePassword}>
					<ButtonText>Change password</ButtonText>
				</Button>
				<Button className="w-full" size="md" variant="solid" onPress={handleSignOut}>
					<ButtonText>Sign Out</ButtonText>
				</Button>
			</VStack>
		</VStack>
	)
}
