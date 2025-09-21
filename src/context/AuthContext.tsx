import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

interface AuthContextType {
  currentUser: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, userData?: any) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  getUserData: () => Promise<any>
  updateUserBalance: (amount: number) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const register = async (name: string, email: string, password: string, userData?: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName: name })
      
      if (userData) {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          email,
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    } catch (error) {
      throw error
    }
  }

  const getUserData = async () => {
    if (!currentUser) return null
    
    try {
      const docRef = doc(db, 'users', currentUser.uid)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return docSnap.data()
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  }

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      throw error
    }
  }

  const updateUserBalance = async (amount: number) => {
    if (!currentUser) throw new Error('Kullanıcı girişi gerekli')
    
    try {
      const userRef = doc(db, 'users', currentUser.uid)
      const userDoc = await getDoc(userRef)
      
      let currentBalance = 0
      if (userDoc.exists()) {
        const userData = userDoc.data()
        currentBalance = userData.account?.balance || 0
      }
      
      const newBalance = currentBalance + amount
      
      await updateDoc(userRef, {
        'account.balance': newBalance,
        updatedAt: new Date()
      })
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    getUserData,
    updateUserBalance
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}