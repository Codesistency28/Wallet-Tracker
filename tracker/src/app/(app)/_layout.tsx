import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { Slot, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import SplashScreen from '@/src/components/Splash'

const AppLayout = () => {
  const { isLoaded, isSignedIn, userId, sessionId } = useAuth()


  if (!isLoaded) {
    return(
      <SplashScreen />
    )
  }
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name='(tabs)' /> 
        <Stack.Screen name='(modals)/profileModal' options={{
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }} />
        <Stack.Screen name='(modals)/walletModal' options={{
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }} />
        <Stack.Screen name='(modals)/transactionModal' options={{
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }} />
        <Stack.Screen name='(modals)/searchModal' options={{
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }} />
     </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name='welcome' /> 
        <Stack.Screen name='login' /> 
        <Stack.Screen name='register' /> 
     </Stack.Protected>
    </Stack>
  )
}

export default AppLayout