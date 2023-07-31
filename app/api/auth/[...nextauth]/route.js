import NextAuth from "next-auth/next";
import GitHubProvider from 'next-auth/providers/github';

import User from "@models/user";
import { connectToDB } from "@utils/database";

const handler = NextAuth({
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        })
    ],
    callbacks: {
        async session({ session }){
            console.log('in session');
            try {
                await connectToDB();
                const sessionUser = await User.findOne({
                    email: session.user.email
                });
                /* 以下为新增 */
                if (!sessionUser) {
                    // Create a new user if one doesn't exist
                    console.log('will create new user.')
                    const newUser = await User.create({
                        email: session.user.email,
                        username: session.user.name.replace(" ","").toLowerCase(),
                        image: session.user.picture
                    });
                    session.user.id = newUser._id.toString();
                } else {
                    session.user.id = sessionUser._id.toString();
                }
                /* 结束 */
            } catch(error) {
                console.log('error in session callback:',error);
            }         
            
            return session;
        },
        async SignIn({ profile }) {
            console.log('in sign in');
            try {
                await connectToDB();
                // check if a user already exists.
                const userExists = await User.findOne({
                    email: profile.email,
                });
                // if not create a new user.
                if (!userExists) {
                    await User.create({
                        email: profile.email,
                        username: profile.name.replace(" ","").toLowerCase(),
                        image: profile.picture
                    })
                }
                return true;
            } catch (error) {
                console.log("Error in SignIn callback:",error);
                return false;
            } 
        } 
    },
});

export { handler as GET, handler as POST };