import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fingerprint, Send, Bluetooth, Wifi, WifiOff, BluetoothOff } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const [otp, setOtp] = useState('123456');
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(true);
  const [isWifiConnected, setIsWifiConnected] = useState(true);
  const [otpTimer, setOtpTimer] = useState(30);

  // Generate new OTP every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setOtp(newOtp);
      setOtpTimer(30);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setOtpTimer(prev => prev > 0 ? prev - 1 : 30);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleBiometricAuth = () => {
    Alert.alert(
      'Biometric Authentication',
      'Place your finger on the sensor to authenticate',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Simulate Success', onPress: () => Alert.alert('Success', 'Authentication successful!') }
      ]
    );
  };

  const handleSendToPC = () => {
    Alert.alert(
      'Send to PC',
      `OTP ${otp} has been sent to your connected devices`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with connection indicators */}
      <View style={styles.header}>
        <View style={styles.connectionIndicators}>
          <View style={[styles.connectionItem, isBluetoothConnected && styles.connected]}>
            {isBluetoothConnected ? (
              <Bluetooth size={16} color={isBluetoothConnected ? '#007AFF' : '#8E8E93'} />
            ) : (
              <BluetoothOff size={16} color="#8E8E93" />
            )}
          </View>
          <View style={[styles.connectionItem, isWifiConnected && styles.connected]}>
            {isWifiConnected ? (
              <Wifi size={16} color={isWifiConnected ? '#007AFF' : '#8E8E93'} />
            ) : (
              <WifiOff size={16} color="#8E8E93" />
            )}
          </View>
        </View>
      </View>

      {/* Welcome message */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome {user?.name || 'User'}</Text>
        <Text style={styles.subtitleText}>Your secure access code</Text>
      </View>

      {/* OTP Display */}
      <View style={styles.otpSection}>
        <View style={styles.otpContainer}>
          <Text style={styles.otpText}>{otp}</Text>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>Expires in {otpTimer}s</Text>
            <View style={styles.timerBar}>
              <View 
                style={[
                  styles.timerProgress, 
                  { width: `${(otpTimer / 30) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </View>
      </View>

      {/* Biometric Authentication */}
      <TouchableOpacity 
        style={styles.biometricButton}
        onPress={handleBiometricAuth}
        activeOpacity={0.7}
      >
        <View style={styles.biometricIconContainer}>
          <Fingerprint size={32} color="#007AFF" />
        </View>
        <Text style={styles.biometricText}>Touch to authenticate</Text>
      </TouchableOpacity>

      {/* Send to PC Button */}
      <TouchableOpacity 
        style={styles.sendButton}
        onPress={handleSendToPC}
        activeOpacity={0.8}
      >
        <Send size={20} color="#FFFFFF" />
        <Text style={styles.sendButtonText}>Send to PC</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  connectionIndicators: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  connectionItem: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  connected: {
    backgroundColor: '#E3F2FD',
  },
  welcomeSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '400',
  },
  otpSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  otpContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 280,
  },
  otpText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#007AFF',
    letterSpacing: 8,
    marginBottom: 16,
    fontVariant: ['tabular-nums'],
  },
  timerContainer: {
    alignItems: 'center',
    width: '100%',
  },
  timerText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  timerBar: {
    width: '100%',
    height: 3,
    backgroundColor: '#E5E5E7',
    borderRadius: 2,
    overflow: 'hidden',
  },
  timerProgress: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  biometricButton: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  biometricIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  biometricText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});