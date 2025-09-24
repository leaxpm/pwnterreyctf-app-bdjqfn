
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import Icon from '../components/Icon';

export default function EmailVerificationScreen() {
  console.log('EmailVerificationScreen rendered');
  
  const handleGoBack = () => {
    console.log('Going back to login screen');
    router.replace('/login');
  };

  const handleGoHome = () => {
    console.log('Going to home screen');
    router.replace('/');
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={{ flex: 1 }}>
        {/* Header with Back Arrow */}
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
            Verificación de Email
          </Text>
        </View>

        {/* Content */}
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
          {/* Icon */}
          <View style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.primary + '20',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 32,
          }}>
            <Icon name="mail" size={60} color={colors.primary} />
          </View>

          {/* Title */}
          <Text style={[
            commonStyles.title, 
            { 
              fontSize: 28, 
              textAlign: 'center', 
              marginBottom: 16,
              color: colors.text 
            }
          ]}>
            ¡Revisa tu email!
          </Text>

          {/* Description */}
          <Text style={[
            commonStyles.subtitle, 
            { 
              textAlign: 'center', 
              marginBottom: 40,
              color: colors.textSecondary,
              lineHeight: 24,
              fontSize: 16,
            }
          ]}>
            Hemos enviado un enlace de verificación a tu correo electrónico. 
            {'\n\n'}
            Por favor, revisa tu bandeja de entrada y haz clic en el enlace para verificar tu cuenta antes de iniciar sesión.
          </Text>

          {/* Info Box */}
          <View style={{
            backgroundColor: colors.primary + '10',
            padding: 20,
            borderRadius: 12,
            borderLeftWidth: 4,
            borderLeftColor: colors.primary,
            marginBottom: 40,
            width: '100%',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Icon name="information-circle" size={20} color={colors.primary} style={{ marginRight: 12, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={[
                  commonStyles.textSecondary, 
                  { 
                    fontSize: 14, 
                    lineHeight: 20,
                    color: colors.text 
                  }
                ]}>
                  <Text style={{ fontWeight: '600' }}>Consejo:</Text> Si no encuentras el email, revisa tu carpeta de spam o correo no deseado.
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ width: '100%' }}>
            <TouchableOpacity
              style={[buttonStyles.primary, { marginBottom: 12 }]}
              onPress={handleGoBack}
            >
              <Text style={buttonStyles.primaryText}>
                Volver al Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={buttonStyles.secondary}
              onPress={handleGoHome}
            >
              <Text style={buttonStyles.secondaryText}>
                Ir al Inicio
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={{
          marginTop: 20,
          padding: 16,
          backgroundColor: colors.background,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.border,
          marginHorizontal: 20,
          marginBottom: 20,
        }}>
          <Text style={[
            commonStyles.textSecondary, 
            { 
              fontSize: 12, 
              textAlign: 'center',
              color: colors.textSecondary 
            }
          ]}>
            Una vez que verifiques tu email, podrás acceder a todas las funciones de PwnterreyCTF.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
