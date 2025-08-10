import { Link, useRouter } from 'expo-router'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { styles } from './../../assets/styles/auth.styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import imagePath from '@/src/assets/images/imagePath';
import { useState } from 'react';
import Feather from "@expo/vector-icons/Feather";
import { COLORS } from "@/src/constants/colors";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function Page() {
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
    const [error, setError] = useState("");
  

  // Handle the submission of the sign-in 

  const onSignInPress = ()=>{
    router.replace("/(root)")
  }
   return (
    <KeyboardAwareScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={100}
        >
        <View style={styles.container}>
            <Image style={styles.illustration} source={imagePath.img4} />
          
      <Text style={styles.title} >Welcom Back</Text>
      {error ? (
          <View style={styles.errorBox}>
            <Feather name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <AntDesign
                name="closecircleo"
                size={20}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      <TextInput
      style={[styles.input, error && styles.errorInput]}
        autoCapitalize="none"
        value={emailAddress}
          placeholderTextColor="#9A8478"
        placeholder="Enter email"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          placeholderTextColor="#9A8478"
          onChangeText={(password) => setPassword(password)}
        />
       <TouchableOpacity style={styles.button} onPress={onSignInPress}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

      <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>
          <Link href="/sign-up" asChild >
          <TouchableOpacity>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}