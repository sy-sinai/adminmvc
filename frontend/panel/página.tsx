"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface Review {
  _id: string
  title: string
  content: string
  rating: number
  movie: {
    _id: string
    title: string
  }
  user: {
    _id: string
    name: string
  }
  createdAt: string
}

export default function Dashboard() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    fetchReviews()
  }, [router])

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Error al cargar reseñas")
      }

      const data = await response.json()
      setReviews(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las reseñas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/reviews/new">
            <Button>Nueva Reseña</Button>
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review._id}>
              <CardHeader>
                <CardTitle>{review.title}</CardTitle>
                <CardDescription>
                  Película: {review.movie.title} | Calificación: {review.rating}/5
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">{review.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">Por: {review.user.name}</p>
                <p className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No hay reseñas disponibles</p>
            <Link href="/reviews/new" className="mt-4 inline-block">
              <Button>Crear tu primera reseña</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
