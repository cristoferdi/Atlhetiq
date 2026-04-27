/* eslint-disable @typescript-eslint/no-explicit-any */
import html2pdf from 'html2pdf.js'

export async function generatePdf(element: HTMLElement, filename: string): Promise<void> {
  const options: any = {
    margin: 20,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait'
    }
  }

  await html2pdf().set(options).from(element).save()
}

export function downloadPdf(
  elementRef: React.RefObject<HTMLDivElement>,
  clientName: string,
  routineTitle: string
): void {
  if (!elementRef.current) return

  const filename = `AthletiQ_${routineTitle.replace(/\s+/g, '_')}_${clientName.replace(/\s+/g, '_')}.pdf`
  
  generatePdf(elementRef.current, filename)
}