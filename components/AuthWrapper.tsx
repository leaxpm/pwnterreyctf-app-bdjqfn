
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, usePathname } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Allow access to login and email verification screens without authentication
  const publicRoutes = ['/login', '/email-verification'];
  const isPublicRoute = publicRoutes.includes(pathname);
  
  console.log('AuthWrapper - Current pathname:', pathname);
  console.log('AuthWrapper - Is public route:', isPublicRoute);
  console.log('AuthWrapper - User exists:', !!user);

  // Always allow access to public routes regardless of auth state
  if (isPublicRoute) {
    console.log('AuthWrapper - Allowing access to public route');
    return <>{children}</>;
  }

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

  // If user is not authenticated and trying to access a protected route, show welcome screen
  if (!user) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
          {/* Hero Section */}
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
            onPress={() => router.push('/login')}
          >
            <Text style={[buttonStyles.primaryText, { fontSize: 18 }]}>Comenzar</Text>
          </TouchableOpacity>


        </View>
      </SafeAreaView>
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
