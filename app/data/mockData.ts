export interface SubExercise {
  exercise_id: string
  name: string
  gif_url: string
  video_url?: string
  instructions?: string[]
}

export interface Block {
  id: string
  _combined: boolean
  series: string
  reps: string
  rest_time: string
  indications?: string | null
  sub_exercises: SubExercise[]
}

export interface WorkoutDay {
  day_id: string
  day_name: string
  blocks: Block[]
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
      blocks: [
        {
          id: "block-001",
          _combined: true,
          series: "4",
          reps: "8 - 10",
          rest_time: "90s",
          indications: "Alternar los ejercicios:\n- Serie 1: Press de banca\n- Serie 2: Press inclinado",
          sub_exercises: [
            {
              exercise_id: "ex_001",
              name: "Press de Banca con Barra",
              gif_url: "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif",
              video_url: "https://www.youtube.com/watch?v=rvsg5V3C4kY",
              instructions: [
                "Acuéstate plano sobre el banco con los pies apoyados en el suelo.",
                "Agarra la barra con las manos ligeramente más anchas que los hombros.",
                "Baja la barra de forma controlada hasta el centro del pecho.",
                "Empuja la barra hacia arriba de forma explosiva."
              ]
            },
            {
              exercise_id: "ex_002",
              name: "Press Inclinado con Mancuernas",
              gif_url: "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
              video_url: "https://vimeo.com/123456789",
              instructions: [
                "Ajusta el banco a 30-45 grados.",
                "Agarra las mancuernas y extensión completa arriba.",
                "Baja las mancuernas controladamente hasta el pecho.",
                "Empuja hacia arriba."
              ]
            }
          ]
        },
        {
          id: "block-002",
          _combined: false,
          series: "3",
          reps: "12 - 15",
          rest_time: "60s",
          indications: null,
          sub_exercises: [
            {
              exercise_id: "ex_003",
              name: "Extensión de Tríceps en Polea",
              gif_url: "https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif",
              video_url: "https://vimeo.com/987654321",
              instructions: [
                "Párate frente a la polea alta y agarra la cuerda.",
                "Mantén los codos pegados a las costillas.",
                "Extiende los brazos hacia abajo.",
                "Sube controlando el peso."
              ]
            }
          ]
        }
      ]
    },
    {
      day_id: "d2",
      day_name: "Día 2 - Espalda y Bíceps",
      blocks: []
    }
  ]
}