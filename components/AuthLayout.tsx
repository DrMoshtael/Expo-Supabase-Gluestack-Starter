import { HStack } from "@/components/ui/hstack"
import { VStack } from "@/components/ui/vstack"
import { ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Image } from "expo-image"

type AuthLayoutProps = {
	children: React.ReactNode
}

export const AuthLayout = (props: AuthLayoutProps) => {
	return (
		<SafeAreaView className="w-full h-full">
			<ScrollView className="w-full h-full" contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="always">
				<HStack className="w-full h-full bg-background-0 flex-grow justify-center">
					<VStack className="relative hidden md:flex h-full w-full flex-1  items-center  justify-center" space="md">
						<Image
							//   height="100%"
							//   width="100%"
							source={require("@/assets/auth/radialGradient.png")}
							className="object-cover h-full w-full"
							alt="Radial Gradient"
						/>
					</VStack>
					<VStack className="md:items-center md:justify-center flex-1 w-full p-9 md:gap-10 gap-16 md:m-auto md:w-1/2 h-full">
						{props.children}
					</VStack>
				</HStack>
			</ScrollView>
		</SafeAreaView>
	)
}
