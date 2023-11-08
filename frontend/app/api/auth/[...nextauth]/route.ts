import NextAuth from "next-auth";
import { options } from "@/app/_common/constants/auth";

const handler = NextAuth(options);

export {handler as GET,handler as POST}