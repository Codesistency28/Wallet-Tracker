import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, query, QueryConstraint } from 'firebase/firestore'
import { db } from '../config/firebase'

const useFetchData = <T>(
    collectionName: string,
    constraints: QueryConstraint[] = []
) => {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(()=>{
        if (!collectionName) {
            return
        }
        const collectionRef  = collection(db, collectionName)
        const q = query(collectionRef, ...constraints)

        const unsub = onSnapshot(q,(snapshot)=>{
            const fetchData = snapshot.docs.map(doc=>{
                return {
                    id: doc.id,
                    ...doc.data()
                }
            })as T[]
            setData(fetchData)
            setLoading(false)
        },(err)=>{
            console.log(err)
            setError(err.message)
            setLoading(false)
        })
        return ()=> unsub()
    },[])

    return { data, loading, error }
}

export default useFetchData