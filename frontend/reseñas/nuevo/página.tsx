"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface Movie {
  _id: string
  title: string
}

export default function NewReview() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    rating: "5",
    movieId: "",
  })
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingMovies, setFetchingMovies] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    fetchMovies()
  }, [router])

  const fetchMovies = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Error al cargar películas")
      }

      const data = await response.json()
      setMovies(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las películas",
        variant: "destructive",
      })
    } finally {
      setFetchingMovies(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al crear reseña")
      }

      toast({
        title: "Reseña creada",
        description: "Tu reseña ha sido publicada correctamente",
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetchingMovies) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Nueva Reseña</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título de la reseña</Label>
          <Input id="title" name="title" required value={formData.title} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="movieId">Película</Label>
          <Select value={formData.movieId} onValueChange={(value) => handleSelectChange("movieId", value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una película" />
            </SelectTrigger>
            <SelectContent>
              {movies.map((movie) => (
                <SelectItem key={movie._id} value={movie._id}>
                  {movie.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">Calificación</Label>
          <Select value={formData.rating} onValueChange={(value) => handleSelectChange("rating", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una calificación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Muy mala</SelectItem>
              <SelectItem value="2">2 - Mala</SelectItem>
              <SelectItem value="3">3 - Regular</SelectItem>
              <SelectItem value="4">4 - Buena</SelectItem>
              <SelectItem value="5">5 - Excelente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Contenido</Label>
          <Textarea id="content" name="content" rows={6} required value={formData.content} onChange={handleChange} />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Publicar Reseña"}
          </Button>
        </div>
      </form>
    </div>
  )
}
