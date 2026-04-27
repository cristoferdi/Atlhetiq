import { Block, WorkoutDay } from '../data/mockData'

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
    <div className="pdf-container">
      <style jsx>{`
        .pdf-container {
          font-family: Helvetica, Arial, sans-serif;
          font-size: 10pt;
          color: #333333;
          background: #FFFFFF;
          padding: 20mm;
          width: 210mm;
          min-height: 297mm;
          box-sizing: border-box;
        }
        
        @page {
          size: A4;
          margin: 20mm;
        }
        
        .header {
          border-bottom: 3px solid #000000;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        
        .header-title {
          font-size: 24pt;
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 15px;
        }
        
        .header-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
        }
        
        .header-item {
          font-size: 10pt;
        }
        
        .header-label {
          font-weight: bold;
          color: #64748B;
        }
        
        .day-section {
          background: #F4F4F4;
          padding: 10px;
          font-size: 12pt;
          font-weight: bold;
          border-left: 5px solid #000000;
          margin: 20px 0 15px 0;
          page-break-after: avoid;
        }
        
        .block-card {
          border: 1px solid #EEEEEE;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
          page-break-inside: avoid;
        }
        
        .block-card.superserie {
          border-left: 5px solid #3B82F6;
          background: #F8FAFC;
        }
        
        .block-card.simple {
          border-left: 5px solid #333333;
          background: #FFFFFF;
        }
        
        .block-title {
          font-size: 11pt;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .stats-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        
        .stats-table td {
          padding: 5px;
          border: 1px solid #E5E5E5;
          text-align: center;
        }
        
        .stats-label {
          font-size: 8pt;
          text-transform: uppercase;
          color: #64748B;
        }
        
        .stats-value {
          font-size: 11pt;
          font-weight: bold;
        }
        
        .indications-box {
          background: #FEF3C7;
          border: 1px solid #FDE68A;
          color: #92400E;
          padding: 10px;
          margin-bottom: 10px;
          font-size: 9pt;
          white-space: pre-line;
        }
        
        .exercises-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .exercise-item {
          flex: 1;
          min-width: 45%;
        }
        
        .exercise-item.full-width {
          min-width: 100%;
        }
        
        .exercise-title {
          font-weight: bold;
          font-size: 10pt;
          margin-bottom: 5px;
        }
        
        .exercise-image-container {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .exercise-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
          display: block;
        }
        
        .video-link {
          display: block;
          text-align: center;
          padding: 8px;
          font-size: 7pt;
          color: #3B82F6;
          text-decoration: none;
        }
        
        .footer {
          position: fixed;
          bottom: 10px;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 8pt;
          color: #9CA3AF;
        }
      `}</style>

      <div className="header">
        <div className="header-title">{routineTitle}</div>
        <div className="header-grid">
          <div className="header-item">
            <span className="header-label">CLIENTE:</span> {clientName}
          </div>
          <div className="header-item">
            <span className="header-label">OBJETIVO:</span> {clientGoal}
          </div>
          <div className="header-item">
            <span className="header-label">COACH:</span> {coachName}
          </div>
        </div>
      </div>

      {routine.map((day, dayIndex) => (
        <div key={day.day_id} className="day-section">
          {day.day_name}
        </div>
      ))}

      {routine.map((day) =>
        day.blocks.map((block, blockIndex) => {
          const isSuperserie = block._combined && block.sub_exercises.length > 1
          
          return (
            <div 
              key={block.id} 
              className={`block-card ${isSuperserie ? 'superserie' : 'simple'}`}
            >
              <div className="block-title">
                {blockIndex + 1}. {isSuperserie ? 'SUPERSERIE' : 'BLOQUE SIMPLE'}
              </div>
              
              <table className="stats-table">
                <tbody>
                  <tr>
                    <td>
                      <div className="stats-label">Series</div>
                      <div className="stats-value">{block.series}</div>
                    </td>
                    <td>
                      <div className="stats-label">Reps</div>
                      <div className="stats-value">{block.reps}</div>
                    </td>
                    <td>
                      <div className="stats-label">Descanso</div>
                      <div className="stats-value">{block.rest_time}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              {block.indications && (
                <div className="indications-box">
                  {block.indications}
                </div>
              )}
              
              <div className={`exercises-grid ${!isSuperserie ? 'single' : ''}`}>
                {block.sub_exercises.map((subExercise, subIndex) => {
                  const prefix = isSuperserie 
                    ? `${blockIndex + 1}${letters[subIndex]}. ` 
                    : ''
                  const fullWidth = !isSuperserie
                  
                  return (
                    <div 
                      key={subExercise.exercise_id || subIndex} 
                      className={`exercise-item ${fullWidth ? 'full-width' : ''}`}
                    >
                      <div className="exercise-title">
                        {prefix}{subExercise.name}
                      </div>
                      <div className="exercise-image-container">
                        {subExercise.video_url ? (
                          <a href={subExercise.video_url} target="_blank" rel="noopener noreferrer">
                            <img 
                              src={subExercise.gif_url} 
                              alt={subExercise.name}
                              className="exercise-image"
                            />
                          </a>
                        ) : (
                          <img 
                            src={subExercise.gif_url} 
                            alt={subExercise.name}
                            className="exercise-image"
                          />
                        )}
                      </div>
                      {subExercise.video_url && (
                        <a href={subExercise.video_url} target="_blank" rel="noopener noreferrer" className="video-link">
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

      <div className="footer">
        Generado por Athletiq
      </div>
    </div>
  )
}