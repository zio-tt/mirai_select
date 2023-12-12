import NextAuth from "next-auth";
import { options } from "@/app/_features/auth/auth";

const handler = NextAuth(options);

export {handler as GET,handler as POST}