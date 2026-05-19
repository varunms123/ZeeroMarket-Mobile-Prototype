import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';

interface AuctionTimerProps {
  endsAt: number;
}

export default function AuctionTimer({ endsAt }: AuctionTimerProps) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const difference = endsAt - Date.now();
      
      if (difference <= 0) {
        return 'CONCLUDED'; 
      }

      const totalSeconds = Math.floor(difference / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    setTimeLeft(calculateTime());

    const processTicker = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(processTicker);
  }, [endsAt]);

  const isEnded = timeLeft === 'CONCLUDED';

  return (
    <Text style={[styles.badge, isEnded && styles.badgeEnded]}>
      {isEnded ? '🔒 ' : '⏳ '} {timeLeft}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
    backgroundColor: '#FEF3C7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    overflow: 'hidden'
  },
  badgeEnded: {
    color: '#EF4444',
    backgroundColor: '#FEE2E2'
  }
});