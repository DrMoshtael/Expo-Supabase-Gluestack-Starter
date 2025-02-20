import { Toast, ToastTitle, useToast } from "@/components/ui/toast"
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

const forgotPasswordSchema = z.object({
	email: z.string().min(1, "Email is required").email(),
})

type forgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>

const ForgotPasswordScreen = () => {
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<forgotPasswordSchemaType>({
		resolver: zodResolver(forgotPasswordSchema),
	})
	const toast = useToast()

	const onSubmit = (_data: forgotPasswordSchemaType) => {
		toast.show({
			placement: "bottom right",
			render: ({ id }) => {
				return (
					<Toast nativeID={id} variant="solid" action="success">
						<ToastTitle>Link Sent Successfully</ToastTitle>
					</Toast>
				)
			},
		})
		reset()
	}

	const handleKeyPress = () => {
		Keyboard.dismiss()
		handleSubmit(onSubmit)()
	}

	return (
		<VStack className="max-w-[440px] w-full" space="md">
				<VStack>
					<Heading className="md:text-center" size="3xl">
						Forgot Password?
					</Heading>
					<Text className="text-sm">
						Enter email ID associated with your account.
					</Text>
				</VStack>
			<VStack space="xl" className="w-full ">
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
						<FormControlErrorText>
							{errors?.email?.message}
						</FormControlErrorText>
					</FormControlError>
				</FormControl>
				<Button className="w-full" onPress={handleSubmit(onSubmit)}>
					<ButtonText className="font-medium">Send Link</ButtonText>
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
