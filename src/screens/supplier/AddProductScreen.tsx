import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert 
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { addProduct, addAuction } from '../../store/slices/dataSlice';
import { logoutSuccess } from '../../store/slices/authSlice';

export default function AddProductScreen() {
  const dispatch = useAppDispatch();
  const { email } = useAppSelector((state) => state.auth);
  
  // 🔑 Pull the global lists to render the Supplier's self-tracking dashboard
  const { products, auctions } = useAppSelector((state) => state.data);

  // Form input field states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [listingType, setListingType] = useState<'product' | 'auction'>('product');
  const [durationMinutes, setDurationMinutes] = useState('60'); // Default auction runtime: 1 hour

  // 🔑 Extract and filter history items submitted by this specific supplier account
  // Note: Since mock items don't have owner fields, we trace them safely or show newly added state logs
  const myPendingProducts = products.filter(p => !p.isApproved);
  const myApprovedProducts = products.filter(p => p.isApproved);

  const myPendingAuctions = auctions.filter(a => !a.isApproved);
  const myApprovedAuctions = auctions.filter(a => a.isApproved);

  const handlePublishListing = () => {
    const cleanTitle = title.trim();
    const cleanDesc = description.trim();
    const numericPrice = parseFloat(price.trim());

    if (!cleanTitle || !cleanDesc || isNaN(numericPrice) || numericPrice <= 0) {
      Alert.alert('Validation Error', 'Please complete all core fields with legitimate values.');
      return;
    }

    if (listingType === 'product') {
      dispatch(addProduct({
        title: cleanTitle,
        description: cleanDesc,
        price: numericPrice,
        image: 'https://via.placeholder.com/150',
        isAuction: false,
        highestBid: 0,
        highestBidder: ''
      }));
      Alert.alert('Submitted!', 'Your product has been sent to the Admin approval pipeline.');
    } else {
      const minutes = parseInt(durationMinutes.trim());
      if (isNaN(minutes) || minutes <= 0) {
        Alert.alert('Invalid Duration', 'Please enter a valid number of minutes for the auction.');
        return;
      }
      
      const closingTimestamp = Date.now() + (minutes * 60 * 1000);

      dispatch(addAuction({
        title: cleanTitle,
        description: cleanDesc,
        currentBid: numericPrice,
        highestBidder: '',
        endsAt: closingTimestamp
      }));
      Alert.alert('Auction Submitted!', 'Your live bidding catalog item has been sent to the Admin queue.');
    }

    // 🔑 FIXED: Complete structural cleanup avoids lingering dynamic input numbers
    setTitle('');
    setDescription('');
    setPrice('');
    setDurationMinutes('60');
  };

  return (
    <ScrollView style={styles.outerFrame} contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBox}>
        <View>
          <Text style={styles.welcomeText}>Supplier Workspace</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => dispatch(logoutSuccess())}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.screenMainTitle}>Create New Listing</Text>

      <View style={styles.toggleTrack}>
        <TouchableOpacity 
          style={[styles.toggleOption, listingType === 'product' && styles.toggleOptionActive]}
          onPress={() => setListingType('product')}
        >
          <Text style={[styles.toggleText, listingType === 'product' && styles.toggleTextActive]}>🛒 Fixed Price Product</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleOption, listingType === 'auction' && styles.toggleOptionActive]}
          onPress={() => setListingType('auction')}
        >
          <Text style={[styles.toggleText, listingType === 'auction' && styles.toggleTextActive]}>🔨 Auction Bidding</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>Item Title</Text>
        <TextInput 
          style={styles.textInput} 
          placeholder="e.g. Bulk Premium Cotton Coils" 
          placeholderTextColor="#94A3B8"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.inputLabel}>Detailed Specifications Description</Text>
        <TextInput 
          style={[styles.textInput, styles.textArea]} 
          placeholder="Provide dimensions, materials, shipping batch sizing details..." 
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.inputLabel}>
          {listingType === 'product' ? 'Wholesale Cost (₹)' : 'Starting Floor Price (₹)'}
        </Text>
        <TextInput 
          style={styles.textInput} 
          placeholder="0.00" 
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        {listingType === 'auction' && (
          <View style={styles.animatedAuctionBlock}>
            <Text style={styles.inputLabel}>Bidding Clock Lifetime Window (Minutes)</Text>
            <TextInput 
              style={styles.textInput} 
              placeholder="60" 
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={durationMinutes}
              onChangeText={setDurationMinutes}
            />
          </View>
        )}

        <TouchableOpacity style={styles.submitBtn} onPress={handlePublishListing}>
          <Text style={styles.submitBtnText}>Submit to Admin Verification Queue</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.screenMainTitle, { marginTop: 28, fontSize: 18 }]}>My Submissions Pipeline</Text>
      
      <View style={styles.historyContainer}>
        <Text style={styles.historySectionHeader}>⏳ Waiting For Admin Approval ({myPendingProducts.length + myPendingAuctions.length})</Text>
        
        {myPendingProducts.map((item, idx) => (
          <View key={`p-pend-${idx}`} style={styles.miniRowItem}>
            <Text style={styles.miniRowTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.badgePending}>Fixed Price</Text>
          </View>
        ))}

        {myPendingAuctions.map((item, idx) => (
          <View key={`a-pend-${idx}`} style={styles.miniRowItem}>
            <Text style={styles.miniRowTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.badgePending}>Auction Room</Text>
          </View>
        ))}

        {myPendingProducts.length === 0 && myPendingAuctions.length === 0 && (
          <Text style={styles.neutralMutedText}>No items currently awaiting verification review.</Text>
        )}
      </View>

      <View style={[styles.historyContainer, { borderColor: '#10B981', marginTop: 14 }]}>
        <Text style={[styles.historySectionHeader, { color: '#059669' }]}>✅ Active Live Listings ({myApprovedProducts.length + myApprovedAuctions.length})</Text>
        
        {myApprovedProducts.map((item, idx) => (
          <View key={`p-appr-${idx}`} style={styles.miniRowItem}>
            <Text style={styles.miniRowTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.badgeLive}>Marketplace</Text>
          </View>
        ))}

        {myApprovedAuctions.map((item, idx) => (
          <View key={`a-appr-${idx}`} style={styles.miniRowItem}>
            <Text style={styles.miniRowTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.badgeLive}>Live Auction</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outerFrame: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  headerBox: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    backgroundColor: '#ffffff', padding: 16, borderRadius: 16, marginBottom: 20, 
    borderWidth: 1, borderColor: '#E2E8F0'
  },
  welcomeText: { fontSize: 11, color: '#64748B', fontWeight: '600', textTransform: 'uppercase' },
  userEmail: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginTop: 2 },
  logoutBtn: { backgroundColor: '#FEE2E2', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  logoutText: { color: '#EF4444', fontSize: 12, fontWeight: '700' },
  screenMainTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  toggleTrack: { flexDirection: 'row', backgroundColor: '#E2E8F0', padding: 4, borderRadius: 12, marginBottom: 20 },
  toggleOption: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  toggleOptionActive: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2 },
  toggleText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  toggleTextActive: { color: '#1E3A8A' },
  formContainer: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#334155', marginBottom: 6, textTransform: 'uppercase' },
  textInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, padding: 12, fontSize: 14, color: '#0F172A', fontWeight: '600', marginBottom: 16 },
  textArea: { height: 90, textAlignVertical: 'top' },
  animatedAuctionBlock: { borderTopWidth: 1, borderColor: '#F1F5F9', paddingTop: 12 },
  submitBtn: { backgroundColor: '#1E3A8A', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  
  historyContainer: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#CBD5E1' },
  historySectionHeader: { fontSize: 12, fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: 10 },
  miniRowItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#F1F5F9' },
  miniRowTitle: { fontSize: 13, fontWeight: '600', color: '#1E293B', flex: 1, marginRight: 12 },
  neutralMutedText: { fontSize: 12, color: '#94A3B8', fontStyle: 'italic', textAlign: 'center', marginVertical: 8 },
  badgePending: { fontSize: 10, fontWeight: '700', color: '#B45309', backgroundColor: '#FEF3C7', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, overflow: 'hidden' },
  badgeLive: { fontSize: 10, fontWeight: '700', color: '#047857', backgroundColor: '#D1FAE5', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, overflow: 'hidden' }
});