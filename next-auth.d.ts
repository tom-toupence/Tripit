import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: string | null;
    };
  }
  interface JWT {
    user: {
        id: string;
        name: string;
        email: string;
        image?: string;
        provider?: string;
    };
}
}
