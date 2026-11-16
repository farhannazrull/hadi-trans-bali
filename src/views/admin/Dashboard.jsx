'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, limit, getDocs, doc, updateDoc, deleteDoc, writeBatch, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { Link } from '@/lib/router';
import { packages as staticPackages } from '../../data/packages';
import { posts as staticPosts } from '../../data/posts';
import { fleet as staticFleet } from '../../data/services';
import { testimonials as staticReviews } from '../../data/testimonials';

const AdminDashboard = () => {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const { language, t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [dbPackages, setDbPackages] = useState([]);
  const [dbPosts, setDbPosts] = useState([]);
  const [dbFleet, setDbFleet] = useState([]);
  const [dbReviews, setDbReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [showFleetModal, setShowFleetModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editingFleet, setEditingFleet] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, revenue: 0 });

  const ADMIN_EMAILS = ['haditransbali@gmail.com'];
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  const emptyPackage = { id: Date.now(), title: { en: '', id: '' }, duration: { en: 'Full Day', id: 'Seharian' }, hours: { en: '10-12 hours', id: '10-12 jam' }, description: { en: '', id: '' }, destinations: [''], startingPrice: 500000, image: '', featured: false, pricing: [{ car: "Avanza / Xenia", price: 600000, capacity: "1-5" }], mapUrl: '' };
  const emptyPost = { id: Date.now(), slug: '', category: 'Destinations', date: new Date().toISOString().split('T')[0], author: 'Hadi Team', image: '', title: { en: '', id: '' }, excerpt: { en: '', id: '' }, content: { en: '', id: '' }, footageType: 'youtube', footageUrl: '', footageCredit: '', tiktokEmbeds: [] };
  const emptyFleet = { id: Date.now(), name: '', nameId: '', capacity: '5-6 passengers', capacityId: '5-6 penumpang', image: '', pricing: [{ hours: 10, price: 750000 }, { hours: 12, price: 850000 }] };
  const emptyReview = { id: Date.now(), name: '', location: '', rating: 5, textId: '', textEn: '', tripId: '', tripEn: '', avatar: '', dateId: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }), dateEn: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), featured: true };

  useEffect(() => {
    if (isAdmin) {
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(100));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const bookingData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(bookingData);
        const s = bookingData.reduce((acc, curr) => {
          acc.total++;
          if (curr.status === 'pending') acc.pending++;
          if (curr.status === 'confirmed') { acc.confirmed++; acc.revenue += curr.estimatedPrice || 0; }
          return acc;
        }, { total: 0, pending: 0, confirmed: 0, revenue: 0 });
        setStats(s);
        setLoading(false);
      }, (e) => { console.error(e); setLoading(false); });
      loadPackages(); loadPosts(); loadFleet(); loadReviews();
      return () => unsubscribe();
    }
  }, [isAdmin]);

  const loadPackages = async () => { try { const snap = await getDocs(collection(db, 'packages')); setDbPackages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))); } catch (e) { console.error(e); } };
  const loadPosts = async () => { try { const snap = await getDocs(collection(db, 'posts')); setDbPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))); } catch (e) { console.error(e); } };
  const loadFleet = async () => { try { const snap = await getDocs(collection(db, 'fleet')); setDbFleet(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))); } catch (e) { console.error(e); } };
  const loadReviews = async () => { try { const snap = await getDocs(collection(db, 'reviews')); setDbReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))); } catch (e) { console.error(e); } };

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadPackages(),
        loadPosts(),
        loadFleet(),
        loadReviews()
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file, folder = 'uploads') => {
    if (!file) return null;
    setIsUploading(true);
    try {
      const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setIsUploading(false);
      return url;
    } catch (error) {
      console.error(error);
      setIsUploading(false);
      alert("Upload failed: " + error.message);
      return null;
    }
  };

  const migrateData = async () => {
    if (!window.confirm("Sync ALL data?")) return;
    setIsMigrating(true);
    try {
      const batch = writeBatch(db);
      staticPackages.forEach(pkg => batch.set(doc(db, 'packages', pkg.id.toString()), { ...pkg, updatedAt: new Date().toISOString() }));
      staticPosts.forEach(post => batch.set(doc(db, 'posts', post.slug), { ...post, updatedAt: new Date().toISOString() }));
      staticFleet.forEach(f => batch.set(doc(db, 'fleet', f.id.toString()), { ...f, updatedAt: new Date().toISOString() }));
      staticReviews.forEach(r => batch.set(doc(db, 'reviews', r.id.toString()), { ...r, updatedAt: new Date().toISOString() }));
      await batch.commit();
      alert("Saved");
      loadPackages(); loadPosts(); loadFleet(); loadReviews();
    } catch (e) { alert(e.message); }
    setIsMigrating(false);
  };

  const updateBookingStatus = async (id, newStatus) => {
    try { await updateDoc(doc(db, 'bookings', id), { status: newStatus }); } catch (e) { alert(e.message); }
  };

  const handleDelete = async (coll, id) => {
    if (!window.confirm(`Delete this item?`)) return;
    try { 
      await deleteDoc(doc(db, coll, id.toString())); 
      if (coll === 'packages') loadPackages();
      if (coll === 'posts') loadPosts();
      if (coll === 'fleet') loadFleet();
      if (coll === 'reviews') loadReviews();
    } catch (e) { alert(e.message); }
  };

  const handleSave = async (coll, data, id) => {
    try {
      await setDoc(doc(db, coll, id.toString()), { ...data, updatedAt: new Date().toISOString() });
      alert("Saved");
      setShowPackageModal(false); setShowBlogModal(false); setShowFleetModal(false); setShowReviewModal(false);
      if (coll === 'packages') loadPackages();
      if (coll === 'posts') loadPosts();
      if (coll === 'fleet') loadFleet();
      if (coll === 'reviews') loadReviews();
    } catch (e) { alert(e.message); }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-green-950 transition-colors"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c4935f]"></div></div>;
  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-dark-green-950 p-6 text-center">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Admin Hadi Trans Bali</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">Masuk dengan akun Google admin untuk melanjutkan.</p>
      <button onClick={signInWithGoogle} className="btn-3d btn-3d-green px-6 py-3 text-white rounded-xl text-sm font-medium">Masuk dengan Google</button>
    </div>
  );
  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-green-950 text-red-500 font-semibold p-6 text-center"><div><h1 className="text-2xl mb-2">Access Denied</h1><p className="text-gray-500 font-normal">No admin permission.</p><Link to="/" className="text-[#1a4d3e] mt-4 inline-block underline">Back to Home</Link></div></div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-dark-green-950 flex transition-colors overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-dark-green-900 border-r border-gray-200 dark:border-dark-green-800 fixed h-full z-30 transition-colors">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8"><img src="/image/logo.webp" alt="Logo" className="w-8 h-8 rounded-full" /><div><h2 className="font-semibold text-gray-900 dark:text-white leading-tight text-xs">Admin Panel</h2><p className="text-[8px] text-[#c4935f] font-semibold">Hadi Trans Bali</p></div></div>
          <nav className="space-y-1">
            {[
              { id: 'bookings', label: 'Bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
              { id: 'packages', label: 'Packages', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
              { id: 'blog', label: 'Blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
              { id: 'fleet', label: 'Fleet', icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12' },
              { id: 'reviews', label: 'Reviews', icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z' },
            ].map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-[color,background-color,border-color,opacity,transform,box-shadow] ${activeTab === item.id ? 'bg-[#1a4d3e] text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-dark-green-800'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>{item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-gray-100 dark:border-dark-green-800"><Link to="/" className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#1a4d3e] transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>Back to Site</Link></div>
      </aside>

      <main className="flex-1 lg:ml-64 p-6 lg:p-8 pt-10 overflow-y-auto h-screen custom-scrollbar">
        <header className="flex justify-between items-center mb-8">
          <div><h1 className="text-2xl font-semibold dark:text-white capitalize">{activeTab}</h1><p className="text-gray-500 text-xs">Manage your business</p></div>
          <div className="flex gap-2">
            <button onClick={migrateData} className="btn-3d btn-3d-bronze px-4 py-2 text-white rounded-lg text-xs font-semibold" disabled={isMigrating}>Sync DB</button>
            <button onClick={loadAllData} className="p-2 bg-white dark:bg-dark-green-900 border rounded-lg"><svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button>
          </div>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[ { l: 'Total', v: stats.total }, { l: 'Wait', v: stats.pending }, { l: 'OK', v: stats.confirmed }, { l: 'IDR', v: formatPrice(stats.revenue) } ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-dark-green-900 p-4 rounded-2xl border dark:border-dark-green-800"><p className="text-[8px] font-semibold text-gray-400 mb-1">{s.l}</p><p className="text-lg font-semibold dark:text-white">{s.v}</p></div>
          ))}
        </div>

        <div className="bg-white dark:bg-dark-green-900 rounded-[24px] border dark:border-dark-green-800 p-6 min-h-[400px]">
          {activeTab === 'bookings' && (
            <div className="overflow-x-auto text-xs"><table className="w-full text-left"><thead><tr className="text-gray-400 border-b dark:border-dark-green-800"><th className="py-3 px-2">Ref</th><th className="py-3 px-2">Name</th><th className="py-3 px-2">Type</th><th className="py-3 px-2 text-right">Action</th></tr></thead><tbody className="divide-y dark:divide-dark-green-800">{bookings.map(b => (
              <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-dark-green-800/20"><td className="py-3 px-2 font-mono font-semibold text-[#1a4d3e] dark:text-[#4ade80]">{b.reference}</td><td className="py-3 px-2 dark:text-white">{b.fullName}</td><td className="py-3 px-2 opacity-70 dark:text-gray-300 capitalize">{b.serviceType?.replace('-', ' ')}</td><td className="py-3 px-2 text-right flex justify-end gap-1">{b.status === 'pending' && <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className="p-1.5 text-green-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg></button>}<a href={`https://wa.me/${b.whatsapp}`} target="_blank" rel="noreferrer" className="p-1.5 text-blue-600"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a></td></tr>
            ))}</tbody></table></div>
          )}

          {activeTab === 'packages' && (
            <div className="space-y-4"><div className="flex justify-between"><h3 className="font-semibold dark:text-white text-sm">Packages</h3><button onClick={() => { setEditingPackage(emptyPackage); setShowPackageModal(true); }} className="text-xs bg-[#c4935f] text-white px-3 py-1 rounded-lg">Add</button></div><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{dbPackages.map(p => (
              <div key={p.id} className="bg-gray-50 dark:bg-dark-green-800/40 rounded-xl overflow-hidden border dark:border-dark-green-700"><img src={p.image} className="aspect-video w-full object-cover" /><div className="p-3"><h4 className="font-semibold dark:text-white text-xs line-clamp-1">{p.title?.en}</h4><div className="flex justify-between items-center mt-2"><span className="text-[11px] font-semibold text-[#4ade80]">{formatPrice(p.startingPrice)}</span><div className="flex gap-1"><button onClick={() => { setEditingPackage(p); setShowPackageModal(true); }} className="p-1 text-gray-400"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button><button onClick={() => handleDelete('packages', p.id)} className="p-1 text-red-400"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button></div></div></div></div>
            ))}</div></div>
          )}

          {activeTab === 'blog' && (
            <div className="space-y-4"><div className="flex justify-between"><h3 className="font-semibold dark:text-white text-sm">Blog</h3><button onClick={() => { setEditingPost(emptyPost); setShowBlogModal(true); }} className="text-xs bg-[#c4935f] text-white px-3 py-1 rounded-lg">New</button></div><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{dbPosts.map(p => (
              <div key={p.id} className="bg-gray-50 dark:bg-dark-green-800/40 rounded-xl overflow-hidden border dark:border-dark-green-700"><img src={p.image} className="aspect-video w-full object-cover" /><div className="p-3 flex justify-between"><h4 className="font-semibold dark:text-white text-[11px] line-clamp-1">{p.title?.en}</h4><div className="flex gap-1"><button onClick={() => { setEditingPost(p); setShowBlogModal(true); }} className="p-1 text-gray-400"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button></div></div></div>
            ))}</div></div>
          )}

          {activeTab === 'fleet' && (
            <div className="space-y-4"><div className="flex justify-between"><h3 className="font-semibold dark:text-white text-sm">Fleet</h3><button onClick={() => { setEditingFleet(emptyFleet); setShowFleetModal(true); }} className="text-xs bg-[#c4935f] text-white px-3 py-1 rounded-lg">Add</button></div><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{dbFleet.map(f => (
              <div key={f.id} className="bg-gray-50 dark:bg-dark-green-800/40 rounded-xl overflow-hidden border dark:border-dark-green-700 p-3 flex gap-3 items-center"><div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-1"><img src={f.image} className="max-h-full max-w-full object-contain" /></div><div className="flex-1"><h4 className="font-semibold dark:text-white text-xs">{f.name}</h4><div className="flex gap-2 mt-2"><button onClick={() => { setEditingFleet(f); setShowFleetModal(true); }} className="text-[11px] text-blue-500">Edit</button><button onClick={() => handleDelete('fleet', f.id)} className="text-[11px] text-red-500">Del</button></div></div></div>
            ))}</div></div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4"><div className="flex justify-between"><h3 className="font-semibold dark:text-white text-sm">Reviews</h3><button onClick={() => { setEditingReview(emptyReview); setShowReviewModal(true); }} className="text-xs bg-[#c4935f] text-white px-3 py-1 rounded-lg">Add</button></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{dbReviews.map(r => (
              <div key={r.id} className="bg-gray-50 dark:bg-dark-green-800/40 p-3 rounded-xl border dark:border-dark-green-700"><div className="flex justify-between"><h4 className="font-semibold dark:text-white text-xs">{r.name}</h4><button onClick={() => handleDelete('reviews', r.id)} className="text-red-400 text-[11px]">✕</button></div><p className="text-[11px] dark:text-gray-400 line-clamp-2 mt-1">"{r.textEn}"</p></div>
            ))}</div></div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {showPackageModal && editingPackage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div onClick={() => setShowPackageModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" /><motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="relative w-full max-w-2xl bg-white dark:bg-dark-green-900 rounded-[24px] overflow-hidden flex flex-col max-h-[90vh]"><div className="p-4 border-b dark:border-dark-green-800 flex justify-between items-center"><h3 className="font-semibold dark:text-white">Package</h3><button onClick={() => setShowPackageModal(false)} className="dark:text-white">✕</button></div><form onSubmit={(e) => { e.preventDefault(); handleSave('packages', editingPackage, editingPackage.id); }} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 gap-3"><input type="text" placeholder="Title EN" value={editingPackage.title.en} onChange={e => setEditingPackage({...editingPackage, title: {...editingPackage.title, en: e.target.value}})} className="w-full p-2 bg-gray-100 dark:bg-dark-green-950 rounded-lg dark:text-white text-xs" required /><input type="text" placeholder="Title ID" value={editingPackage.title.id} onChange={e => setEditingPackage({...editingPackage, title: {...editingPackage.title, id: e.target.value}})} className="w-full p-2 bg-gray-100 dark:bg-dark-green-950 rounded-lg dark:text-white text-xs" required /></div>
            <div className="grid grid-cols-2 gap-3"><input type="file" onChange={async (e) => { const file = e.target.files[0]; if (file) { const url = await uploadImage(file, 'packages'); if (url) setEditingPackage({...editingPackage, image: url}); } }} className="w-full text-[11px]" /><input type="number" placeholder="Price" value={editingPackage.startingPrice} onChange={e => setEditingPackage({...editingPackage, startingPrice: parseInt(e.target.value)})} className="w-full p-2 bg-gray-100 dark:bg-dark-green-950 rounded-lg dark:text-white text-xs" required /></div>
            <div className="space-y-2"><div className="flex justify-between"><label className="text-[11px] font-semibold text-gray-400">Destinations</label><button type="button" onClick={() => setEditingPackage({...editingPackage, destinations: [...editingPackage.destinations, '']})} className="text-[11px] text-[#4ade80]">+ ADD</button></div><div className="grid grid-cols-2 gap-2">{editingPackage.destinations.map((d, i) => (
              <div key={i} className="flex gap-1"><input type="text" value={d} onChange={e => { const nd = [...editingPackage.destinations]; nd[i] = e.target.value; setEditingPackage({...editingPackage, destinations: nd}); }} className="flex-1 p-1 bg-gray-50 dark:bg-dark-green-950 rounded text-[11px] dark:text-white" /><button type="button" onClick={() => setEditingPackage({...editingPackage, destinations: editingPackage.destinations.filter((_, idx) => idx !== i)})} className="text-red-500">✕</button></div>
            ))}</div></div>
            <textarea placeholder="Description..." value={editingPackage.description.en} onChange={e => setEditingPackage({...editingPackage, description: {...editingPackage.description, en: e.target.value, id: e.target.value}})} className="w-full p-2 bg-gray-100 dark:bg-dark-green-950 rounded-lg dark:text-white text-xs h-20" />
            <button type="submit" className="btn-3d btn-3d-green w-full py-3 text-white rounded-xl font-semibold text-xs">{isUploading ? 'Uploading...' : 'Save Package'}</button>
          </form></motion.div></div>
        )}

        {showBlogModal && editingPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div onClick={() => setShowBlogModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" /><motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="relative w-full max-w-2xl bg-white dark:bg-dark-green-900 rounded-[24px] overflow-hidden flex flex-col shadow-lg"><div className="p-4 border-b dark:border-dark-green-800 flex justify-between items-center"><h3 className="font-semibold dark:text-white">Blog</h3><button onClick={() => setShowBlogModal(false)} className="dark:text-white">✕</button></div><form onSubmit={(e) => { e.preventDefault(); handleSave('posts', editingPost, editingPost.slug || editingPost.id); }} className="p-6 space-y-4 overflow-y-auto"><input type="text" placeholder="Title" value={editingPost.title.en} onChange={e => setEditingPost({...editingPost, title: {en: e.target.value, id: e.target.value}})} className="w-full p-2 bg-gray-100 dark:bg-dark-green-950 rounded-lg dark:text-white text-xs" required /><input type="text" placeholder="Slug" value={editingPost.slug} onChange={e => setEditingPost({...editingPost, slug: e.target.value})} className="w-full p-2 bg-gray-100 dark:bg-dark-green-950 rounded-lg dark:text-white text-xs" required /><input type="file" onChange={async (e) => { const file = e.target.files[0]; if (file) { const url = await uploadImage(file, 'blog'); if (url) setEditingPost({...editingPost, image: url}); } }} className="w-full text-[11px]" /><textarea placeholder="Content (HTML)..." value={editingPost.content.en} onChange={e => setEditingPost({...editingPost, content: {en: e.target.value, id: e.target.value}})} className="w-full p-2 bg-gray-100 dark:bg-dark-green-950 rounded-lg dark:text-white h-48 font-mono text-[11px]" /><button type="submit" className="btn-3d btn-3d-green w-full py-3 text-white rounded-xl font-semibold text-xs">{isUploading ? 'Uploading...' : 'Publish'}</button></form></motion.div></div>
        )}

        {showFleetModal && editingFleet && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div onClick={() => setShowFleetModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" /><motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="relative w-full max-w-md bg-white dark:bg-dark-green-900 rounded-[24px] overflow-hidden flex flex-col p-6 shadow-lg"><h3 className="font-semibold dark:text-white mb-4">Fleet Editor</h3><form onSubmit={(e) => { e.preventDefault(); handleSave('fleet', editingFleet, editingFleet.id); }} className="space-y-4"><input type="text" placeholder="Name" value={editingFleet.name} onChange={e => setEditingFleet({...editingFleet, name: e.target.value, nameId: e.target.value})} className="w-full p-2 bg-gray-100 dark:bg-dark-green-950 rounded-lg dark:text-white text-xs" required /><input type="file" onChange={async (e) => { const file = e.target.files[0]; if (file) { const url = await uploadImage(file, 'fleet'); if (url) setEditingFleet({...editingFleet, image: url}); } }} className="w-full text-[11px]" /><button type="submit" className="btn-3d btn-3d-green w-full py-3 text-white rounded-xl font-semibold text-xs">Save</button></form></motion.div></div>
        )}

        {showReviewModal && editingReview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div onClick={() => setShowReviewModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" /><motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="relative w-full max-w-md bg-white dark:bg-dark-green-900 rounded-[24px] overflow-hidden flex flex-col p-6 shadow-lg"><h3 className="font-semibold dark:text-white mb-4">Review</h3><form onSubmit={(e) => { e.preventDefault(); handleSave('reviews', editingReview, editingReview.id); }} className="space-y-4"><input type="text" placeholder="Name" value={editingReview.name} onChange={e => setEditingReview({...editingReview, name: e.target.value})} className="w-full p-2 bg-gray-100 dark:bg-dark-green-950 rounded-lg dark:text-white text-xs" required /><textarea placeholder="Review..." value={editingReview.textEn} onChange={e => setEditingReview({...editingReview, textEn: e.target.value, textId: e.target.value})} className="w-full p-2 bg-gray-100 dark:bg-dark-green-950 rounded-lg dark:text-white text-xs h-24" /><button type="submit" className="btn-3d btn-3d-green w-full py-3 text-white rounded-xl font-semibold text-xs">Save</button></form></motion.div></div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;