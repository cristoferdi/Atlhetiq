import WorkoutApp from '../components/WorkoutApp'

export default function Page({ params }: { params: { id: string } }) {
  const routineId = params.id
  return <WorkoutApp routineId={routineId} />
}
