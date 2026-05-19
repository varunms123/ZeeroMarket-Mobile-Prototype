import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAppDispatch } from "../../store/store";
import { useState } from "react";
import { loginSuccess } from "../../store/slices/authSlice";

type UserRole = 'buyer' | 'supplier' | 'admin';

const LoginScreen = () => {
    const dispatch = useAppDispatch();

    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');

    const handleAuthSubmit = () => {
        const clearEmail = email.trim().toLowerCase();
        const clearPassword = password.trim();
        const clearConfirmPassword = confirmPassword.trim();

        if (!clearEmail || !clearPassword || (isSignup && !clearConfirmPassword)) {
            Alert.alert('Required fields', 'Please complete all form input criteria.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(clearEmail)) {
            Alert.alert('Invalid Email', 'Please use a valid structural format for your email identity.');
            return;
        }

        if (clearPassword.length < 6) {
            Alert.alert('Security Notice', 'Account password threshold must contain at least 6 characters');
            return;
        }

        if (isSignup && clearPassword !== clearConfirmPassword) {
            Alert.alert('Password Mismatch', 'Your entered passwords do not align correctly.');
            return;
        }

        if (isSignup) {
            Alert.alert(
                'Registration Successful!', 
                `New ${selectedRole} profile registered for ${clearEmail}. Logging in...`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            dispatch(loginSuccess({
                                email: clearEmail,
                                role: selectedRole,
                            }));
                        }
                    }
                ]
            );
        } else {
            dispatch(loginSuccess({
                email: clearEmail,
                role: selectedRole,
            }));
        }
    };

    return (
        <KeyboardAvoidingView style={styles.outerContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollWrapper} keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
                <View style={styles.brandHeroArea}>
                    <Text style={styles.brandLogoEmoji}>🌐</Text>
                    <Text style={styles.brandTitleText}>B2B Global Trade</Text>
                    <Text style={styles.brandSubtitleText}>
                        {isSignup ? 'Create a brand new system identity profile' : 'Access your entire account dashboard'}
                    </Text>
                </View>

                <View style={styles.authFormCard}>
                    <Text style={styles.fieldHeading}>Select Workspace Profile</Text>
                    <View style={styles.roleSelectionContainer}>
                        <TouchableOpacity
                            style={[styles.roleSelectCard, selectedRole === 'buyer' && styles.roleCardActive]}
                            onPress={() => setSelectedRole('buyer')}
                        >
                            <Text style={[styles.roleCardIcon, selectedRole === 'buyer' && styles.roleTextActive]}>🛒</Text>
                            <Text style={[styles.roleCardLabel, selectedRole === 'buyer' && styles.roleTextActive]}>Buyer</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.roleSelectCard, selectedRole === 'supplier' && styles.roleCardActive]}
                            onPress={() => setSelectedRole('supplier')}
                        >
                            <Text style={[styles.roleCardIcon, selectedRole === 'supplier' && styles.roleTextActive]}>📦</Text>
                            <Text style={[styles.roleCardLabel, selectedRole === 'supplier' && styles.roleTextActive]}>Supplier</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.roleSelectCard, selectedRole === 'admin' && styles.roleCardActive]}
                            onPress={() => setSelectedRole('admin')}
                        >
                            <Text style={[styles.roleCardIcon, selectedRole === 'admin' && styles.roleTextActive]}>🛡️</Text>
                            <Text style={[styles.roleCardLabel, selectedRole === 'admin' && styles.roleTextActive]}>Admin</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.fieldHeading}>Email Address</Text>
                    <TextInput
                        style={styles.textInputStyle}
                        placeholder="name@enterprise.com"
                        placeholderTextColor="#94A3B8"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Text style={styles.fieldHeading}>Password Key</Text>
                    <TextInput
                        style={styles.textInputStyle}
                        placeholder="••••••••"
                        placeholderTextColor="#94A3B8"
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={password}
                        onChangeText={setPassword}
                    />

                    {isSignup && (
                        <View>
                            <Text style={styles.fieldHeading}>Confirm Password Key</Text>
                            <TextInput
                                style={styles.textInputStyle}
                                placeholder="••••••••"
                                placeholderTextColor="#94A3B8"
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>
                    )}

                    <TouchableOpacity style={styles.actionSubmitBtn} onPress={handleAuthSubmit}>
                        <Text style={styles.actionSubmitBtnText}>
                            {isSignup ? 'Register System Account' : 'Authenticate Profile'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.toggleStateLink} onPress={() => setIsSignup(!isSignup)}>
                        <Text style={styles.toggleStateLinkText}>
                            {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.testingCredentialHintBox}>
                    <Text style={styles.hintTitleText}>💡 Quick Testing Identities:</Text>
                    <Text style={styles.hintBodyText}>• Sign Up or Log In with any credentials</Text>
                    <Text style={styles.hintBodyText}>• Admin role requires explicit card matching validation</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#F8FAFC'
    },
    scrollWrapper: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24
    },
    brandHeroArea: {
        alignItems: 'center',
        marginBottom: 24
    },
    brandLogoEmoji: {
        fontSize: 48,
        marginBottom: 12
    },
    brandTitleText: {
        fontSize: 26,
        fontWeight: '800',
        color: '#0F172A',
        letterSpacing: -0.5
    },
    brandSubtitleText: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 6,
        textAlign: 'center',
        lineHeight: 20
    },
    authFormCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
        elevation: 4
    },
    fieldHeading: {
        fontSize: 13,
        fontWeight: '700',
        color: '#334155',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.3
    },
    textInputStyle: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#0F172A',
        fontWeight: '600',
        marginBottom: 20
    },
    roleSelectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    roleSelectCard: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        marginHorizontal: 4
    },
    roleCardActive: {
        backgroundColor: '#EFF6FF',
        borderColor: '#3B82F6'
    },
    roleCardIcon: {
        fontSize: 20,
        marginBottom: 4
    },
    roleCardLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748B'
    },
    roleTextActive: {
        color: '#1D4ED8'
    },
    actionSubmitBtn: {
        backgroundColor: '#1E3A8A',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8
    },
    actionSubmitBtnText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700'
    },
    toggleStateLink: {
        alignItems: 'center',
        marginTop: 16,
        paddingVertical: 4
    },
    toggleStateLinkText: {
        fontSize: 14,
        color: '#1D4ED8',
        fontWeight: '600'
    },
    testingCredentialHintBox: {
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        padding: 14,
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    hintTitleText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#475569',
        marginBottom: 4
    },
    hintBodyText: {
        fontSize: 12,
        color: '#64748B',
        lineHeight: 18
    }
});

export default LoginScreen;