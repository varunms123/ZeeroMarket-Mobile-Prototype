import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { approveProduct, rejectProduct } from '../../store/slices/dataSlice';
import { logoutSuccess } from '../../store/slices/authSlice';

export default function AdminPanelScreen() {
  const dispatch = useAppDispatch();
  const { email } = useAppSelector((state) => state.auth);
  const { products, auctions } = useAppSelector((state) => state.data);

  const [currentSection, setCurrentSection] = useState<'pending' | 'active' | 'users'>('pending');

  const pendingProducts = products.filter(p => !p.isApproved).map(p => ({ ...p, type: 'Fixed Price', displayPrice: p.price }));
  const pendingAuctions = auctions.filter(a => !a.isApproved).map(a => ({ ...a, type: 'Auction', displayPrice: a.currentBid }));
  const allPendingItems = [...pendingProducts, ...pendingAuctions];

  const activeProducts = products.filter(p => p.isApproved).map(p => ({ ...p, type: 'Fixed Price', displayPrice: p.price }));
  const activeAuctions = auctions.filter(a => a.isApproved).map(a => ({ ...a, type: 'Auction', displayPrice: a.currentBid }));
  const allActiveItems = [...activeProducts, ...activeAuctions];

  const mockRegisteredUsers = [
    { id: 'u1', email: 'supplier@zeero.com', role: 'supplier' },
    { id: 'u2', email: 'buyer@zeero.com', role: 'buyer' },
    { id: 'u3', email: 'admin@zeero.com', role: 'admin' },
    { id: 'u4', email: 'enterprise_vendor@test.com', role: 'supplier' },
  ];

  const handleApprove = (id: string, title: string) => {
    dispatch(approveProduct(id));
    Alert.alert('Listing Verified', `"${title}" has been published to the live marketplace catalog.`);
  };

  const handleReject = (id: string, title: string) => {
    dispatch(rejectProduct(id));
    Alert.alert('Listing Rejected', `"${title}" has been permanently purged from the pipeline queues.`);
  };

  return (
    <ScrollView style={styles.outerCanvas} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBox}>
        <View>
          <Text style={styles.welcomeText}>System Operations Dashboard</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => dispatch(logoutSuccess())}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.segmentTrack}>
        <TouchableOpacity 
          style={[styles.segmentOption, currentSection === 'pending' && styles.segmentActive]}
          onPress={() => setCurrentSection('pending')}
        >
          <Text style={[styles.segmentLabel, currentSection === 'pending' && styles.labelActive]}>
            ⏳ Pending ({allPendingItems.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.segmentOption, currentSection === 'active' && styles.segmentActive]}
          onPress={() => setCurrentSection('active')}
        >
          <Text style={[styles.segmentLabel, currentSection === 'active' && styles.labelActive]}>
            ✅ Active ({allActiveItems.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.segmentOption, currentSection === 'users' && styles.segmentActive]}
          onPress={() => setCurrentSection('users')}
        >
          <Text style={[styles.segmentLabel, currentSection === 'users' && styles.labelActive]}>
            👥 Users ({mockRegisteredUsers.length})
          </Text>
        </TouchableOpacity>
      </View>

      {currentSection === 'pending' ? (
        allPendingItems.length === 0 ? (
          <Text style={styles.emptyPrompt}>The review backlog is fully clear! No items waiting.</Text>
        ) : (
          allPendingItems.map(item => (
            <View key={item.id} style={styles.dataCard}>
              <View style={styles.cardTopRow}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.typeBadge}>{item.type}</Text>
              </View>
              <Text style={styles.cardCost}>Value Threshold: ₹{item.displayPrice}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>

              <View style={styles.actionBtnGroup}>
                <TouchableOpacity 
                  style={[styles.modBtn, styles.rejectBtn]} 
                  onPress={() => handleReject(item.id, item.title)}
                >
                  <Text style={styles.rejectBtnText}>Reject Item</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modBtn, styles.approveBtn]} 
                  onPress={() => handleApprove(item.id, item.title)}
                >
                  <Text style={styles.approveBtnText}>Approve & Publish</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )
      ) : currentSection === 'active' ? (
        allActiveItems.length === 0 ? (
          <Text style={styles.emptyPrompt}>No active live catalog objects currently indexed.</Text>
        ) : (
          allActiveItems.map(item => (
            <View key={item.id} style={[styles.dataCard, { borderColor: '#10B981' }]}>
              <View style={styles.cardTopRow}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={[styles.typeBadge, { backgroundColor: '#D1FAE5', color: '#065F46' }]}>{item.type}</Text>
              </View>
              <Text style={styles.cardCost}>Current Market Price: ₹{item.displayPrice}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
              <Text style={styles.liveIndicatorText}>🟢 Currently Broadcasting Live on Marketplace</Text>
            </View>
          ))
        )
      ) : (
        <View style={styles.userContainerBox}>
          <Text style={styles.boxTitleLabel}>System Authenticated Database Accounts</Text>
          {mockRegisteredUsers.map(user => (
            <View key={user.id} style={styles.userListItemRow}>
              <View>
                <Text style={styles.userEmailText}>{user.email}</Text>
                <Text style={styles.userIdText}>ID Reference String: {user.id}</Text>
              </View>
              <Text style={[
                styles.roleTextTag,
                user.role === 'admin' ? styles.tagAdmin : user.role === 'supplier' ? styles.tagSupplier : styles.tagBuyer
              ]}>
                {user.role}
              </Text>
            </View>
          ))}
        </View>
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outerCanvas: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  headerBox: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    backgroundColor: '#ffffff', padding: 16, borderRadius: 16, marginBottom: 20, 
    borderWidth: 1, borderColor: '#E2E8F0'
  },
  welcomeText: { fontSize: 11, color: '#64748B', fontWeight: '600', textTransform: 'uppercase' },
  userEmail: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginTop: 2 },
  logoutBtn: { backgroundColor: '#FEE2E2', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  logoutText: { color: '#EF4444', fontSize: 12, fontWeight: '700' },
  segmentTrack: { flexDirection: 'row', backgroundColor: '#E2E8F0', padding: 4, borderRadius: 12, marginBottom: 20 },
  segmentOption: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  segmentActive: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, elevation: 2 },
  segmentLabel: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  labelActive: { color: '#1E3A8A' },
  dataCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B', flex: 1, marginRight: 8 },
  typeBadge: { fontSize: 11, fontWeight: '700', backgroundColor: '#EFF6FF', color: '#1E40AF', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6, textTransform: 'uppercase', overflow: 'hidden' },
  cardCost: { fontSize: 14, fontWeight: '800', color: '#1E3A8A', marginBottom: 6 },
  cardDesc: { fontSize: 13, color: '#64748B', lineHeight: 18 },
  actionBtnGroup: { flexDirection: 'row', marginTop: 14, borderTopWidth: 1, borderColor: '#F1F5F9', paddingTop: 12 },
  modBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  rejectBtn: { backgroundColor: '#FFF5F5', marginRight: 8, borderWidth: 1, borderColor: '#FEE2E2' },
  rejectBtnText: { color: '#EF4444', fontWeight: '700', fontSize: 13 },
  approveBtn: { backgroundColor: '#1E3A8A' },
  approveBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
  liveIndicatorText: { fontSize: 12, fontWeight: '700', color: '#10B981', marginTop: 12, fontStyle: 'italic' },
  emptyPrompt: { color: '#64748B', textAlign: 'center', marginTop: 32, fontSize: 14, fontWeight: '600' },
  userContainerBox: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  boxTitleLabel: { fontSize: 12, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: 12, borderBottomWidth: 1, borderColor: '#F1F5F9', paddingBottom: 8 },
  userListItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#F1F5F9' },
  userEmailText: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  userIdText: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  roleTextTag: { fontSize: 11, fontWeight: '700', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6, textTransform: 'capitalize', overflow: 'hidden' },
  tagAdmin: { backgroundColor: '#FEE2E2', color: '#991B1B' },
  tagSupplier: { backgroundColor: '#FEF3C7', color: '#92400E' },
  tagBuyer: { backgroundColor: '#D1FAE5', color: '#065F46' }
});