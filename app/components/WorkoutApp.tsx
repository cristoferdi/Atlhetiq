'use client'

import { useState, useEffect } from 'react'
import { getRutina, getAllRoutines } from '../../lib/firebase'
import { Exercise, WorkoutDay, WorkoutData } from '../data/mockData'
import VideoEmbed, { VideoLink } from './VideoEmbed'

function ExerciseCard({ exercise, index, onClick }: { exercise: Exercise; index: number; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 text-left hover:shadow-md transition-shadow"
    >
      <div className="p-4 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold flex items-center justify-center">
            {index + 1}
          </span>
          <h3 className="text-lg font-semibold text-gray-800 flex-1">{exercise.name}</h3>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        
        <div className="mb-3">
          <VideoEmbed 
            videoUrl={exercise.video_url} 
            mediaUrl={exercise.media_url} 
            alt={exercise.name}
            showPlayButton={false}
          />
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1 bg-blue-50 rounded-lg p-2 text-center">
            <p className="text-xs text-blue-600 font-medium uppercase">Sets</p>
            <p className="text-lg font-bold text-blue-700">{exercise.sets}</p>
          </div>
          <div className="flex-1 bg-emerald-50 rounded-lg p-2 text-center">
            <p className="text-xs text-emerald-600 font-medium uppercase">Reps</p>
            <p className="text-lg font-bold text-emerald-700">{exercise.reps}</p>
          </div>
          <div className="flex-1 bg-amber-50 rounded-lg p-2 text-center">
            <p className="text-xs text-amber-600 font-medium uppercase">Descanso</p>
            <p className="text-lg font-bold text-amber-700">{exercise.rest || '-'}</p>
          </div>
        </div>
      </div>
    </button>
  )
}

function InstructionsModal({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-md min-h-full overflow-hidden animate-slide-up pt-4 pb-8">
        <div className="px-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">{exercise.name}</h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-4">
            <VideoEmbed 
              videoUrl={exercise.video_url} 
              mediaUrl={exercise.media_url} 
              alt={exercise.name}
            />
          </div>
          
          {exercise.video_url && (
            <div className="mb-4">
              <VideoLink videoUrl={exercise.video_url} />
            </div>
          )}
          
          <div className="flex gap-2 mb-4">
            <div className="flex-1 bg-blue-50 rounded-lg p-2 text-center">
              <p className="text-xs text-blue-600 font-medium uppercase">Sets</p>
              <p className="text-lg font-bold text-blue-700">{exercise.sets}</p>
            </div>
            <div className="flex-1 bg-emerald-50 rounded-lg p-2 text-center">
              <p className="text-xs text-emerald-600 font-medium uppercase">Reps</p>
              <p className="text-lg font-bold text-emerald-700">{exercise.reps}</p>
            </div>
            <div className="flex-1 bg-amber-50 rounded-lg p-2 text-center">
              <p className="text-xs text-amber-600 font-medium uppercase">Descanso</p>
              <p className="text-lg font-bold text-amber-700">{exercise.rest || '-'}</p>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Instrucciones</h3>
          <div className="space-y-3 pb-4">
            {exercise.instructions && exercise.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-medium flex items-center justify-center">
                  {index + 1}
                </span>
                <p className="text-gray-600 text-sm leading-relaxed">{instruction}</p>
              </div>
            ))}
            {(!exercise.instructions || exercise.instructions.length === 0) && (
              <p className="text-gray-400 text-sm">No hay instrucciones disponibles</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface FirestoreRoutine {
  id: string
  coachName: string
  clientName: string
  clientGoal?: string
  routineTitle: string
  routine: WorkoutDay[]
}

export default function WorkoutApp({ routineId }: { routineId: string }) {
  const [data, setData] = useState<FirestoreRoutine | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)

  useEffect(() => {
    async function fetchRutina() {
      try {
        console.log('[WorkoutApp] Fetching rutina con ID:', routineId)
        let rutina = await getRutina(routineId)
        console.log('[WorkoutApp] Resultado de getRutina:', rutina)
        
        if (!rutina) {
          console.log('[WorkoutApp] No se encontró rutina, buscando todas...')
          const allRoutines = await getAllRoutines()
          console.log('[WorkoutApp] Todas las rutinas:', allRoutines)
          if (allRoutines.length > 0) {
            rutina = allRoutines[0]
          }
        }
        
        if (rutina) {
          console.log('[WorkoutApp] Datos de rutina:', {
            coachName: (rutina as any).coachName,
            clientName: (rutina as any).clientName,
            daysCount: (rutina as any).routine?.length,
            exercisesCount: (rutina as any).routine?.[0]?.exercises?.length
          })
          setData(rutina as unknown as FirestoreRoutine)
          if ((rutina as unknown as FirestoreRoutine).routine.length > 0) {
            setSelectedDay((rutina as unknown as FirestoreRoutine).routine[0])
          }
        } else {
          console.log('[WorkoutApp] Rutina no encontrada')
          setError('Rutina no encontrada')
        }
      } catch (err) {
        setError('Error al cargar la rutina')
        console.error('[WorkoutApp] Error:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRutina()
  }, [routineId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Cargando rutina...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium">{error || 'Error desconocido'}</p>
        </div>
      </div>
    )
  }

  const { coachName, clientName, clientGoal, routine } = data

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Entrenador</p>
                <p className="text-sm font-semibold text-gray-800">{coachName}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4">
            <p className="text-white/80 text-xs font-medium mb-1">Alumno</p>
            <p className="text-white font-bold text-lg">{clientName}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              <span className="text-white/90 text-sm">{clientGoal}</span>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-100 sticky top-[140px] z-10">
        <div className="max-w-md mx-auto">
          <div className="flex overflow-x-auto px-4 py-3 gap-2 scrollbar-hide">
            {routine.map((day, index) => (
              <button
                key={day.day_id}
                onClick={() => setSelectedDay(day)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedDay?.day_id === day.day_id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Día {index + 1}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 pt-4">
        {selectedDay && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">{selectedDay.day_name}</h2>
              <span className="text-sm text-gray-500">
                {selectedDay.exercises.length} ejercicios
              </span>
            </div>

            <div className="space-y-4">
              {selectedDay.exercises.map((exercise, index) => (
                <ExerciseCard 
                  key={exercise.id} 
                  exercise={exercise} 
                  index={index}
                  onClick={() => setSelectedExercise(exercise)}
                />
              ))}
            </div>

            {selectedDay.exercises.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay ejercicios programados para este día</p>
              </div>
            )}
          </>
        )}
      </main>

      {selectedExercise && (
        <InstructionsModal 
          exercise={selectedExercise} 
          onClose={() => setSelectedExercise(null)} 
        />
      )}
    </div>
  )
}
