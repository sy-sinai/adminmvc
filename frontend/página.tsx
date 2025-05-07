import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-4xl font-bold mb-8">Sistema de Reseñas</h1>
        <p className="text-xl mb-8">
          Bienvenido al sistema de reseñas donde puedes compartir tus opiniones sobre películas, música y comida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button size="lg">Iniciar Sesión</Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline">
              Registrarse
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
