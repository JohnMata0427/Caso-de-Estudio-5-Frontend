import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistema de Gestión de Reservas de Auditorías',
  description:
    'Este sistema permite gestionar las reservas de auditorías, permitiendo a los usuarios reservar una auditoría, ver las auditorías reservadas y cancelarlas.',
  authors: [{ name: 'Jhon Mata', url: 'https://github.com/JohnMata0427' }],
  keywords: 'auditoría, reserva, gestión de reservas, sistema de gestión',
  publisher: 'Vercel',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
