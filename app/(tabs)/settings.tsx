import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fingerprint, Clock, Shield, Smartphone, Trash2, Plus, ChevronRight, LogOut } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

interface TrustedDevice {
  id: string;
  name: string;
  type: string;
  lastUsed: string;
}

const mockTrustedDevices: TrustedDevice[] = [
  { id: '1', name: 'DESKTOP-AJAY-PC', type: 'Windows PC', lastUsed: '2 hours ago' },
  { id: '2', name: 'MacBook Air M2', type: 'macOS', lastUsed: '1 day ago' },
  { id: '3', name: 'LAPTOP-HOME', type: 'Windows Laptop', lastUsed: '3 days ago' },
];

export default function SettingsScreen() {
  // Settings state
  const { user, signOut } = useAuth();
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [autoExpireEnabled, setAutoExpireEnabled] = useState(true);
  const [expireTimer, setExpireTimer] = useState(30); // seconds
  const [trustedDevices, setTrustedDevices] = useState(mockTrustedDevices);

  const handleBiometricToggle = (value: boolean) => {
    setBiometricEnabled(value);
    if (value) {
      Alert.alert(
        'Biometric Authentication',
        'Biometric authentication has been enabled. You can now use fingerprint to authenticate.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleAutoExpireToggle = (value: boolean) => {
    setAutoExpireEnabled(value);
    Alert.alert(
      'Auto-Expire Timer',
      value ? 'OTP codes will now automatically expire.' : 'OTP codes will not auto-expire.',
      [{ text: 'OK' }]
    );
  };

  const removeTrustedDevice = (deviceId: string) => {
    const device = trustedDevices.find(d => d.id === deviceId);
    Alert.alert(
      'Remove Trusted Device',
      `Are you sure you want to remove "${device?.name}" from trusted devices?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setTrustedDevices(devices => devices.filter(d => d.id !== deviceId));
          }
        }
      ]
    );
  };

  const addTrustedDevice = () => {
    Alert.alert(
      'Add Trusted Device',
      'To add a new trusted device, initiate a connection from that device and authenticate successfully.',
      [{ text: 'OK' }]
    );
  };

  const changeExpireTimer = () => {
    Alert.alert(
      'Change Timer',
      'Select OTP expiration time:',
      [
        { text: '15 seconds', onPress: () => setExpireTimer(15) },
        { text: '30 seconds', onPress: () => setExpireTimer(30) },
        { text: '60 seconds', onPress: () => setExpireTimer(60) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/sign-in');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure your security preferences</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Fingerprint size={20} color="#007AFF" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Biometric Authentication</Text>
                <Text style={styles.settingDescription}>
                  {biometricEnabled ? 'Enabled' : 'Use fingerprint to authenticate'}
                </Text>
              </View>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={handleBiometricToggle}
              trackColor={{ false: '#E5E5E7', true: '#34C759' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Clock size={20} color="#007AFF" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Auto-Expire Timer</Text>
                <Text style={styles.settingDescription}>
                  {autoExpireEnabled ? `OTP expires after ${expireTimer}s` : 'Manual expiration only'}
                </Text>
              </View>
            </View>
            <Switch
              value={autoExpireEnabled}
              onValueChange={handleAutoExpireToggle}
              trackColor={{ false: '#E5E5E7', true: '#34C759' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {autoExpireEnabled && (
            <TouchableOpacity style={styles.timerSetting} onPress={changeExpireTimer}>
              <View style={styles.settingInfo}>
                <Shield size={20} color="#007AFF" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Timer Duration</Text>
                  <Text style={styles.settingDescription}>{expireTimer} seconds</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>

        {/* Trusted Devices */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trusted Devices</Text>
            <TouchableOpacity onPress={addTrustedDevice} style={styles.addButton}>
              <Plus size={16} color="#007AFF" />
            </TouchableOpacity>
          </View>

          {trustedDevices.map((device) => (
            <View key={device.id} style={styles.deviceItem}>
              <View style={styles.deviceInfo}>
                <Smartphone size={18} color="#007AFF" />
                <View style={styles.deviceText}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceType}>{device.type} • {device.lastUsed}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => removeTrustedDevice(device.id)}
                style={styles.removeButton}
              >
                <Trash2 size={16} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>User</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>2025.01.12</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Security Level</Text>
            <Text style={[styles.infoValue, { color: '#34C759' }]}>High</Text>
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LogOut size={20} color="#FF3B30" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '400',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 16,
  },
  addButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  timerSetting: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  deviceItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceText: {
    marginLeft: 12,
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  deviceType: {
    fontSize: 14,
    color: '#8E8E93',
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
  },
  infoItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D1D1F',
  },
  infoValue: {
    fontSize: 16,
    color: '#8E8E93',
  },
  signOutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FFEBEE',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF3B30',
  },
});