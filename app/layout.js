import './globals.css'

export const metadata = {
  title: 'Mix2Win — Customer Colors',
  description: 'Consulta de pedidos de color — AkzoNobel',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
