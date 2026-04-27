'use client'

import { useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import PdfDocument from './PdfDocument'
import { WorkoutDay } from '../data/mockData'

interface PdfButtonProps {
  clientName: string
  clientGoal: string
  coachName: string
  routine: WorkoutDay[]
  routineTitle?: string
}

export default function PdfButton({ clientName, clientGoal, coachName, routine, routineTitle }: PdfButtonProps) {
  const [pdfLoading, setPdfLoading] = useState(false)

  const fileName = `AthletiQ_${(routineTitle || 'Rutina').replace(/\s+/g, '_')}_${clientName.replace(/\s+/g, '_')}.pdf`

  return (
    <PDFDownloadLink
      document={
        <PdfDocument
          clientName={clientName}
          clientGoal={clientGoal}
          coachName={coachName}
          routine={routine}
          routineTitle={routineTitle}
        />
      }
      fileName={fileName}
      onLoadStart={() => setPdfLoading(true)}
      onLoad={() => setPdfLoading(false)}
    >
      {({ loading }) => (
        <button
          disabled={loading || pdfLoading}
          className="flex-shrink-0 ml-3 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          title="Descargar PDF"
        >
          {loading || pdfLoading ? (
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