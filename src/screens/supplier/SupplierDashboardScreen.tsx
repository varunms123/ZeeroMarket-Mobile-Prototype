import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { logoutSuccess } from '../../store/slices/authSlice';

export default function SupplierDashboardScreen({ navigation }: { navigation: any }) {
  const dispatch = useAppDispatch();
  const { email } = useAppSelector((state) => state.auth);
  const { products, auctions } = useAppSelector((state) => state.data);

  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'live'>('all');

  const myProducts = products.map(p => ({ ...p, type: 'Fixed Price', displayPrice: p.price }));
  const myAuctions = auctions.map(a => ({ ...a, type: 'Auction Room', displayPrice: a.currentBid }));
  const combinedCatalog = [...myProducts, ...myAuctions];

  const filteredCatalog = combinedCatalog.filter(item => {
    if (filterTab === 'pending') return !item.isApproved;
    if (filterTab === 'live') return item.isApproved;
    return true; 
  });

  return (
    <View style={styles.screenFrame}>
      <View style={styles.headerBox}>
        <View>
          <Text style={styles.welcomeText}>Supplier Central Hub</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => dispatch(logoutSuccess())}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, { borderColor: '#3B82F6' }]}>
          <Text style={styles.metricNumber}>{combinedCatalog.length}</Text>
          <Text style={styles.metricLabel}>Total Items</Text>
        </View>
        <View style={[styles.metricCard, { borderColor: '#F59E0B' }]}>
          <Text style={[styles.metricNumber, { color: '#D97706' }]}>{combinedCatalog.filter(i => !i.isApproved).length}</Text>
          <Text style={styles.metricLabel}>In Review</Text>
        </View>
        <View style={[styles.metricCard, { borderColor: '#10B981' }]}>
          <Text style={[styles.metricNumber, { color: '#059669' }]}>{combinedCatalog.filter(i => i.isApproved).length}</Text>
          <Text style={styles.metricLabel}>Published Live</Text>
        </View>
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>My Inventory Catalog</Text>
        <TouchableOpacity 
          style={styles.floatingActionBtn} 
          onPress={() => navigation.navigate('Add Product Space')}
        >
          <Text style={styles.floatingActionText}>+ New Listing</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterTrack}>
        {(['all', 'pending', 'live'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterOption, filterTab === tab && styles.filterOptionActive]}
            onPress={() => setFilterTab(tab)}
          >
            <Text style={[styles.filterText, filterTab === tab && styles.filterTextActive]}>
              {tab === 'all' ? '📁 All' : tab === 'pending' ? '⏳ Pending' : '🟢 Approved'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredCatalog}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyPromptText}>No catalog elements match this status filter layout.</Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.catalogCard, item.isApproved ? styles.borderLive : styles.borderPending]}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitleText} numberOfLines={1}>{item.title}</Text>
              <Text style={[styles.typeTag, item.type === 'Auction Room' ? styles.tagAuction : styles.tagFixed]}>
                {item.type}
              </Text>
            </View>
            
            <Text style={styles.cardDescText} numberOfLines={2}>{item.description}</Text>
            
            <View style={styles.cardFooterRow}>
              <Text style={styles.priceValueText}>₹{item.displayPrice}</Text>
              <View style={styles.statusBadgeFrame}>
                <View style={[styles.statusDot, { backgroundColor: item.isApproved ? '#10B981' : '#F59E0B' }]} />
                <Text style={[styles.statusLabelText, { color: item.isApproved ? '#059669' : '#D97706' }]}>
                  {item.isApproved ? 'Live on Market' : 'Pending Verification'}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenFrame: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  headerBox: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    backgroundColor: '#ffffff', padding: 16, borderRadius: 16, marginBottom: 16, 
    borderWidth: 1, borderColor: '#E2E8F0'
  },
  welcomeText: { fontSize: 11, color: '#64748B', fontWeight: '600', textTransform: 'uppercase' },
  userEmail: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginTop: 2 },
  logoutBtn: { backgroundColor: '#FEE2E2', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  logoutText: { color: '#EF4444', fontSize: 12, fontWeight: '700' },
  
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  metricCard: { flex: 1, backgroundColor: '#ffffff', borderWidth: 1, padding: 12, borderRadius: 12, alignItems: 'center', marginHorizontal: 4 },
  metricNumber: { fontSize: 18, fontWeight: '800', color: '#1E3A8A' },
  metricLabel: { fontSize: 10, color: '#64748B', fontWeight: '600', marginTop: 2, textTransform: 'uppercase' },
  
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  floatingActionBtn: { backgroundColor: '#1E3A8A', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  floatingActionText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  
  filterTrack: { flexDirection: 'row', backgroundColor: '#E2E8F0', padding: 4, borderRadius: 10, marginBottom: 16 },
  filterOption: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  filterOptionActive: { backgroundColor: '#ffffff' },
  filterText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  filterTextActive: { color: '#1E3A8A' },
  
  catalogCard: { backgroundColor: '#ffffff', padding: 14, borderRadius: 14, marginBottom: 12, borderWidth: 1 },
  borderPending: { borderColor: '#E2E8F0' },
  borderLive: { borderColor: '#A7F3D0' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTitleText: { fontSize: 14, fontWeight: '700', color: '#1E293B', flex: 1, marginRight: 8 },
  typeTag: { fontSize: 10, fontWeight: '700', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, overflow: 'hidden' },
  tagAuction: { backgroundColor: '#EFF6FF', color: '#1E40AF' },
  tagFixed: { backgroundColor: '#F1F5F9', color: '#475569' },
  cardDescText: { fontSize: 12, color: '#64748B', lineHeight: 16, marginBottom: 10 },
  cardFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#F1F5F9', paddingTop: 8 },
  priceValueText: { fontSize: 15, fontWeight: '800', color: '#1E3A8A' },
  statusBadgeFrame: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusLabelText: { fontSize: 11, fontWeight: '700' },
  emptyPromptText: { color: '#94A3B8', textAlign: 'center', marginTop: 40, fontSize: 13, fontWeight: '600', fontStyle: 'italic' }
});