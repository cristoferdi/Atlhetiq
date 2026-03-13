export interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  rest: string
  media_url: string
  instructions: string[]
}

export interface WorkoutDay {
  day_id: string
  day_name: string
  exercises: Exercise[]
}

export interface WorkoutData {
  coach: {
    name: string
  }
  client: {
    name: string
    goal: string
  }
  routine: WorkoutDay[]
}

export const mockWorkoutData: WorkoutData = {
  coach: {
    name: "Alex Fitness"
  },
  client: {
    name: "Juan Pérez",
    goal: "Aumento de Masa Muscular"
  },
  routine: [
    {
      day_id: "d1",
      day_name: "Día 1 - Pecho y Tríceps",
      exercises: [
        {
          id: "ex_001",
          name: "Press de Banca con Barra",
          sets: 4,
          reps: "8 - 10",
          rest: "90s",
          media_url: "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif",
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
          sets: 3,
          reps: "12 - 15",
          rest: "60s",
          media_url: "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
          instructions: [
            "Párate frente a la polea alta y agarra la cuerda.",
            "Mantén los codos pegados a las costillas.",
            "Extiende los brazos hacia abajo separando la cuerda al final.",
            "Sube controlando el peso hasta que los antebrazos estén paralelos al suelo."
          ]
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
