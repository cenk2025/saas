import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    // Use Supabase Auth to verify credentials
                    const supabase = createClient(supabaseUrl, supabaseServiceKey);

                    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                        email: credentials.email,
                        password: credentials.password,
                    });

                    if (authError || !authData.user) {
                        console.error("Auth error:", authError);
                        return null;
                    }

                    // Get user details from our users table
                    const { data: userData, error: userError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', authData.user.id)
                        .single();

                    if (userError || !userData) {
                        // If user doesn't exist in users table, create one with default role
                        const { data: newUser, error: createError } = await supabase
                            .from('users')
                            .insert({
                                id: authData.user.id,
                                email: authData.user.email!,
                                name: authData.user.user_metadata?.name || authData.user.email?.split('@')[0],
                                role: 'ADMIN', // Default role
                            })
                            .select()
                            .single();

                        if (createError || !newUser) {
                            console.error("Error creating user:", createError);
                            return null;
                        }

                        return {
                            id: newUser.id,
                            email: newUser.email,
                            name: newUser.name,
                            role: newUser.role,
                        };
                    }

                    return {
                        id: userData.id,
                        email: userData.email,
                        name: userData.name,
                        role: userData.role,
                    };
                } catch (error) {
                    console.error("Authorization error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role;
                session.user.id = token.id;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
    },
};
