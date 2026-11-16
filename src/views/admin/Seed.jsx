'use client';

import { useState } from 'react';
import { db } from '../../config/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import { packages } from '../../data/packages';
import { fleet } from '../../data/services';
import { posts } from '../../data/posts';
import { testimonials } from '../../data/testimonials';

const SeedPage = () => {
  const [status, setStatus] = useState('idle');
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

  const seedData = async () => {
    setStatus('loading');
    setLogs([]);
    addLog('Starting seeding process...');

    try {
      // 1. Seed Packages
      addLog('Seeding Packages...');
      for (const pkg of packages) {
        await setDoc(doc(db, 'packages', pkg.id.toString()), pkg);
        addLog(`Added package: ${pkg.title.en}`);
      }

      // 2. Seed Fleet
      addLog('Seeding Fleet...');
      for (const item of fleet) {
        await setDoc(doc(db, 'fleet', item.id.toString()), item);
        addLog(`Added fleet: ${item.name}`);
      }

      // 3. Seed Posts
      addLog('Seeding Posts...');
      for (const post of posts) {
        await setDoc(doc(db, 'posts', post.id.toString()), post);
        addLog(`Added post: ${post.slug}`);
      }

      // 4. Seed Reviews
      addLog('Seeding Reviews...');
      for (const rev of testimonials) {
        await setDoc(doc(db, 'reviews', rev.id.toString()), rev);
        addLog(`Added review: ${rev.name}`);
      }

      setStatus('success');
      addLog('All data seeded successfully');
    } catch (error) {
      console.error(error);
      setStatus('error');
      addLog(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border">
        <h1 className="text-2xl font-semibold mb-4">Database Seeder</h1>
        <p className="text-gray-600 mb-6">
          This tool will upload all local data from JS files to your Firebase Firestore.
          Make sure your Firestore rules allow writing.
        </p>

        <button
          onClick={seedData}
          disabled={status === 'loading'}
          className={`w-full py-4 rounded-xl font-semibold text-white ${
 status === 'loading' ? 'bg-gray-400' : 'btn-3d btn-3d-green'
 }`}
        >
          {status === 'loading' ? 'Uploading...' : 'START SEEDING DATA'}
        </button>

        {logs.length > 0 && (
          <div className="mt-8 bg-black text-green-400 p-4 rounded-xl font-mono text-xs h-64 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        )}

        {status === 'success' && (
          <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-xl text-center font-medium">
            Seeding Complete! You can now delete this page or route.
          </div>
        )}
      </div>
    </div>
  );
};

export default SeedPage;
