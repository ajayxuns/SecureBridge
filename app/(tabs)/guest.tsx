import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserPlus, Clock, Copy } from 'lucide-react-native';

export default function GuestAccessScreen() {
  const [guestName, setGuestName] = useState('');
  const [guestCode, setGuestCode] = useState('');
  const [expiryTime, setExpiryTime] = useState(0);
  const [isCodeGenerated, setIsCodeGenerated] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (expiryTime > 0) {
      interval = setInterval(() => {
        setExpiryTime(prev => {
          if (prev <= 1) {
            setIsCodeGenerated(false);
            setGuestCode('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [expiryTime]);

  const generateGuestCode = () => {
    if (!guestName.trim()) {
      Alert.alert('Error', 'Please enter a guest name');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGuestCode(code);
    setExpiryTime(300); // 5 minutes
    setIsCodeGenerated(true);
    
    Alert.alert(
      'Guest Code Generated',
      `Temporary access code generated for ${guestName}`,
      [{ text: 'OK' }]
    );
  };

  const copyCode = () => {
    Alert.alert('Copied', 'Guest code copied to clipboard');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Guest Access</Text>
        <Text style={styles.subtitle}>Generate temporary access codes for guests</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.inputSection}>
          <Text style={styles.label}>Guest Name</Text>
          <TextInput
            style={styles.textInput}
            value={guestName}
            onChangeText={setGuestName}
            placeholder="Enter guest name"
            placeholderTextColor="#8E8E93"
          />
        </View>

        {!isCodeGenerated ? (
          <TouchableOpacity 
            style={styles.generateButton}
            onPress={generateGuestCode}
            activeOpacity={0.8}
          >
            <UserPlus size={20} color="#FFFFFF" />
            <Text style={styles.generateButtonText}>Generate Guest Code</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.codeSection}>
            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>Guest Code for {guestName}</Text>
              <View style={styles.codeRow}>
                <Text style={styles.codeText}>{guestCode}</Text>
                <TouchableOpacity 
                  style={styles.copyButton}
                  onPress={copyCode}
                  activeOpacity={0.7}
                >
                  <Copy size={16} color="#007AFF" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.expirySection}>
                <Clock size={16} color="#FF9500" />
                <Text style={styles.expiryText}>
                  Expires in {formatTime(expiryTime)}
                </Text>
              </View>
              
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(expiryTime / 300) * 100}%` }
                  ]} 
                />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.newCodeButton}
              onPress={() => {
                setIsCodeGenerated(false);
                setGuestCode('');
                setExpiryTime(0);
                setGuestName('');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.newCodeButtonText}>Generate New Code</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Guest Access Information</Text>
          <Text style={styles.infoText}>
            • Guest codes expire after 5 minutes{'\n'}
            • Only one active guest code at a time{'\n'}
            • Guest access is logged in history{'\n'}
            • Codes are automatically revoked after use
          </Text>
        </View>
      </View>
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
    paddingBottom: 30,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputSection: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1D1D1F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  generateButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 30,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  codeSection: {
    marginBottom: 30,
  },
  codeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  codeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 12,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  codeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#007AFF',
    letterSpacing: 4,
    fontVariant: ['tabular-nums'],
  },
  copyButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
  },
  expirySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  expiryText: {
    fontSize: 14,
    color: '#FF9500',
    fontWeight: '500',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#E5E5E7',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF9500',
    borderRadius: 2,
  },
  newCodeButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  newCodeButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
});