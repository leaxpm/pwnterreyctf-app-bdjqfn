
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import Icon from '../components/Icon';

export default function LoginScreen() {
  const { signIn, signUp, error } = useAuth();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleAuth = async () => {
    // Validation
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (authMode === 'signup' && !name.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre');
      return;
    }

    if (authMode === 'signup' && name.trim().length < 2) {
      Alert.alert('Error', 'El nombre debe tener al menos 2 caracteres');
      return;
    }

    setLoading(true);

    try {
      if (authMode === 'signin') {
        console.log('Attempting to sign in user:', email);
        const result = await signIn(email.trim(), password);
        if (result.success) {
          console.log('Sign in successful, redirecting to home');
          Alert.alert('Éxito', result.message);
          router.replace('/');
          resetForm();
        } else {
          console.log('Sign in failed:', result.message);
          Alert.alert('Error de inicio de sesión', result.message);
        }
      } else {
        console.log('Attempting to sign up user:', email);
        const result = await signUp(email.trim(), password, name.trim());
        console.log('SignUp result:', result);
        
        if (result.success) {
          console.log('Account created successfully, redirecting to verification screen');
          resetForm();
          
          // Navigate immediately
          console.log('About to navigate to /email-verification');
          router.push('/email-verification');
          
          // Show success message after a short delay
          setTimeout(() => {
            Alert.alert(
              'Cuenta creada exitosamente',
              'Hemos enviado un enlace de verificación a tu correo electrónico. Por favor verifica tu cuenta antes de iniciar sesión.'
            );
          }, 100);
        } else {
          console.log('Sign up failed:', result.message);
          Alert.alert('Error de registro', result.message);
        }
        
        /* Original signup code - commented for testing
        const result = await signUp(email.trim(), password, name.trim());
        console.log('SignUp result:', result);
        
        if (result.success) {
          console.log('Account created successfully, redirecting to verification screen');
          resetForm();
          
          // Navigate immediately
          console.log('About to navigate to /email-verification');
          router.push('/email-verification');
          
          // Show success message after a short delay
          setTimeout(() => {
            Alert.alert(
              'Cuenta creada exitosamente',
              'Hemos enviado un enlace de verificación a tu correo electrónico. Por favor verifica tu cuenta antes de iniciar sesión.'
            );
          }, 100);
        } else {
          console.log('Sign up failed:', result.message);
          Alert.alert('Error de registro', result.message);
        }
        */
      }
    } catch (err) {
      console.error('Auth error:', err);
      Alert.alert('Error', 'Ocurrió un error inesperado. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
  };

  const switchMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
    resetForm();
  };

  const handleGoBack = () => {
    console.log('Going back to welcome screen');
    router.back();
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView 
        style={commonStyles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 20,
          paddingBottom: 10,
        }}>
          <TouchableOpacity
            onPress={handleGoBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.background,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Icon name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[commonStyles.title, { fontSize: 24 }]}>
            {authMode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </Text>
        </View>

        {/* Content */}
        <View style={{ flex: 1, padding: 20, paddingTop: 10 }}>
          {/* Logo Section */}
          <View style={{
            alignItems: 'center',
            marginBottom: 40,
          }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.primary + '20',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <Icon name="shield-checkmark" size={40} color={colors.primary} />
            </View>
            <Text style={[commonStyles.subtitle, { textAlign: 'center', color: colors.textSecondary }]}>
              {authMode === 'signin' 
                ? 'Bienvenido de vuelta a PwnterreyCTF' 
                : 'Únete a la comunidad PwnterreyCTF'
              }
            </Text>
          </View>

          {/* Error Display */}
          {error && (
            <View style={{
              backgroundColor: colors.error + '20',
              padding: 12,
              borderRadius: 8,
              borderLeftWidth: 4,
              borderLeftColor: colors.error,
              marginBottom: 20,
            }}>
              <Text style={{ color: colors.error, fontSize: 14 }}>{error}</Text>
            </View>
          )}

          {/* Form */}
          <View style={{ marginBottom: 30 }}>
            {authMode === 'signup' && (
              <View style={{ marginBottom: 16 }}>
                <Text style={[commonStyles.label, { marginBottom: 8 }]}>Nombre completo</Text>
                <TextInput
                  style={[commonStyles.input, loading && { opacity: 0.6 }]}
                  placeholder="Ingresa tu nombre completo"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor={colors.textSecondary}
                  editable={!loading}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={{ marginBottom: 16 }}>
              <Text style={[commonStyles.label, { marginBottom: 8 }]}>Email</Text>
              <TextInput
                style={[commonStyles.input, loading && { opacity: 0.6 }]}
                placeholder="ejemplo@correo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                placeholderTextColor={colors.textSecondary}
                editable={!loading}
              />
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text style={[commonStyles.label, { marginBottom: 8 }]}>Contraseña</Text>
              <TextInput
                style={[commonStyles.input, loading && { opacity: 0.6 }]}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete={authMode === 'signin' ? 'password' : 'new-password'}
                placeholderTextColor={colors.textSecondary}
                editable={!loading}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ marginBottom: 20 }}>
            <TouchableOpacity
              style={[buttonStyles.primary, { marginBottom: 12 }, loading && { opacity: 0.6 }]}
              onPress={handleAuth}
              disabled={loading}
            >
              <Text style={buttonStyles.primaryText}>
                {loading ? 'Procesando...' : (authMode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta')}
              </Text>
            </TouchableOpacity>



            <TouchableOpacity
              style={buttonStyles.secondary}
              onPress={switchMode}
              disabled={loading}
            >
              <Text style={buttonStyles.secondaryText}>
                {authMode === 'signin' 
                  ? '¿No tienes cuenta? Regístrate' 
                  : '¿Ya tienes cuenta? Inicia sesión'
                }
              </Text>
            </TouchableOpacity>
          </View>

          {/* Additional Info */}
          {authMode === 'signup' && (
            <View style={{
              backgroundColor: colors.primary + '10',
              padding: 16,
              borderRadius: 8,
              marginTop: 20,
            }}>
              <Text style={[commonStyles.textSecondary, { textAlign: 'center', fontSize: 14 }]}>
                Al crear una cuenta, aceptas nuestros términos de servicio y política de privacidad.
              </Text>
            </View>
          )}

          {/* Help Text */}
          <View style={{
            marginTop: 30,
            padding: 16,
            backgroundColor: colors.background,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            <Text style={[commonStyles.textSecondary, { fontSize: 12, textAlign: 'center' }]}>
              {authMode === 'signin' 
                ? 'Si tienes problemas para iniciar sesión, verifica que tu email esté confirmado.'
                : 'Después de registrarte, recibirás un email de confirmación. Debes verificar tu cuenta antes de poder iniciar sesión.'
              }
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
