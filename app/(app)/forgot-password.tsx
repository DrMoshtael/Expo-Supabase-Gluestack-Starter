import { VStack } from "@/components/ui/vstack"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import {
	FormControl,
	FormControlError,
	FormControlErrorIcon,
	FormControlErrorText,
	FormControlLabel,
	FormControlLabelText,
} from "@/components/ui/form-control"
import { Input, InputField } from "@/components/ui/input"
import { Button, ButtonText } from "@/components/ui/button"
import { Keyboard } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertTriangle } from "lucide-react-native"
import { AuthLayout } from "@/components/AuthLayout"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { useSupabase } from "@/context/supabase-provider"
import { Spinner } from "@/components/ui/spinner"

const forgotPasswordSchema = z.object({
	email: z.string().min(1, "Email is required").email(),
})

type forgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>

const ForgotPasswordScreen = () => {
	const { forgotPassword } = useSupabase()
	const {
		control,
		handleSubmit,
		reset,
		formState: { isSubmitting, errors },
	} = useForm<forgotPasswordSchemaType>({
		resolver: zodResolver(forgotPasswordSchema),
	})
	const [resetSuccess, setResetSucess] = useState(false)

	const onReset = async (data: forgotPasswordSchemaType) => {
		try {
			await forgotPassword(data.email)
			reset()
			setResetSucess(true)
		} catch (error) {
			console.log(error)
		}
	}

	const handleKeyPress = () => {
		Keyboard.dismiss()
		handleSubmit(onReset)()
	}

	return (
		<VStack className="max-w-[440px] w-full" space="md">
			<VStack>
				<Heading className="md:text-center mb-3" size="3xl">
					Forgot Password?
				</Heading>
				<Text className="text-sm md:text-center mb-3">Enter email ID associated with your account.</Text>
			</VStack>
			<VStack space="xl" className="w-full ">
				{resetSuccess && (
					<Card size="sm" variant="filled" className="bg-success-50 border-2 border-success-300">
						<Text className="text-center text-primary-950">Check your inbox for reset link</Text>
					</Card>
				)}
				<FormControl isInvalid={!!errors?.email} className="w-full">
					<FormControlLabel>
						<FormControlLabelText>Email</FormControlLabelText>
					</FormControlLabel>
					<Controller
						defaultValue=""
						name="email"
						control={control}
						rules={{
							validate: async (value) => {
								try {
									await forgotPasswordSchema.parseAsync({ email: value })
									return true
								} catch (error: any) {
									return error.message
								}
							},
						}}
						render={({ field: { onChange, onBlur, value } }) => (
							<Input>
								<InputField
									placeholder="Enter email"
									value={value}
									onChangeText={onChange}
									onBlur={onBlur}
									onSubmitEditing={handleKeyPress}
									returnKeyType="done"
								/>
							</Input>
						)}
					/>
					<FormControlError>
						<FormControlErrorIcon as={AlertTriangle} />
						<FormControlErrorText>{errors?.email?.message}</FormControlErrorText>
					</FormControlError>
				</FormControl>
				<Button className="w-full" disabled={isSubmitting} onPress={handleSubmit(onReset)}>
					{isSubmitting ? <Spinner /> : <ButtonText className="font-medium">Send Link</ButtonText>}
				</Button>
			</VStack>
		</VStack>
	)
}

export default function ForgotPassword() {
	return (
		<AuthLayout>
			<ForgotPasswordScreen />
		</AuthLayout>
	)
}
