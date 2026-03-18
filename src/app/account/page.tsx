"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '@/context/UserAuthContext';
import { Button } from '@/components/ui/Button';
import { User, LogOut, Package, Lock, UserPlus, Edit3, Check, X } from 'lucide-react';
import Link from 'next/link';

type Mode = 'login' | 'signup';

interface Profile {
    name: string;
    email: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
}

export default function AccountPage() {
    const { user, login, signup, logout, isLoading } = useUserAuth();
    const router = useRouter();

    // Auth
    const [mode, setMode] = useState<Mode>('login');
    const [authName, setAuthName] = useState('');
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [authBusy, setAuthBusy] = useState(false);

    // Profile
    const [profile, setProfile] = useState<Profile | null>(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState<Profile>({ name: '', email: '', phone: '', addressLine: '', city: '', state: '', pincode: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');

    useEffect(() => {
        if (!user) return;
        fetch('/api/auth/me', { headers: { Authorization: `Bearer ${user.token}` } })
            .then(r => r.json())
            .then(d => {
                setProfile(d);
                setForm({ name: d.name, email: d.email, phone: d.phone ?? '', addressLine: d.addressLine ?? '', city: d.city ?? '', state: d.state ?? '', pincode: d.pincode ?? '' });
            });
    }, [user]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError(''); setAuthBusy(true);
        const error = mode === 'login'
            ? await login(authEmail, authPassword)
            : await signup(authName, authEmail, authPassword);
        setAuthBusy(false);
        if (error) setAuthError(error);
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true); setMsg(''); setErr('');
        const res = await fetch('/api/auth/me', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
            body: JSON.stringify(form),
        });
        const data = await res.json();
        setSaving(false);
        if (!res.ok) { setErr(data.error ?? 'Failed to save'); return; }
        setProfile({ ...form });
        setEditing(false);
        setMsg('Changes saved');
        setTimeout(() => setMsg(''), 3000);
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    // ── Login / Signup ──
    if (!user) return (
        <div className="container mx-auto px-6 py-16 max-w-md">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-lavender-light rounded-full flex items-center justify-center mx-auto mb-4">
                        {mode === 'login' ? <Lock size={24} className="text-primary" /> : <UserPlus size={24} className="text-primary" />}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
                </div>
                <form onSubmit={handleAuth} className="space-y-4">
                    {mode === 'signup' && (
                        <input required type="text" value={authName} onChange={e => setAuthName(e.target.value)}
                            placeholder="Full name"
                            className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm" />
                    )}
                    <input required type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm" />
                    <input required type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm" />
                    {authError && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{authError}</p>}
                    <Button type="submit" className="w-full" size="lg" disabled={authBusy}>
                        {authBusy ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                    </Button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-6">
                    {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setAuthError(''); }}
                        className="text-primary font-medium hover:underline">
                        {mode === 'login' ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
    );

    // ── Profile ──
    return (
        <div className="container mx-auto px-6 md:px-12 py-12 max-w-2xl">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-lavender-light rounded-full flex items-center justify-center">
                        <User size={26} className="text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{profile?.name ?? user.name}</h1>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>
                <button onClick={() => { logout(); router.push('/'); }}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors">
                    <LogOut size={16} /> Sign out
                </button>
            </div>

            {/* Orders shortcut */}
            <Link href="/account/orders">
                <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-6 py-4 mb-6 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                        <Package size={20} className="text-primary" />
                        <span className="font-medium text-gray-900">My Orders</span>
                    </div>
                    <span className="text-gray-400 text-sm">View all →</span>
                </div>
            </Link>

            {/* Profile details */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold text-gray-900">Profile & Address</h2>
                    {!editing ? (
                        <button onClick={() => setEditing(true)}
                            className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                            <Edit3 size={14} /> Edit
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button onClick={() => { setEditing(false); setErr(''); }}
                                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
                                <X size={14} /> Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving}
                                className="flex items-center gap-1 text-sm text-primary font-medium hover:underline disabled:opacity-50">
                                <Check size={14} /> {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <FormRow label="Full Name" value={form.name} editing={editing}
                        onChange={v => setForm(p => ({ ...p, name: v }))} placeholder="Rahul Sharma" />
                    <FormRow label="Email" value={form.email} editing={false}
                        onChange={() => {}} placeholder="" />
                    <FormRow label="Phone" value={form.phone} editing={editing}
                        onChange={v => setForm(p => ({ ...p, phone: v }))} placeholder="+91 98765 43210" />
                    <div className="sm:col-span-2">
                        <FormRow label="Street Address" value={form.addressLine} editing={editing}
                            onChange={v => setForm(p => ({ ...p, addressLine: v }))} placeholder="123, MG Road" />
                    </div>
                    <FormRow label="City" value={form.city} editing={editing}
                        onChange={v => setForm(p => ({ ...p, city: v }))} placeholder="Bengaluru" />
                    <FormRow label="State" value={form.state} editing={editing}
                        onChange={v => setForm(p => ({ ...p, state: v }))} placeholder="Karnataka" />
                    <FormRow label="PIN Code" value={form.pincode} editing={editing}
                        onChange={v => setForm(p => ({ ...p, pincode: v }))} placeholder="560001" />
                </div>

                {msg && <p className="mt-4 text-sm text-green-600 bg-green-50 border border-green-100 rounded-xl px-4 py-3">{msg}</p>}
                {err && <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{err}</p>}
            </div>
        </div>
    );
}

function FormRow({ label, value, editing, onChange, placeholder }: {
    label: string; value: string; editing: boolean;
    onChange: (v: string) => void; placeholder: string;
}) {
    return (
        <div>
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            {editing ? (
                <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all" />
            ) : (
                <p className={`text-sm py-2 ${value ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                    {value || '—'}
                </p>
            )}
        </div>
    );
}
