import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AthletiQ - Rutina de Ejercicios',
  description: 'Tu rutina de ejercicios personalizada',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
