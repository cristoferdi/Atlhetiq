export interface Exercise {
  id: string
  name: string
  sets: string
  reps: string
  rest?: string
  media_url: string
  video_url?: string
  instructions?: string[]
}

export interface WorkoutDay {
  day_id: string
  day_name: string
  exercises: Exercise[]
}

export interface WorkoutData {
  id: string
  coachName: string
  clientName: string
  clientGoal?: string
  routineTitle: string
  routine: WorkoutDay[]
}

export const mockWorkoutData: WorkoutData = {
  id: "mock-rutina-001",
  coachName: "Alex Fitness",
  clientName: "Juan Pérez",
  clientGoal: "Aumento de Masa Muscular",
  routineTitle: "Rutina de Fuerza",
  routine: [
    {
      day_id: "d1",
      day_name: "Día 1 - Pecho y Tríceps",
      exercises: [
        {
          id: "ex_001",
          name: "Press de Banca con Barra",
          sets: "4",
          reps: "8 - 10",
          rest: "90s",
          media_url: "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif",
          video_url: "https://www.youtube.com/watch?v=rvsg5V3C4kY",
          instructions: [
            "Acuéstate plano sobre el banco con los pies apoyados en el suelo.",
            "Agarra la barra con las manos ligeramente más anchas que los hombros.",
            "Baja la barra de forma controlada hasta el centro del pecho.",
            "Empuja la barra hacia arriba de forma explosiva."
          ]
        },
        {
          id: "ex_002",
          name: "Extensión de Tríceps en Polea",
          sets: "3",
          reps: "12 - 15",
          rest: "60s",
          media_url: "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
          video_url: "https://vimeo.com/123456789",
          instructions: [
            "Párate frente a la polea alta y agarra la cuerda.",
            "Mantén los codos pegados a las costillas.",
            "Extiende los brazos hacia abajo separando la cuerda al final.",
            "Sube controlando el peso hasta que los antebrazos estén paralelos al suelo."
          ]
        },
        {
          id: "ex_003",
          name: "Ejercicio sin video",
          sets: "3",
          reps: "15",
          rest: "45s",
          media_url: "https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif",
          instructions: []
        }
      ]
    },
    {
      day_id: "d2",
      day_name: "Día 2 - Espalda y Bíceps",
      exercises: []
    }
  ]
}
