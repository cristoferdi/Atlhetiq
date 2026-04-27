'use client'

import { Document, Page, View, Text, Image, Link, StyleSheet, Font } from '@react-pdf/renderer'
import { WorkoutDay } from '../data/mockData'
import { getImageAsBase64 } from '../utils/imageUtils'
import { useEffect, useState } from 'react'

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc9.ttf', fontWeight: 'bold' },
  ],
})

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
    paddingBottom: 15,
    marginBottom: 20,
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
  },
  blockCard: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
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
    padding: 4,
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: 7,
    color: '#64748B',
    textTransform: 'uppercase',
  },
  statsValue: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
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
    gap: 8,
  },
  exerciseItem: {
    flex: 1,
    minWidth: '45%',
  },
  exerciseItemFull: {
    minWidth: '100%',
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
    height: 100,
    objectFit: 'cover',
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
  loadingImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 8,
    color: '#9CA3AF',
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
        <View style={styles.loadingImage}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      ) : base64Image ? (
        <Image src={base64Image} style={styles.exerciseImage} />
      ) : (
        <View style={styles.loadingImage}>
          <Text style={styles.loadingText}>Sin imagen</Text>
        </View>
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
}

const DayPage = ({ day, dayIndex }: DayPageProps) => {
  return (
    <Page size="A4" style={styles.page} wrap={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Rutina de Ejercicios</Text>
        <View style={styles.headerGrid}>
          <Text style={styles.headerItem}>
            <Text style={styles.headerLabel}>DÍA:</Text> {day.day_name}
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

interface PdfDocumentProps {
  clientName: string
  clientGoal: string
  coachName: string
  routine: WorkoutDay[]
}

const PdfDocument = ({ clientName, clientGoal, coachName, routine }: PdfDocumentProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Rutina de Ejercicios</Text>
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

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 10, color: '#64748B', marginBottom: 10 }}>
            Esta rutina contiene {routine.length} día{routine.length !== 1 ? 's' : ''}. 
            Continue a la siguiente página para ver los detalles.
          </Text>
        </View>

        <Text 
          style={styles.footer} 
          render={({ pageNumber, totalPages }) => 
            `Generado por Athletiq - Página ${pageNumber} de ${totalPages}`
          } 
          fixed 
        />
      </Page>

      {routine.map((day, dayIndex) => (
        <DayPage key={day.day_id} day={day} dayIndex={dayIndex} />
      ))}
    </Document>
  )
}

export default PdfDocument