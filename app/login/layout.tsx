import { connection } from "next/server";

export const instant = false;

export default async function LoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await connection();
  return <>{children}</>;
}
