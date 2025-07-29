import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Monitor, Smartphone, User, CircleCheck as CheckCircle, Circle as XCircle, Clock } from 'lucide-react-native';

interface AccessLog {
  id: string;
  device: string;
  deviceType: 'pc' | 'mobile' | 'guest';
  timestamp: string;
  status: 'success' | 'failed';
  user: string;
  location: string;
}

const mockHistory: AccessLog[] = [
  {
    id: '1',
    device: 'DESKTOP-AJAY-PC',
    deviceType: 'pc',
    timestamp: '2025-01-12 14:30:22',
    status: 'success',
    user: 'Ajay',
    location: 'Home Office',
  },
  {
    id: '2',
    device: 'iPhone 15 Pro',
    deviceType: 'mobile',
    timestamp: '2025-01-12 12:15:41',
    status: 'success',
    user: 'Ajay',
    location: 'Living Room',
  },
  {
    id: '3',
    device: 'MacBook Air M2',
    deviceType: 'pc',
    timestamp: '2025-01-12 09:45:13',
    status: 'failed',
    user: 'Ajay',
    location: 'Coffee Shop',
  },
  {
    id: '4',
    device: 'Guest Access',
    deviceType: 'guest',
    timestamp: '2025-01-11 16:22:05',
    status: 'success',
    user: 'Sarah Wilson',
    location: 'Home Office',
  },
  {
    id: '5',
    device: 'LAPTOP-HOME',
    deviceType: 'pc',
    timestamp: '2025-01-11 11:30:17',
    status: 'success',
    user: 'Ajay',
    location: 'Bedroom',
  },
  {
    id: '6',
    device: 'iPad Pro',
    deviceType: 'mobile',
    timestamp: '2025-01-11 08:15:44',
    status: 'success',
    user: 'Ajay',
    location: 'Kitchen',
  },
];

export default function HistoryScreen() {
  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'pc':
        return <Monitor size={18} color="#007AFF" />;
      case 'mobile':
        return <Smartphone size={18} color="#007AFF" />;
      case 'guest':
        return <User size={18} color="#FF9500" />;
      default:
        return <Monitor size={18} color="#007AFF" />;
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'success' ? (
      <CheckCircle size={16} color="#34C759" />
    ) : (
      <XCircle size={16} color="#FF3B30" />
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 2) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Access History</Text>
        <Text style={styles.subtitle}>Recent authentication attempts</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {mockHistory.map((log) => (
          <TouchableOpacity key={log.id} style={styles.logItem} activeOpacity={0.7}>
            <View style={styles.logHeader}>
              <View style={styles.deviceInfo}>
                {getDeviceIcon(log.deviceType)}
                <View style={styles.deviceDetails}>
                  <Text style={styles.deviceName}>{log.device}</Text>
                  <Text style={styles.userName}>{log.user}</Text>
                </View>
              </View>
              <View style={styles.statusContainer}>
                {getStatusIcon(log.status)}
              </View>
            </View>
            
            <View style={styles.logDetails}>
              <View style={styles.detailRow}>
                <Clock size={14} color="#8E8E93" />
                <Text style={styles.timestamp}>{formatTimestamp(log.timestamp)}</Text>
              </View>
              <Text style={styles.location}>{log.location}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Showing last 30 days of activity
        </Text>
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
  logItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceDetails: {
    marginLeft: 12,
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  userName: {
    fontSize: 14,
    color: '#8E8E93',
  },
  statusContainer: {
    padding: 4,
  },
  logDetails: {
    paddingLeft: 30,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 6,
  },
  location: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});