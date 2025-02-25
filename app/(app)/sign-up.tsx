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
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "@/components/ui/checkbox"
import { CheckIcon, EyeIcon, EyeOffIcon } from "@/components/ui/icon"
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button"
import { Keyboard } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertTriangle } from "lucide-react-native"
import { GoogleIcon } from "@/assets/icons/google"
import { AuthLayout } from "@/components/AuthLayout"
import { Spinner } from "@/components/ui/spinner"
import { Card } from "@/components/ui/card"
import { useSupabase } from "@/context/supabase-provider"

const signUpSchema = z
	.object({
		email: z.string().min(1, "Email is required").email(),
		password: z
			.string()
			.min(8, "Must be at least 8 characters")
			.max(64, "Must be less than 64 characters")
			.regex(new RegExp(".*[A-Z].*"), "One uppercase character required")
			.regex(new RegExp(".*[a-z].*"), "One lowercase character required")
			.regex(new RegExp(".*\\d.*"), "One number required")
			.regex(new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"), "One special character required"),
		confirmpassword: z
			.string()
			.min(8, "Must be at least 8 characters in length")
			.max(64, "Must be less than 64 characters")
			.regex(new RegExp(".*[A-Z].*"), "One uppercase character")
			.regex(new RegExp(".*[a-z].*"), "One lowercase character")
			.regex(new RegExp(".*\\d.*"), "One number")
			.regex(new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"), "One special character"),
		terms: z.boolean(),
	})
	.refine((data) => data.password === data.confirmpassword, {
		message: "Your passwords do not match.",
		path: ["matchPasswords"],
	})
	.refine((data) => data.terms === true, {
		message: "Acceptance of terms is required",
		path: ["acceptTerms"],
	})
type SignUpSchemaType = z.infer<typeof signUpSchema> & {
	matchPasswords?: {
		message: string
	}
	acceptTerms?: {
		message: string
	}
}

const SignUpWithLeftBackground = () => {
	const { signUp } = useSupabase()
	const {
		control,
		handleSubmit,
		reset,
		trigger,
		formState: { isSubmitting, errors },
	} = useForm<SignUpSchemaType>({
		resolver: zodResolver(signUpSchema),
	})
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [signUpSuccess, setSignUpSuccess] = useState(false)

	const onSignUp = async (data: SignUpSchemaType) => {
		try {
			await signUp(data.email, data.password)
			reset()
			setSignUpSuccess(true)
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
		handleSubmit(onSignUp)()
	}

	return (
		<VStack className="max-w-[440px] w-full" space="md">
			<VStack>
				<Heading className="md:text-center mb-3" size="3xl">
					Sign up
				</Heading>
				<Text className="md:text-center mb-3">Sign up and start using this app</Text>
			</VStack>

			<VStack className="w-full">
				<VStack space="xl" className="w-full">
					{errors.matchPasswords && (
						<Card size="sm" variant="filled" className="bg-error-50 border-2 border-error-300">
							<Text className="text-center text-primary-950">Passwords don't match</Text>
						</Card>
					)}
					{signUpSuccess && (
						<Card size="sm" variant="filled" className="bg-success-50 border-2 border-success-300">
							<Text className="text-center text-primary-950">Check your inbox to complete sign-up</Text>
						</Card>
					)}
					<FormControl isInvalid={!!errors.email}>
						<FormControlLabel>
							<FormControlLabelText>Email</FormControlLabelText>
						</FormControlLabel>
						<Controller
							name="email"
							defaultValue=""
							control={control}
							rules={{
								validate: async (value) => {
									try {
										await signUpSchema.parseAsync({ email: value })
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
										placeholder="Email"
										type="text"
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
							<FormControlErrorIcon size="md" as={AlertTriangle} />
							<FormControlErrorText>{errors?.email?.message}</FormControlErrorText>
						</FormControlError>
					</FormControl>
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
										await signUpSchema.parseAsync({
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
										await signUpSchema.parseAsync({
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
					<FormControl isInvalid={!!errors.acceptTerms}>
						<Controller
							name="terms"
							defaultValue={false}
							control={control}
							render={({ field: { onChange, value } }) => (
								<Checkbox
									size="sm"
									value="Terms"
									isChecked={value}
									onChange={(checked) => {
										onChange(checked, { shouldValidate: true })
										trigger("acceptTerms")
									}}
									aria-label="Terms of use"
								>
									<CheckboxIndicator>
										<CheckboxIcon as={CheckIcon} />
									</CheckboxIndicator>
									<CheckboxLabel>I accept the Terms of Use & Privacy Policy</CheckboxLabel>
								</Checkbox>
							)}
						/>
						<FormControlError>
							<FormControlErrorIcon size="sm" as={AlertTriangle} />
							<FormControlErrorText>{`${errors?.acceptTerms?.message}`}</FormControlErrorText>
						</FormControlError>
					</FormControl>
				</VStack>

				<VStack className="w-full my-7" space="lg">
					<Button className="w-full" disabled={isSubmitting} onPress={handleSubmit(onSignUp)}>
						{isSubmitting ? <Spinner /> : <ButtonText className="font-medium">Sign up</ButtonText>}
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
					<Text size="md">Already have an account?</Text>
					<Link href="/sign-in" asChild>
						<LinkText
							className="font-medium text-primary-700 group-hover/link:text-primary-600 group-hover/pressed:text-primary-700"
							size="md"
						>
							Login
						</LinkText>
					</Link>
				</HStack>
			</VStack>
		</VStack>
	)
}

export default function SignUp() {
	return (
		<AuthLayout>
			<SignUpWithLeftBackground />
		</AuthLayout>
	)
}
