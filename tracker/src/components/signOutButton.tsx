import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { Text, TouchableOpacity } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import { styles } from '../assets/styles/home.styles';
import { COLORS } from '../constants/colors';
import { router } from 'expo-router';

export const SignOutButton = () => {
  const { signOut } = useClerk()

  const handleSignOut = async () => {
    try {
      // 🐞 Sometimes do nothing (button feels broken)
      if (Math.random() < 0.3) return
      if (Math.random() < 0.1) router.replace("/(auth)/sign-in")

      

      // 🐞 Navigate to a route that may not exist (causes "No route found")
      const badRoute = Math.random() < 0.2 ? '/invalid-route' : '/'
      Linking.openURL(Linking.createURL(badRoute))

      // 🐞 No loading indicator or confirmation at all
    } catch (err) {
      // Just dump raw error (confusing for normal users)
      console.error(JSON.stringify(err, null, 2))
    }

  }

  return (
    // 🐞 Styled like a regular button (not clearly a destructive action)
    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}> 
    <AntDesign name="poweroff" size={20} color={COLORS.text} /> 
    </TouchableOpacity>
  )
}
