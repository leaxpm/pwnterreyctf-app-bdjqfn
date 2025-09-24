
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import Icon from './Icon';
import SimpleBottomSheet from './BottomSheet';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading } = useAuth();
  const [showAuthSheet, setShowAuthSheet] = useState(false);

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Icon name="reload" size={48} color={colors.primary} />
          <Text style={[commonStyles.text, { marginTop: 16 }]}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <>
        <SafeAreaView style={commonStyles.container}>
          <ScrollView style={commonStyles.container} contentContainerStyle={{ flexGrow: 1 }}>
            {/* Header */}
            <View style={[commonStyles.header, { borderBottomWidth: 0 }]}>
              <Text style={commonStyles.title}>PwnterreyCTF</Text>
            </View>

            {/* Hero Section */}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
              <View style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: colors.primary + '20',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 32,
              }}>
                <Icon name="shield-checkmark" size={60} color={colors.primary} />
              </View>

              <Text style={[commonStyles.title, { fontSize: 28, textAlign: 'center', marginBottom: 12 }]}>
                Bienvenido a PwnterreyCTF
              </Text>
              
              <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginBottom: 40, lineHeight: 22 }]}>
                Únete a la comunidad de ciberseguridad más activa de México. 
                Participa en CTFs, talleres y charlas especializadas.
              </Text>

              {/* Features */}
              <View style={{ width: '100%', marginBottom: 40 }}>
                <FeatureItem 
                  emoji="🚩" 
                  title="Eventos CTF" 
                  description="Participa en competencias de ciberseguridad" 
                />
                <FeatureItem 
                  emoji="🛠️" 
                  title="Talleres Especializados" 
                  description="Aprende de expertos en seguridad informática" 
                />
                <FeatureItem 
                  emoji="💬" 
                  title="Charlas y Networking" 
                  description="Conecta con profesionales del sector" 
                />
                <FeatureItem 
                  emoji="🏆" 
                  title="Sistema de Badges" 
                  description="Desbloquea logros por tu participación" 
                />
              </View>

              <TouchableOpacity
                style={[buttonStyles.primary, { width: '100%', paddingVertical: 16 }]}
                onPress={() => setShowAuthSheet(true)}
              >
                <Text style={[buttonStyles.primaryText, { fontSize: 18 }]}>Comenzar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>

        <AuthBottomSheet 
          isVisible={showAuthSheet}
          onClose={() => setShowAuthSheet(false)}
        />
      </>
    );
  }

  return <>{children}</>;
}

interface FeatureItemProps {
  emoji: string;
  title: string;
  description: string;
}

function FeatureItem({ emoji, title, description }: FeatureItemProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
      <View style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
      }}>
        <Text style={{ fontSize: 24 }}>{emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[commonStyles.subtitle, { fontSize: 16, marginBottom: 4 }]}>
          {title}
        </Text>
        <Text style={commonStyles.textSecondary}>
          {description}
        </Text>
      </View>
    </View>
  );
}

interface AuthBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

function AuthBottomSheet({ isVisible, onClose }: AuthBottomSheetProps) {
  const { signIn, signUp, error } = useAuth();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (authMode === 'signup' && !name.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre');
      return;
    }

    setLoading(true);

    try {
      if (authMode === 'signin') {
        const result = await signIn(email, password);
        if (result.success) {
          Alert.alert('Éxito', result.message);
          onClose();
          resetForm();
        } else {
          Alert.alert('Error', result.message);
        }
      } else {
        const result = await signUp(email, password, name);
        if (result.success) {
          Alert.alert('Éxito', result.message);
          if (result.needsVerification) {
            Alert.alert(
              'Verificación requerida', 
              'Hemos enviado un enlace de verificación a tu email. Por favor verifica tu cuenta antes de iniciar sesión.'
            );
          }
          onClose();
          resetForm();
        } else {
          Alert.alert('Error', result.message);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Ocurrió un error inesperado');
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

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={onClose}>
      <View style={{ padding: 20 }}>
        <Text style={[commonStyles.title, { marginBottom: 20, textAlign: 'center' }]}>
          {authMode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </Text>

        {error && (
          <View style={{
            backgroundColor: colors.error + '20',
            padding: 12,
            borderRadius: 8,
            borderLeftWidth: 4,
            borderLeftColor: colors.error,
            marginBottom: 16,
          }}>
            <Text style={{ color: colors.error }}>{error}</Text>
          </View>
        )}

        {authMode === 'signup' && (
          <TextInput
            style={[commonStyles.input, { marginBottom: 16 }]}
            placeholder="Nombre completo"
            value={name}
            onChangeText={setName}
            placeholderTextColor={colors.textSecondary}
            editable={!loading}
          />
        )}

        <TextInput
          style={[commonStyles.input, { marginBottom: 16 }]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={colors.textSecondary}
          editable={!loading}
        />

        <TextInput
          style={[commonStyles.input, { marginBottom: 24 }]}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={colors.textSecondary}
          editable={!loading}
        />

        <TouchableOpacity
          style={[buttonStyles.primary, { marginBottom: 12 }, loading && { opacity: 0.6 }]}
          onPress={handleAuth}
          disabled={loading}
        >
          <Text style={buttonStyles.primaryText}>
            {loading ? 'Cargando...' : (authMode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta')}
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
    </SimpleBottomSheet>
  );
}

