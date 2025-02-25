import { useState } from "react"
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
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon"
import { Button, ButtonText } from "@/components/ui/button"
import { Keyboard } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertTriangle } from "lucide-react-native"
import { AuthLayout } from "@/components/AuthLayout"
import { useSupabase } from "@/context/supabase-provider"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { LinkText } from "@/components/ui/link"
import { Link } from "expo-router"

const createPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, "Must be at least 8 characters in length")
			.max(64, "Must be less than 64 characters")
			.regex(new RegExp(".*[A-Z].*"), "One uppercase character")
			.regex(new RegExp(".*[a-z].*"), "One lowercase character")
			.regex(new RegExp(".*\\d.*"), "One number")
			.regex(new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"), "One special character"),
		confirmpassword: z
			.string()
			.min(8, "Must be at least 8 characters in length")
			.max(64, "Must be less than 64 characters")
			.regex(new RegExp(".*[A-Z].*"), "One uppercase character")
			.regex(new RegExp(".*[a-z].*"), "One lowercase character")
			.regex(new RegExp(".*\\d.*"), "One number")
			.regex(new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"), "One special character"),
	})
	.refine((data) => data.password === data.confirmpassword, {
		message: "Your passwords do not match.",
		path: ["matchPasswords"],
	})

type CreatePasswordSchemaType = z.infer<typeof createPasswordSchema> & {
	matchPasswords?: {
		message: string
	}
}

const CreatePasswordWithLeftBackground = () => {
	const { updatePassword } = useSupabase()
	const {
		control,
		handleSubmit,
		reset,

		formState: { isSubmitting, errors },
	} = useForm<CreatePasswordSchemaType>({
		resolver: zodResolver(createPasswordSchema),
	})
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [updateSucess, setUpdateSucess] = useState(false)

	const onUpdate = async (data: CreatePasswordSchemaType) => {
		try {
			await updatePassword(data.password)
			reset()
			setUpdateSucess(true)
		} catch (error) {
			console.log(error)
		}
	}

	const toggleShowPassword = () => {
		setShowPassword(!showPassword)
	}
	const toggleShowConfirmPassword = () => {
		setShowConfirmPassword(!showConfirmPassword)
	}

	const handleKeyPress = () => {
		Keyboard.dismiss()
		handleSubmit(onUpdate)()
	}

	return (
		<VStack className="max-w-[440px] w-full" space="md">
			<VStack>
				<Heading className="md:text-center mb-3" size="3xl">
					Create new password
				</Heading>
				<Text className="md:text-center mb-3">Your new password must be different from previously used passwords </Text>
			</VStack>
			<VStack className="w-full">
				<VStack space="xl" className="w-full">
					{errors.matchPasswords && (
						<Card size="sm" variant="filled" className="bg-error-50 border-2 border-error-300">
							<Text className="text-center text-primary-950">Passwords don't match</Text>
						</Card>
					)}
					{updateSucess && (
						<Card size="sm" variant="filled" className="bg-success-50 border-2 border-success-300">
							<Text className="text-center text-primary-950">
								Password updated. You can now access your{" "}
								<Link href="/(app)/(protected)" asChild>
									<LinkText
										className="text-primary-950 hover:text-blue-800 group-hover/pressed:text-primary-700"
										size="md"
									>
										dashboard
									</LinkText>
								</Link>
								.
							</Text>
						</Card>
					)}
					<FormControl isInvalid={!!errors.password}>
						<FormControlLabel>
							<FormControlLabelText>Password</FormControlLabelText>
						</FormControlLabel>
						<Controller
							defaultValue=""
							name="password"
							control={control}
							rules={{
								validate: async (value) => {
									try {
										await createPasswordSchema.parseAsync({
											password: value,
										})
										return true
									} catch (error: any) {
										return error.message
									}
								},
							}}
							render={({ field: { onChange, onBlur, value } }) => (
								<Input>
									<InputField
										className="text-sm"
										placeholder="Password"
										value={value}
										onChangeText={onChange}
										onBlur={onBlur}
										onSubmitEditing={handleKeyPress}
										returnKeyType="done"
										type={showPassword ? "text" : "password"}
									/>
									<InputSlot onPress={toggleShowPassword} className="pr-3">
										<InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
									</InputSlot>
								</Input>
							)}
						/>
						<FormControlError>
							<FormControlErrorIcon size="sm" as={AlertTriangle} />
							<FormControlErrorText>{errors?.password?.message}</FormControlErrorText>
						</FormControlError>
					</FormControl>
					<FormControl isInvalid={!!errors.confirmpassword}>
						<FormControlLabel>
							<FormControlLabelText>Confirm Password</FormControlLabelText>
						</FormControlLabel>
						<Controller
							defaultValue=""
							name="confirmpassword"
							control={control}
							rules={{
								validate: async (value) => {
									try {
										await createPasswordSchema.parseAsync({
											password: value,
										})
										return true
									} catch (error: any) {
										return error.message
									}
								},
							}}
							render={({ field: { onChange, onBlur, value } }) => (
								<Input>
									<InputField
										placeholder="Confirm Password"
										className="text-sm"
										value={value}
										onChangeText={onChange}
										onBlur={onBlur}
										onSubmitEditing={handleKeyPress}
										returnKeyType="done"
										type={showConfirmPassword ? "text" : "password"}
									/>

									<InputSlot onPress={toggleShowConfirmPassword} className="pr-3">
										<InputIcon as={showConfirmPassword ? EyeIcon : EyeOffIcon} />
									</InputSlot>
								</Input>
							)}
						/>
						<FormControlError>
							<FormControlErrorIcon size="sm" as={AlertTriangle} />
							<FormControlErrorText>{errors?.confirmpassword?.message}</FormControlErrorText>
						</FormControlError>
					</FormControl>
				</VStack>
				<VStack className="mt-7 w-full">
					<Button className="w-full" disabled={isSubmitting} onPress={handleSubmit(onUpdate)}>
						{isSubmitting ? <Spinner /> : <ButtonText className="font-medium">Update Password</ButtonText>}
					</Button>
				</VStack>
			</VStack>
		</VStack>
	)
}

export default function CreatePassword() {
	return (
		<AuthLayout>
			<CreatePasswordWithLeftBackground />
		</AuthLayout>
	)
}
