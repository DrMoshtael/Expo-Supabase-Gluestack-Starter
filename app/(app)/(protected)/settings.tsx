import { VStack } from "@/components/ui/vstack"
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button"
import { KeyIcon, LogOutIcon } from "lucide-react-native"
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
		<VStack className="w-full h-full bg-background-0 items-center">
			<VStack className="md:w-1/2 p-4 gap-y-4 pt-24 items-center">
				<Heading className="text-center text-6xl mb-12">Settings</Heading>
				<VStack className="gap-y-4">
					<Button size="md" variant="solid" onPress={handleUpdatePassword} className="justify-start">
						<ButtonIcon as={KeyIcon} />
						<ButtonText>Change password</ButtonText>
					</Button>
					<Button size="md" variant="solid" onPress={handleSignOut} className="justify-start">
						<ButtonIcon as={LogOutIcon} />
						<ButtonText>Sign Out</ButtonText>
					</Button>
				</VStack>
			</VStack>
		</VStack>
	)
}
