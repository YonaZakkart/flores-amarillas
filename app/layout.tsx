import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tus Flores Amarillas 🌻",
  description: "Un jardín interactivo de flores amarillas animadas hecho con Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}