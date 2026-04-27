'use client'

import { useState, useEffect, useRef } from 'react'
import { getRutina } from '../../lib/firebase'
import { Block, SubExercise, WorkoutDay } from '../data/mockData'
import VideoEmbed, { VideoLink } from './VideoEmbed'
import PdfDocument from './PdfDocument'
import { PDFDownloadLink } from '@react-pdf/renderer'

interface BlockCardProps {
  block: Block
  blockIndex: number
  onClick: (block: Block) => void
}

function BlockCard({ block, blockIndex, onClick }: BlockCardProps) {
  const isSuperserie = block._combined && block.sub_exercises.length > 1
  const letters = ['A', 'B', 'C', 'D', 'E', 'F']
  const [currentSlide, setCurrentSlide] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const getExerciseLabel = (i: number) => `${blockIndex + 1}${letters[i]}.`

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentSlide(prev => prev > 0 ? prev - 1 : block.sub_exercises.length - 1)
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentSlide(prev => prev < block.sub_exercises.length - 1 ? prev + 1 : 0)
  }

  return (
    <button 
      onClick={() => onClick(block)}
      className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 text-left hover:shadow-md transition-shadow"
    >
      <div className="p-4 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold flex items-center justify-center">
            {blockIndex + 1}
          </span>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">
              {isSuperserie ? 'Superserie' : block.sub_exercises[0]?.name}
            </h3>
            {isSuperserie && (
              <div className="flex flex-wrap gap-2 mt-1">
                {block.sub_exercises.map((sub, i) => (
                  <span key={i} className="text-xs text-gray-500 font-medium">
                    {getExerciseLabel(i)} {sub.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          {isSuperserie && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {block.sub_exercises.length} ejercicios
            </span>
          )}
        </div>

        <div className="mb-3 relative overflow-hidden rounded-xl">
          {isSuperserie ? (
            <div className="relative overflow-hidden" style={{ paddingTop: '100%' }}>
              <div 
                className="absolute inset-0 flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {block.sub_exercises.map((sub, i) => (
                  <div 
                    key={i}
                    className="w-full h-full flex-shrink-0"
                    style={{ perspective: '1000px' }}
                  >
                    <div className="w-full h-full transform-style-3d rotate-y-5">
                      <img
                        src={sub.gif_url}
                        alt={sub.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = `https://via.placeholder.com/400x400/F3F4F6/9CA3AF?text=${encodeURIComponent(sub.name)}`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {block.sub_exercises.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {block.sub_exercises.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentSlide(i)
                        }}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i === currentSlide ? 'bg-blue-600' : 'bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <VideoEmbed 
              videoUrl={block.sub_exercises[0]?.video_url} 
              mediaUrl={block.sub_exercises[0]?.gif_url} 
              alt={block.sub_exercises[0]?.name || 'Ejercicio'}
              showPlayButton={false}
            />
          )}
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1 bg-blue-50 rounded-lg p-2 text-center">
            <p className="text-xs text-blue-600 font-medium uppercase">Series</p>
            <p className="text-lg font-bold text-blue-700">{block.series}</p>
          </div>
          <div className="flex-1 bg-emerald-50 rounded-lg p-2 text-center">
            <p className="text-xs text-emerald-600 font-medium uppercase">Reps</p>
            <p className="text-lg font-bold text-emerald-700">{block.reps}</p>
          </div>
          <div className="flex-1 bg-amber-50 rounded-lg p-2 text-center">
            <p className="text-xs text-amber-600 font-medium uppercase">Descanso</p>
            <p className="text-lg font-bold text-amber-700">{block.rest_time}</p>
          </div>
        </div>
      </div>
    </button>
  )
}

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border rounded-lg overflow-hidden mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <svg 
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-3 bg-white">
          {children}
        </div>
      )}
    </div>
  )
}

interface InstructionsModalProps {
  block: Block
  blockIndex: number
  onClose: () => void
}

function InstructionsModal({ block, blockIndex, onClose }: InstructionsModalProps) {
  const isSuperserie = block._combined && block.sub_exercises.length > 1
  const letters = ['A', 'B', 'C', 'D', 'E', 'F']
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)

  const currentExercise = block.sub_exercises[currentExerciseIndex]

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md min-h-full overflow-hidden animate-slide-up">
        <div className="px-6 pt-4 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex-1 pr-2">
              {isSuperserie ? 'Superserie' : block.sub_exercises[0]?.name}
            </h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <div className="flex-1 bg-blue-50 rounded-lg p-2 text-center">
              <p className="text-xs text-blue-600 font-medium uppercase">Series</p>
              <p className="text-lg font-bold text-blue-700">{block.series}</p>
            </div>
            <div className="flex-1 bg-emerald-50 rounded-lg p-2 text-center">
              <p className="text-xs text-emerald-600 font-medium uppercase">Reps</p>
              <p className="text-lg font-bold text-emerald-700">{block.reps}</p>
            </div>
            <div className="flex-1 bg-amber-50 rounded-lg p-2 text-center">
              <p className="text-xs text-amber-600 font-medium uppercase">Descanso</p>
              <p className="text-lg font-bold text-amber-700">{block.rest_time}</p>
            </div>
          </div>

          {block.indications && (
            <CollapsibleSection title="Indicaciones" defaultOpen={false}>
              <p className="text-sm text-gray-700 whitespace-pre-line">{block.indications}</p>
            </CollapsibleSection>
          )}

          {isSuperserie && (
            <div className="flex gap-2 overflow-x-auto mb-4 pb-2 scrollbar-hide">
              {block.sub_exercises.map((sub, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentExerciseIndex(i)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    currentExerciseIndex === i
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {blockIndex + 1}{letters[i]}. {sub.name.split(' ').slice(0, 2).join(' ')}
                </button>
              ))}
            </div>
          )}

          {currentExercise && (
            <>
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                {isSuperserie && `${blockIndex + 1}${letters[currentExerciseIndex]}. `}{currentExercise.name}
              </h3>
              
              <div className="mb-4">
                <VideoEmbed 
                  videoUrl={currentExercise.video_url} 
                  mediaUrl={currentExercise.gif_url} 
                  alt={currentExercise.name}
                />
              </div>
              
              {currentExercise.video_url && (
                <div className="mb-4">
                  <VideoLink videoUrl={currentExercise.video_url} />
                </div>
              )}

              <CollapsibleSection title="Instrucciones" defaultOpen={false}>
                <div className="space-y-3">
                  {currentExercise.instructions && currentExercise.instructions.map((instruction, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-medium flex items-center justify-center">
                        {i + 1}
                      </span>
                      <p className="text-gray-600 text-sm leading-relaxed">{instruction}</p>
                    </div>
                  ))}
                  {(!currentExercise.instructions || currentExercise.instructions.length === 0) && (
                    <p className="text-gray-400 text-sm">No hay instrucciones disponibles</p>
                  )}
                </div>
              </CollapsibleSection>
            </>
          )}
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
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  const [pdfReady, setPdfReady] = useState(false)

  useEffect(() => {
    async function fetchRutina() {
      try {
        console.log('[WorkoutApp] Fetching rutina con ID:', routineId)
        const rutina = await getRutina(routineId)
        console.log('[WorkoutApp] Resultado de getRutina:', rutina)
        
        if (rutina) {
          console.log('[WorkoutApp] Datos de rutina:', {
            coachName: (rutina as any).coachName,
            clientName: (rutina as any).clientName,
            daysCount: (rutina as any).routine?.length,
            blocksCount: (rutina as any).routine?.[0]?.blocks?.length
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
    const whatsappNumber = '51901003700'
    const whatsappMessage = encodeURIComponent('Hola, no puedo ver mi rutina. ¿Me ayudan?')
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm mx-auto">
          <img
            src="/images/mancuerna_rota.png"
            alt="Rutina no encontrada"
            className="w-48 h-48 mx-auto mb-6 object-contain"
          />
          <h1 className="text-2xl font-bold text-gray-800 mb-3">¡Ups! No encontramos esta rutina.</h1>
          <p className="text-gray-500 mb-6">Es posible que tu entrenador la haya actualizado o eliminado.</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contactar con mi entrenador
          </a>
        </div>
      </div>
    )
  }

  const { coachName, clientName, clientGoal, routine } = data

  const handleBlockClick = (block: Block) => {
    setSelectedBlock(block)
  }

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
            <div className="flex items-start justify-between">
              <div className="flex-1">
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
              <PDFDownloadLink
                document={
                  <PdfDocument
                    clientName={data.clientName}
                    clientGoal={data.clientGoal || ''}
                    coachName={data.coachName}
                    routine={data.routine}
                  />
                }
                fileName={`AthletiQ_${data.routineTitle || 'Rutina'}_${data.clientName.replace(/\s+/g, '_')}.pdf`}
              >
                {({ loading }) => (
                  <button
                    disabled={loading}
                    className="flex-shrink-0 ml-3 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    title="Descargar PDF"
                  >
                    {loading ? (
                      <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                  </button>
                )}
              </PDFDownloadLink>
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
                {selectedDay.blocks.length} bloques
              </span>
            </div>

            <div className="space-y-4">
              {selectedDay.blocks.map((block, index) => (
                <BlockCard 
                  key={block.id} 
                  block={block} 
                  blockIndex={index}
                  onClick={handleBlockClick}
                />
              ))}
            </div>

            {selectedDay.blocks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay ejercicios programados para este día</p>
              </div>
            )}
          </>
        )}
      </main>

      {selectedBlock && (
        <InstructionsModal 
          block={selectedBlock}
          blockIndex={selectedDay?.blocks.findIndex(b => b.id === selectedBlock.id) ?? 0}
          onClose={() => setSelectedBlock(null)} 
        />
      )}
    </div>
  )
}