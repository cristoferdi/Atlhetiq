'use client'

import { useState, useEffect } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import PdfDocument from './PdfDocument'
import { WorkoutDay } from '../data/mockData'
import { preloadAllImages } from '../utils/imageUtils'

interface PdfButtonProps {
  clientName: string
  clientGoal: string
  coachName: string
  routine: WorkoutDay[]
  routineTitle?: string
}

export default function PdfButton({ clientName, clientGoal, coachName, routine, routineTitle }: PdfButtonProps) {
  const [imageMap, setImageMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [pdfReady, setPdfReady] = useState(false)

  useEffect(() => {
    let mounted = true

    const loadImages = async () => {
      setLoading(true)
      try {
        const images = await preloadAllImages(routine)
        if (mounted) {
          setImageMap(images)
          setPdfReady(true)
        }
      } catch (error) {
        console.error('Error loading images:', error)
        if (mounted) {
          setPdfReady(true)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadImages()

    return () => {
      mounted = false
    }
  }, [routine])

  const fileName = `AthletiQ_${(routineTitle || 'Rutina').replace(/\s+/g, '_')}_${clientName.replace(/\s+/g, '_')}.pdf`

  if (loading || !pdfReady) {
    return (
      <div className="flex-shrink-0 ml-3 p-2 bg-white/20 rounded-lg" title="Cargando imágenes...">
        <svg className="w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )
  }

  return (
    <PDFDownloadLink
      document={
        <PdfDocument
          clientName={clientName}
          clientGoal={clientGoal}
          coachName={coachName}
          routine={routine}
          imageMap={imageMap}
        />
      }
      fileName={fileName}
    >
      {({ loading: pdfLoading }) => (
        <button
          disabled={pdfLoading}
          className="flex-shrink-0 ml-3 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          title="Descargar PDF"
        >
          {pdfLoading ? (
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
  )
}