import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Sabor do Afeto",
  description: "Painel administrativo",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
