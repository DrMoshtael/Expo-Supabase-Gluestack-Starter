import { VStack } from "@/components/ui/vstack"
import { Button, ButtonText } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { GluestackIcon, GluestackIconDark } from "@/assets/icons/gluestack-icon"
import { useColorScheme } from "@/components/useColorScheme"
import { router } from "expo-router"
import { AuthLayout } from "@/components/AuthLayout"

const SplashScreenWithLeftBackground = () => {
	const { colorScheme } = useColorScheme()


	return (
		<VStack className="w-full max-w-[440px] items-center h-full justify-center" space="lg">
			{colorScheme === "dark" ? (
				<Icon as={GluestackIconDark} className="w-[219px] h-10" />
			) : (
				<Icon as={GluestackIcon} className="w-[219px] h-10" />
			)}
			<VStack className="w-full" space="lg">
				<Button
					className="w-full"
					onPress={() => {
						router.push("/sign-in")
					}}
				>
					<ButtonText className="font-medium">Log in</ButtonText>
				</Button>
				<Button
					onPress={() => {
						router.push("/sign-up")
					}}
				>
					<ButtonText className="font-medium">Sign Up</ButtonText>
				</Button>
			</VStack>
		</VStack>
	)
}

export default function SplashScreen() {
	return (
		<AuthLayout>
			<SplashScreenWithLeftBackground />
		</AuthLayout>
	)
}
