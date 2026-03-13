import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, doc, getDoc, getDocs, collection } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

let db: ReturnType<typeof getFirestore> | null = null

if (typeof window !== 'undefined') {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  db = getFirestore(app)
}

export async function getRutina(id: string) {
  if (!db) {
    console.warn('Firestore not initialized (server-side)')
    return null
  }
  
  try {
    const docRef = doc(db, 'routines', id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      console.log('Documento no encontrado:', id)
      return null
    }
  } catch (error) {
    console.error('Error fetching rutina:', error)
    return null
  }
}

export async function getAllRoutines() {
  if (!db) {
    console.warn('Firestore not initialized')
    return []
  }
  
  try {
    const querySnapshot = await getDocs(collection(db, 'routines'))
    const routines: any[] = []
    querySnapshot.forEach((doc) => {
      routines.push({ id: doc.id, ...doc.data() })
    })
    console.log('Documentos en Firestore:', routines)
    return routines
  } catch (error) {
    console.error('Error fetching routines:', error)
    return []
  }
}

export { db }
