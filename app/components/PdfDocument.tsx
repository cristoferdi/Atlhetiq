'use client'

import { Document, Page, View, Text, Image, Link, StyleSheet } from '@react-pdf/renderer'
import { WorkoutDay } from '../data/mockData'
import { getImageAsBase64 } from '../utils/imageUtils'
import { useEffect, useState } from 'react'

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
    paddingBottom: 15,
    marginBottom: 20,
  },
  headerCover: {
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  headerGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  headerItem: {
    fontSize: 9,
    flex: 1,
  },
  headerLabel: {
    fontWeight: 'bold',
    color: '#64748B',
  },
  daySection: {
    backgroundColor: '#F4F4F4',
    padding: 10,
    fontSize: 12,
    fontWeight: 'bold',
    borderLeftWidth: 5,
    borderLeftColor: '#000000',
    marginBottom: 12,
    marginTop: 15,
  },
  blockCard: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  superserie: {
    borderLeftWidth: 5,
    borderLeftColor: '#3B82F6',
    backgroundColor: '#F8FAFC',
  },
  simple: {
    borderLeftWidth: 5,
    borderLeftColor: '#333333',
    backgroundColor: '#FFFFFF',
  },
  blockTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  statsCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsLabel: {
    fontSize: 7,
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  statsValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  indicationsBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 8,
    marginBottom: 8,
    fontSize: 8,
    color: '#92400E',
  },
  exercisesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  exerciseItem: {
    width: '48%',
    marginBottom: 15,
  },
  exerciseItemFull: {
    width: '100%',
    marginBottom: 15,
  },
  exerciseTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  exerciseImageContainer: {
    marginBottom: 4,
  },
  exerciseImage: {
    width: '100%',
    height: 90,
    objectFit: 'contain',
    borderRadius: 4,
  },
  videoLink: {
    fontSize: 7,
    color: '#3B82F6',
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20,
    textAlign: 'center',
    fontSize: 7,
    color: '#9CA3AF',
  },
  overviewText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 10,
  },
  coverList: {
    marginTop: 8,
  },
  coverListItem: {
    fontSize: 9,
    color: '#333333',
    marginBottom: 4,
  },
})

interface ExerciseImageProps {
  gifUrl: string
  videoUrl?: string
}

const ExerciseImage = ({ gifUrl, videoUrl }: ExerciseImageProps) => {
  const [base64Image, setBase64Image] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadImage = async () => {
      setLoading(true)
      const base64 = await getImageAsBase64(gifUrl)
      if (mounted) {
        setBase64Image(base64)
        setLoading(false)
      }
    }

    loadImage()

    return () => {
      mounted = false
    }
  }, [gifUrl])

  const imageContent = (
    <View style={styles.exerciseImageContainer}>
      {loading ? (
        <Text style={{ fontSize: 8, color: '#9CA3AF' }}>Cargando...</Text>
      ) : base64Image ? (
        <Image src={base64Image} style={styles.exerciseImage} />
      ) : (
        <Text style={{ fontSize: 8, color: '#9CA3AF' }}>Sin imagen</Text>
      )}
    </View>
  )

  if (videoUrl) {
    return (
      <Link src={videoUrl}>
        {imageContent}
        <Text style={styles.videoLink}>▶ Toca para ver video</Text>
      </Link>
    )
  }

  return imageContent
}

interface BlockProps {
  block: any
  blockIndex: number
}

const Block = ({ block, blockIndex }: BlockProps) => {
  const isSuperserie = block._combined && block.sub_exercises.length > 1
  const letters = ['A', 'B', 'C', 'D', 'E', 'F']

  return (
    <View style={[styles.blockCard, isSuperserie ? styles.superserie : styles.simple]}>
      <Text style={styles.blockTitle}>
        {blockIndex + 1}. {isSuperserie ? 'SUPERSERIE' : 'BLOQUE SIMPLE'}
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statsCell}>
          <Text style={styles.statsLabel}>Series</Text>
          <Text style={styles.statsValue}>{block.series}</Text>
        </View>
        <View style={styles.statsCell}>
          <Text style={styles.statsLabel}>Reps</Text>
          <Text style={styles.statsValue}>{block.reps}</Text>
        </View>
        <View style={styles.statsCell}>
          <Text style={styles.statsLabel}>Descanso</Text>
          <Text style={styles.statsValue}>{block.rest_time}</Text>
        </View>
      </View>

      {block.indications && (
        <Text style={styles.indicationsBox}>{block.indications}</Text>
      )}

      <View style={styles.exercisesRow}>
        {block.sub_exercises.map((subExercise: any, subIndex: number) => {
          const prefix = isSuperserie ? `${blockIndex + 1}${letters[subIndex]}. ` : ''
          const itemStyle = isSuperserie ? styles.exerciseItem : [styles.exerciseItem, styles.exerciseItemFull]

          return (
            <View 
              key={subExercise.exercise_id || subIndex} 
              style={itemStyle}
            >
              <Text style={styles.exerciseTitle}>
                {prefix}{subExercise.name}
              </Text>
              <ExerciseImage 
                gifUrl={subExercise.gif_url} 
                videoUrl={subExercise.video_url}
              />
            </View>
          )
        })}
      </View>
    </View>
  )
}

interface DayPageProps {
  day: WorkoutDay
  dayIndex: number
  clientName: string
  clientGoal: string
  coachName: string
}

const DayPage = ({ day, dayIndex, clientName, clientGoal, coachName }: DayPageProps) => {
  return (
    <Page size="A4" style={styles.page} wrap={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{day.day_name}</Text>
        <View style={styles.headerGrid}>
          <Text style={styles.headerItem}>
            <Text style={styles.headerLabel}>CLIENTE:</Text> {clientName}
          </Text>
          <Text style={styles.headerItem}>
            <Text style={styles.headerLabel}>OBJETIVO:</Text> {clientGoal}
          </Text>
          <Text style={styles.headerItem}>
            <Text style={styles.headerLabel}>COACH:</Text> {coachName}
          </Text>
        </View>
      </View>

      {day.blocks.map((block, blockIndex) => (
        <Block key={block.id} block={block} blockIndex={blockIndex} />
      ))}

      <Text 
        style={styles.footer} 
        render={({ pageNumber, totalPages }) => 
          `Generado por Athletiq - Página ${pageNumber} de ${totalPages}`
        } 
        fixed 
      />
    </Page>
  )
}

interface CoverPageProps {
  clientName: string
  clientGoal: string
  coachName: string
  routineTitle: string
  routine: WorkoutDay[]
}

const CoverPage = ({ clientName, clientGoal, coachName, routineTitle, routine }: CoverPageProps) => {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.headerCover}>
        <Text style={styles.title}>{routineTitle || 'Rutina de Ejercicios'}</Text>
        <View style={styles.headerGrid}>
          <Text style={styles.headerItem}>
            <Text style={styles.headerLabel}>CLIENTE:</Text> {clientName}
          </Text>
          <Text style={styles.headerItem}>
            <Text style={styles.headerLabel}>OBJETIVO:</Text> {clientGoal}
          </Text>
          <Text style={styles.headerItem}>
            <Text style={styles.headerLabel}>COACH:</Text> {coachName}
          </Text>
        </View>
      </View>

      <Text style={styles.overviewText}>
        Esta rutina contiene {routine.length} día{routine.length !== 1 ? 's' : ''}:
      </Text>

      <View style={styles.coverList}>
        {routine.map((day, index) => (
          <Text key={day.day_id} style={styles.coverListItem}>
            • {day.day_name} ({day.blocks.length} bloque{day.blocks.length !== 1 ? 's' : ''})
          </Text>
        ))}
      </View>

      <Text 
        style={styles.footer} 
        render={({ pageNumber, totalPages }) => 
          `Generado por Athletiq - Página ${pageNumber} de ${totalPages}`
        } 
        fixed 
      />
    </Page>
  )
}

interface PdfDocumentProps {
  clientName: string
  clientGoal: string
  coachName: string
  routine: WorkoutDay[]
  routineTitle?: string
}

const PdfDocument = ({ clientName, clientGoal, coachName, routine, routineTitle }: PdfDocumentProps) => {
  return (
    <Document>
      <CoverPage 
        clientName={clientName}
        clientGoal={clientGoal}
        coachName={coachName}
        routineTitle={routineTitle || 'Rutina de Ejercicios'}
        routine={routine}
      />

      {routine.map((day, dayIndex) => (
        <DayPage 
          key={day.day_id} 
          day={day} 
          dayIndex={dayIndex}
          clientName={clientName}
          clientGoal={clientGoal}
          coachName={coachName}
        />
      ))}
    </Document>
  )
}

export default PdfDocument