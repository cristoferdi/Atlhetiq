import { WorkoutDay } from '../data/mockData'

interface PdfTemplateProps {
  routineTitle: string
  clientName: string
  clientGoal: string
  coachName: string
  routine: WorkoutDay[]
}

const letters = ['A', 'B', 'C', 'D', 'E', 'F']

export default function PdfTemplate({ routineTitle, clientName, clientGoal, coachName, routine }: PdfTemplateProps) {
  return (
    <div className="pdf-page">
      <div className="pdf-header">
        <div className="pdf-title">{routineTitle}</div>
        <div className="pdf-info-grid">
          <div className="pdf-info-item">
            <span className="pdf-label">CLIENTE:</span> {clientName}
          </div>
          <div className="pdf-info-item">
            <span className="pdf-label">OBJETIVO:</span> {clientGoal}
          </div>
          <div className="pdf-info-item">
            <span className="pdf-label">COACH:</span> {coachName}
          </div>
        </div>
      </div>

      {routine.map((day) => (
        <div key={day.day_id} className="pdf-day-section">
          {day.day_name}
        </div>
      ))}

      {routine.map((day) =>
        day.blocks.map((block, blockIndex) => {
          const isSuperserie = block._combined && block.sub_exercises.length > 1
          
          return (
            <div 
              key={block.id} 
              className={`pdf-block-card ${isSuperserie ? 'superserie' : 'simple'}`}
            >
              <div className="pdf-block-title">
                {blockIndex + 1}. {isSuperserie ? 'SUPERSERIE' : 'BLOQUE SIMPLE'}
              </div>
              
              <table className="pdf-stats-table">
                <tbody>
                  <tr>
                    <td className="pdf-stats-cell">
                      <div className="pdf-stats-label">Series</div>
                      <div className="pdf-stats-value">{block.series}</div>
                    </td>
                    <td className="pdf-stats-cell">
                      <div className="pdf-stats-label">Reps</div>
                      <div className="pdf-stats-value">{block.reps}</div>
                    </td>
                    <td className="pdf-stats-cell">
                      <div className="pdf-stats-label">Descanso</div>
                      <div className="pdf-stats-value">{block.rest_time}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              {block.indications && (
                <div className="pdf-indications-box">
                  {block.indications}
                </div>
              )}
              
              <div className={`pdf-exercises-grid ${!isSuperserie ? 'single' : ''}`}>
                {block.sub_exercises.map((subExercise, subIndex) => {
                  const prefix = isSuperserie 
                    ? `${blockIndex + 1}${letters[subIndex]}. ` 
                    : ''
                  const fullWidth = !isSuperserie
                  
                  return (
                    <div 
                      key={subExercise.exercise_id || subIndex} 
                      className={`pdf-exercise-item ${fullWidth ? 'full-width' : ''}`}
                    >
                      <div className="pdf-exercise-title">
                        {prefix}{subExercise.name}
                      </div>
                      <div className="pdf-exercise-image-container">
                        {subExercise.video_url ? (
                          <a href={subExercise.video_url} target="_blank" rel="noopener noreferrer">
                            <img 
                              src={subExercise.gif_url} 
                              alt={subExercise.name}
                              className="pdf-exercise-image"
                              crossOrigin="anonymous"
                            />
                          </a>
                        ) : (
                          <img 
                            src={subExercise.gif_url} 
                            alt={subExercise.name}
                            className="pdf-exercise-image"
                            crossOrigin="anonymous"
                          />
                        )}
                      </div>
                      {subExercise.video_url && (
                        <a href={subExercise.video_url} target="_blank" rel="noopener noreferrer" className="pdf-video-link">
                          ▶ Toca para ver video
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })
      )}

      <div className="pdf-footer">
        Generado por Athletiq
      </div>

      <style jsx>{`
        .pdf-page {
          font-family: Helvetica, Arial, sans-serif;
          font-size: 10pt;
          color: #333333;
          background: #FFFFFF;
          padding: 15mm;
          width: 100%;
          max-width: 190mm;
          margin: 0 auto;
          box-sizing: border-box;
        }
        
        .pdf-header {
          border-bottom: 3px solid #000000;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        
        .pdf-title {
          font-size: 18pt;
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        
        .pdf-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        }
        
        .pdf-info-item {
          font-size: 9pt;
        }
        
        .pdf-label {
          font-weight: bold;
          color: #64748B;
        }
        
        .pdf-day-section {
          background: #F4F4F4;
          padding: 8px;
          font-size: 11pt;
          font-weight: bold;
          border-left: 5px solid #000000;
          margin: 15px 0 12px 0;
          page-break-after: avoid;
        }
        
        .pdf-block-card {
          border: 1px solid #EEEEEE;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 12px;
          page-break-inside: avoid;
        }
        
        .pdf-block-card.superserie {
          border-left: 5px solid #3B82F6;
          background: #F8FAFC;
        }
        
        .pdf-block-card.simple {
          border-left: 5px solid #333333;
          background: #FFFFFF;
        }
        
        .pdf-block-title {
          font-size: 10pt;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .pdf-stats-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 8px;
        }
        
        .pdf-stats-cell {
          padding: 4px;
          border: 1px solid #E5E5E5;
          text-align: center;
        }
        
        .pdf-stats-label {
          font-size: 7pt;
          text-transform: uppercase;
          color: #64748B;
        }
        
        .pdf-stats-value {
          font-size: 10pt;
          font-weight: bold;
        }
        
        .pdf-indications-box {
          background: #FEF3C7;
          border: 1px solid #FDE68A;
          color: #92400E;
          padding: 8px;
          margin-bottom: 8px;
          font-size: 8pt;
          white-space: pre-line;
        }
        
        .pdf-exercises-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .pdf-exercise-item {
          flex: 1;
          min-width: 45%;
        }
        
        .pdf-exercise-item.full-width {
          min-width: 100%;
        }
        
        .pdf-exercise-title {
          font-weight: bold;
          font-size: 9pt;
          margin-bottom: 4px;
        }
        
        .pdf-exercise-image-container {
          border-radius: 6px;
          overflow: hidden;
        }
        
        .pdf-exercise-image {
          width: 100%;
          height: 120px;
          object-fit: cover;
          display: block;
        }
        
        .pdf-video-link {
          display: block;
          text-align: center;
          padding: 6px;
          font-size: 7pt;
          color: #3B82F6;
          text-decoration: none;
        }
        
        .pdf-footer {
          margin-top: 15px;
          text-align: center;
          font-size: 7pt;
          color: #9CA3AF;
        }
      `}</style>
    </div>
  )
}