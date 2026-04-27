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
  const containerStyle: React.CSSProperties = {
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: '10pt',
    color: '#333333',
    background: '#FFFFFF',
    padding: '20mm',
    width: '210mm',
    minHeight: '297mm',
    boxSizing: 'border-box',
    position: 'absolute',
    left: '-9999px',
    top: '0',
  }

  const headerStyle: React.CSSProperties = {
    borderBottom: '3px solid #000000',
    paddingBottom: '15px',
    marginBottom: '20px',
  }

  const headerTitleStyle: React.CSSProperties = {
    fontSize: '24pt',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: '15px',
  }

  const headerGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '10px',
  }

  const headerLabelStyle: React.CSSProperties = {
    fontWeight: 'bold',
    color: '#64748B',
  }

  const daySectionStyle: React.CSSProperties = {
    background: '#F4F4F4',
    padding: '10px',
    fontSize: '12pt',
    fontWeight: 'bold',
    borderLeft: '5px solid #000000',
    margin: '20px 0 15px 0',
    pageBreakAfter: 'avoid',
  }

  const getBlockCardStyle = (isSuperserie: boolean): React.CSSProperties => ({
    border: '1px solid #EEEEEE',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    pageBreakInside: 'avoid',
    borderLeft: isSuperserie ? '5px solid #3B82F6' : '5px solid #333333',
    background: isSuperserie ? '#F8FAFC' : '#FFFFFF',
  })

  const blockTitleStyle: React.CSSProperties = {
    fontSize: '11pt',
    fontWeight: 'bold',
    marginBottom: '10px',
  }

  const statsTableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '10px',
  }

  const statsCellStyle: React.CSSProperties = {
    padding: '5px',
    border: '1px solid #E5E5E5',
    textAlign: 'center',
  }

  const statsLabelStyle: React.CSSProperties = {
    fontSize: '8pt',
    textTransform: 'uppercase',
    color: '#64748B',
  }

  const statsValueStyle: React.CSSProperties = {
    fontSize: '11pt',
    fontWeight: 'bold',
  }

  const indicationsBoxStyle: React.CSSProperties = {
    background: '#FEF3C7',
    border: '1px solid #FDE68A',
    color: '#92400E',
    padding: '10px',
    marginBottom: '10px',
    fontSize: '9pt',
    whiteSpace: 'pre-line',
  }

  const exercisesGridStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  }

  const exerciseItemStyle: React.CSSProperties = {
    flex: '1',
    minWidth: '45%',
  }

  const exerciseItemFullStyle: React.CSSProperties = {
    flex: '1',
    minWidth: '100%',
  }

  const exerciseTitleStyle: React.CSSProperties = {
    fontWeight: 'bold',
    fontSize: '10pt',
    marginBottom: '5px',
  }

  const exerciseImageStyle: React.CSSProperties = {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    display: 'block',
    borderRadius: '8px',
  }

  const videoLinkStyle: React.CSSProperties = {
    display: 'block',
    textAlign: 'center',
    padding: '8px',
    fontSize: '7pt',
    color: '#3B82F6',
    textDecoration: 'none',
  }

  const footerStyle: React.CSSProperties = {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '8pt',
    color: '#9CA3AF',
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={headerTitleStyle}>{routineTitle}</div>
        <div style={headerGridStyle}>
          <div style={{ fontSize: '10pt' }}>
            <span style={headerLabelStyle}>CLIENTE:</span> {clientName}
          </div>
          <div style={{ fontSize: '10pt' }}>
            <span style={headerLabelStyle}>OBJETIVO:</span> {clientGoal}
          </div>
          <div style={{ fontSize: '10pt' }}>
            <span style={headerLabelStyle}>COACH:</span> {coachName}
          </div>
        </div>
      </div>

      {routine.map((day) => (
        <div key={day.day_id} style={daySectionStyle}>
          {day.day_name}
        </div>
      ))}

      {routine.map((day) =>
        day.blocks.map((block, blockIndex) => {
          const isSuperserie = block._combined && block.sub_exercises.length > 1
          
          return (
            <div 
              key={block.id} 
              style={getBlockCardStyle(isSuperserie)}
            >
              <div style={blockTitleStyle}>
                {blockIndex + 1}. {isSuperserie ? 'SUPERSERIE' : 'BLOQUE SIMPLE'}
              </div>
              
              <table style={statsTableStyle}>
                <tbody>
                  <tr>
                    <td style={statsCellStyle}>
                      <div style={statsLabelStyle}>Series</div>
                      <div style={statsValueStyle}>{block.series}</div>
                    </td>
                    <td style={statsCellStyle}>
                      <div style={statsLabelStyle}>Reps</div>
                      <div style={statsValueStyle}>{block.reps}</div>
                    </td>
                    <td style={statsCellStyle}>
                      <div style={statsLabelStyle}>Descanso</div>
                      <div style={statsValueStyle}>{block.rest_time}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              {block.indications && (
                <div style={indicationsBoxStyle}>
                  {block.indications}
                </div>
              )}
              
              <div style={exercisesGridStyle}>
                {block.sub_exercises.map((subExercise, subIndex) => {
                  const prefix = isSuperserie 
                    ? `${blockIndex + 1}${letters[subIndex]}. ` 
                    : ''
                  const fullWidth = !isSuperserie
                  
                  return (
                    <div 
                      key={subExercise.exercise_id || subIndex} 
                      style={fullWidth ? exerciseItemFullStyle : exerciseItemStyle}
                    >
                      <div style={exerciseTitleStyle}>
                        {prefix}{subExercise.name}
                      </div>
                      <div>
                        {subExercise.video_url ? (
                          <a href={subExercise.video_url} target="_blank" rel="noopener noreferrer">
                            <img 
                              src={subExercise.gif_url} 
                              alt={subExercise.name}
                              style={exerciseImageStyle}
                            />
                          </a>
                        ) : (
                          <img 
                            src={subExercise.gif_url} 
                            alt={subExercise.name}
                            style={exerciseImageStyle}
                          />
                        )}
                      </div>
                      {subExercise.video_url && (
                        <a href={subExercise.video_url} target="_blank" rel="noopener noreferrer" style={videoLinkStyle}>
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

      <div style={footerStyle}>
        Generado por Athletiq
      </div>
    </div>
  )
}