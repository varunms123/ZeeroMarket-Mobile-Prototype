import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { placeBidSuccess } from '../../store/slices/dataSlice';
import { logoutSuccess } from '../../store/slices/authSlice';
import AuctionTimer from '../../components/AuctionTimer';

export default function BrowseScreen() {
  const dispatch = useAppDispatch();
  const { email } = useAppSelector((state) => state.auth);
  const { products, auctions } = useAppSelector((state) => state.data);

  const [activeTab, setActiveTab] = useState<'marketplace' | 'auctions'>('marketplace');
  const [bidValues, setBidValues] = useState<{ [key: string]: string }>({});

  const verifiedProducts = products.filter(p => p.isApproved);
  const verifiedAuctions = auctions.filter(a => a.isApproved);

  const executePlaceBid = (auctionId: string, currentHighest: number, endsAt: number) => {
    if (Date.now() >= endsAt) {
      Alert.alert('Room Closed', 'This auction listing has concluded. No further offers accepted.');
      return;
    }

    const enteredAmount = bidValues[auctionId];
    const numericAmount = parseFloat(enteredAmount);

    if (!enteredAmount || isNaN(numericAmount)) {
      Alert.alert('Invalid Entry', 'Please type a valid numerical value to bid.');
      return;
    }

    if (numericAmount <= currentHighest) {
      Alert.alert('Bid Rejected', `Your bid must beat the current high offer of ₹${currentHighest}`);
      return;
    }

    dispatch(placeBidSuccess({
      auctionId,
      amount: numericAmount,
      userEmail: email || 'buyer@test.com'
    }));

    setBidValues(prev => ({ ...prev, [auctionId]: '' }));
    Alert.alert('Bid Placed!', `You are now the leading bidder at ₹${numericAmount}`);
  };

  return (
    <ScrollView style={styles.layoutBase} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBox}>
        <View>
          <Text style={styles.welcomeText}>B2B Marketplace</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => dispatch(logoutSuccess())}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'marketplace' && styles.tabActive]}
          onPress={() => setActiveTab('marketplace')}
        >
          <Text style={[styles.tabText, activeTab === 'marketplace' && styles.tabTextActive]}>🛒 Direct Products</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'auctions' && styles.tabActive]}
          onPress={() => setActiveTab('auctions')}
        >
          <Text style={[styles.tabText, activeTab === 'auctions' && styles.tabTextActive]}>🔨 Live Bidding</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'marketplace' ? (
        verifiedProducts.length === 0 ? (
          <Text style={styles.emptyNotice}>No standard marketplace products verified yet.</Text>
        ) : (
          verifiedProducts.map(item => (
            <View key={item.id} style={styles.itemCard}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemCost}>Wholesale Cost: ₹{item.price}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
          ))
        )
      ) : (
        verifiedAuctions.length === 0 ? (
          <Text style={styles.emptyNotice}>No active auction rooms open currently.</Text>
        ) : (
          verifiedAuctions.map(room => {
            const isClosed = Date.now() >= room.endsAt;
            return (
              <View key={room.id} style={[styles.itemCard, isClosed && styles.itemCardDisabled]}>
                <View style={styles.topRowSpace}>
                  <Text style={[styles.itemTitle, { flex: 1, marginRight: 8 }, isClosed && styles.textMuted]}>
                    {room.title}
                  </Text>
                  <AuctionTimer endsAt={room.endsAt} />
                </View>
                
                <Text style={[styles.itemDescription, isClosed && styles.textMuted]}>{room.description}</Text>

                <View style={styles.biddingMetadataPlate}>
                  <View>
                    <Text style={styles.metaLabel}>{isClosed ? 'Final Price Close' : 'Top Offer'}</Text>
                    <Text style={[styles.metaValue, isClosed && styles.metaValueClosed]}>₹{room.currentBid}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.metaLabel}>{isClosed ? 'Winning Bidder' : 'Leader Email'}</Text>
                    <Text style={styles.bidderEmailText} numberOfLines={1}>{room.highestBidder || 'No active bids'}</Text>
                  </View>
                </View>

                <View style={styles.bidFormInputRow}>
                  <TextInput 
                    style={[styles.numericInput, isClosed && styles.inputDisabled]}
                    placeholder={isClosed ? "Bidding Concluded" : `Min. ₹${room.currentBid + 1}`}
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    editable={!isClosed} 
                    value={bidValues[room.id] || ''}
                    onChangeText={(text) => setBidValues(prev => ({ ...prev, [room.id]: text }))}
                  />
                  <TouchableOpacity 
                    style={[styles.actionBidBtn, isClosed && styles.btnDisabled]}
                    onPress={() => executePlaceBid(room.id, room.currentBid, room.endsAt)}
                    disabled={isClosed}
                  >
                    <Text style={styles.actionBidBtnText}>Place Bid</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layoutBase: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  headerBox: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    backgroundColor: '#ffffff', padding: 16, borderRadius: 16, marginBottom: 20, 
    borderWidth: 1, borderColor: '#E2E8F0'
  },
  welcomeText: { fontSize: 11, color: '#64748B', fontWeight: '600', textTransform: 'uppercase' },
  userEmail: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginTop: 2 },
  logoutBtn: { backgroundColor: '#FEE2E2', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  logoutText: { color: '#EF4444', fontSize: 12, fontWeight: '700' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#E2E8F0', padding: 4, borderRadius: 12, marginBottom: 20 },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  tabTextActive: { color: '#1E3A8A' },
  itemCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  itemCardDisabled: { borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
  topRowSpace: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  itemTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  itemCost: { fontSize: 15, fontWeight: '800', color: '#1E3A8A', marginVertical: 4 },
  itemDescription: { fontSize: 13, color: '#64748B', lineHeight: 18 },
  textMuted: { color: '#94A3B8' },
  emptyNotice: { color: '#64748B', textAlign: 'center', marginTop: 32, fontSize: 14, fontWeight: '600' },
  biddingMetadataPlate: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, marginTop: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  metaLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' },
  metaValue: { fontSize: 16, fontWeight: '800', color: '#10B981', marginTop: 2 },
  metaValueClosed: { color: '#64748B' },
  bidderEmailText: { fontSize: 13, fontWeight: '600', color: '#334155', marginTop: 4, maxWidth: 140 },
  bidFormInputRow: { flexDirection: 'row', marginTop: 12 },
  numericInput: { flex: 1, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, height: 42, fontSize: 14, color: '#0F172A', fontWeight: '600' },
  inputDisabled: { backgroundColor: '#E2E8F0', borderColor: '#CBD5E1', color: '#94A3B8' },
  actionBidBtn: { backgroundColor: '#1E3A8A', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center', marginLeft: 10, height: 42 },
  btnDisabled: { backgroundColor: '#94A3B8' },
  actionBidBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 }
});