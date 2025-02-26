import React, { useState } from "react"
import { HStack } from "@/components/ui/hstack"
import { VStack } from "@/components/ui/vstack"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { LinkText } from "@/components/ui/link"
import { Link } from "expo-router"
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
import { Button, ButtonText, ButtonIcon, ButtonSpinner } from "@/components/ui/button"
import { Keyboard } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertTriangle } from "lucide-react-native"
import { GoogleIcon } from "@/assets/icons/google"
import { AuthLayout } from "../../components/AuthLayout"
import { useSupabase } from "@/context/supabase-provider"
import { Card } from "@/components/ui/card"

const loginSchema = z.object({
	email: z.string().min(1, "Email is required").email(),
	password: z.string().min(8, "Password is required"),
	// rememberme: z.boolean().optional(),
})

type LoginSchemaType = z.infer<typeof loginSchema>

const LoginWithLeftBackground = () => {
	const { signInWithPassword } = useSupabase()

	const {
		control,
		handleSubmit,
		reset,
		formState: { isSubmitting, errors },
	} = useForm<LoginSchemaType>({
		resolver: zodResolver(loginSchema),
	})
	const [validated, setValidated] = useState(true)
	const [showPassword, setShowPassword] = useState(false)

	const signInWithEmail = async (data: LoginSchemaType) => {
		try {
			await signInWithPassword(data.email, data.password)
			reset()
		} catch (error) {
			console.error(error)
			setValidated(false)
		}
	}

	const toggleShowPassword = () => {
		setShowPassword(!showPassword)
	}

	const handleKeyPress = () => {
		Keyboard.dismiss()
		handleSubmit(signInWithEmail)()
	}

	return (
		<VStack className="max-w-[440px] w-full" space="md">
			<VStack>
				<Heading className="md:text-center mb-3" size="3xl">
					Sign in
				</Heading>
				<Text className="md:text-center mb-3">Sign in to start using this app</Text>
			</VStack>
			<VStack className="w-full">
				<VStack space="xl" className="w-full">
					{!validated && (
						<Card size="sm" variant="filled" className="bg-error-50 border-2 border-error-300">
							<Text className="text-center text-primary-950">Incorrect email or password</Text>
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
										await loginSchema.parseAsync({ email: value })
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
					{/* Label Message */}
					<FormControl isInvalid={!!errors.password} className="w-full">
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
										await loginSchema.parseAsync({ password: value })
										return true
									} catch (error: any) {
										return error.message
									}
								},
							}}
							render={({ field: { onChange, onBlur, value } }) => (
								<Input>
									<InputField
										type={showPassword ? "text" : "password"}
										placeholder="Enter password"
										value={value}
										onChangeText={onChange}
										onBlur={onBlur}
										onSubmitEditing={handleKeyPress}
										returnKeyType="done"
									/>
									<InputSlot onPress={toggleShowPassword} className="pr-3">
										<InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
									</InputSlot>
								</Input>
							)}
						/>
						<FormControlError>
							<FormControlErrorIcon as={AlertTriangle} />
							<FormControlErrorText>{errors?.password?.message}</FormControlErrorText>
						</FormControlError>
					</FormControl>
					<Link href="/forgot-password" asChild>
						<LinkText className="font-medium text-sm text-primary-700 hover:text-blue-800">Forgot Password?</LinkText>
					</Link>
				</VStack>
				<VStack className="w-full my-7 " space="lg">
					<Button className="w-full" disabled={isSubmitting} onPress={handleSubmit(signInWithEmail)}>
						{isSubmitting ? <ButtonSpinner /> : <ButtonText className="font-medium">Log in</ButtonText>}
					</Button>
					<Button
						variant="outline"
						action="secondary"
						className="w-full gap-1"
						disabled={isSubmitting}
						onPress={() => {}}
					>
						<ButtonText className="font-medium">Continue with Google</ButtonText>
						<ButtonIcon as={GoogleIcon} />
					</Button>
				</VStack>
				<HStack className="self-center" space="sm">
					<Text size="md">Don't have an account?</Text>
					<Link href="/sign-up" asChild>
						<LinkText
							className="font-medium text-primary-700 hover:text-blue-800  group-hover/pressed:text-primary-700"
							size="md"
						>
							Sign up
						</LinkText>
					</Link>
				</HStack>
			</VStack>
		</VStack>
	)
}

export default function SignIn() {
	return (
		<AuthLayout>
			<LoginWithLeftBackground />
		</AuthLayout>
	)
}
