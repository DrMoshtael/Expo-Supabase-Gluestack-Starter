import { Session, User } from "@supabase/supabase-js"
import { useRouter, SplashScreen } from "expo-router"
import { createContext, useContext, useEffect, useState } from "react"

import { supabase } from "@/utils/supabase"

SplashScreen.preventAutoHideAsync()

type SupabaseContextProps = {
	user: User | null
	session: Session | null
	initialized?: boolean
	signUp: (email: string, password: string) => Promise<void>
	signInWithPassword: (email: string, password: string) => Promise<void>
	signOut: () => Promise<void>
	forgotPassword: (email: string) => Promise<void>
	updatePassword: (password: string) => Promise<void>
}

type SupabaseProviderProps = {
	children: React.ReactNode
}

export const SupabaseContext = createContext<SupabaseContextProps>({
	user: null,
	session: null,
	initialized: false,
	signUp: async () => {},
	signInWithPassword: async () => {},
	signOut: async () => {},
	forgotPassword: async () => {},
	updatePassword: async () => {},
})

export const useSupabase = () => useContext(SupabaseContext)

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
	const router = useRouter()
	const [user, setUser] = useState<User | null>(null)
	const [session, setSession] = useState<Session | null>(null)
	const [initialized, setInitialized] = useState<boolean>(false)

	useEffect(() => {
		const getSession = async () => {
			await supabase.auth.refreshSession()
			const {
				data: { session },
			} = await supabase.auth.getSession()
			setSession(session)
			setUser(session?.user || null)
			setInitialized(true)
		}

		getSession()

		const { data } = supabase.auth.onAuthStateChange((event, session) => {
			setSession(session)
			setUser(session?.user || null)
			if (event === "PASSWORD_RECOVERY" || event === "SIGNED_OUT") {
				router.replace("/(app)/welcome")
			}
		})

		return () => {
			data?.subscription?.unsubscribe()
		}
	}, [router])

	const signUp = async (email: string, password: string) => {
		const { error } = await supabase.auth.signUp({
			email,
			password,
		})
		if (error) {
			throw error
		}
	}

	const signInWithPassword = async (email: string, password: string) => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		})
		if (error) {
			throw error
		}
		router.replace("/(app)/(protected)")
	}

	const signOut = async () => {
		const { error } = await supabase.auth.signOut()
		if (error) {
			if (error.name === "AuthSessionMissingError") {
				setSession(null)
				setUser(null)
				router.replace("/(app)/welcome")
			} else {
				throw error
			}
		}
	}

	const forgotPassword = async (email: string) => {
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: "http://localhost:8081/create-password",
		})
		if (error) {
			throw error
		}
	}

	const updatePassword = async (password: string) => {
		// //Extract access token from URL
		// const hashParams = new URLSearchParams(window.location.hash.substring(1))
		// const access_token = hashParams.get("access_token")
		// const refresh_token = hashParams.get("refresh_token")

		// if (access_token && refresh_token) {
		// 	//Set the session
		// 	const { error } = await supabase.auth.setSession({
		// 		access_token,
		// 		refresh_token,
		// 	})
		// 	if (error) {
		// 		console.error("Error setting session", error.message)
		// 		throw error
		// 	}
		// }
		//Update password
		const { error } = await supabase.auth.updateUser({
			password,
		})
		if (error) {
			console.error("Error updating password", error.message)
			throw error
		}
	}

	return (
		<SupabaseContext.Provider
			value={{
				user,
				session,
				initialized,
				signUp,
				signInWithPassword,
				signOut,
				forgotPassword,
				updatePassword,
			}}
		>
			{children}
		</SupabaseContext.Provider>
	)
}
