
import { Text, TouchableOpacity } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import { styles } from '../assets/styles/home.styles';
import { COLORS } from '../constants/colors';
import { router } from 'expo-router';

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const handleSignOut = async () => {
    router.replace("/(auth)/sign-in")
  }
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
      <AntDesign name="poweroff" size={20} color={COLORS.text} />
    </TouchableOpacity>
  )
}