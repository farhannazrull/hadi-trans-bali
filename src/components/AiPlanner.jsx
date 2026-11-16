'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { packages } from '../data/packages';
import PackageCard from './PackageCard';

export const openAiPlanner = () => {
  window.dispatchEvent(new CustomEvent('open-ai-planner'));
};

const AiPlanner = () => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // --- SMART OFFLINE BRAIN (Comprehensive Fallback) ---
  const getOfflineResponse = (userInput) => {
    const q = userInput.toLowerCase();
    let res = "";
    let pkg = null;

    if (q.includes('anak') || q.includes('kids') || q.includes('keluarga') || q.includes('family')) {
      pkg = packages.find(p => p.id === 3 || p.id === 5);
      res = language === 'id' 
        ? "Untuk keluarga, saya sangat merekomendasikan **Tour Ubud** (Monkey Forest & Sawah Terasering) atau **Tour Bedugul** yang sejuk. Keduanya sangat ramah untuk anak-anak."
        : "For families, I highly recommend the **Ubud Tour** (Monkey Forest) or the cool **Bedugul Tour**. Both are very kid-friendly.";
    } else if (q.includes('atv') || q.includes('rafting') || q.includes('petualang') || q.includes('adventure') || q.includes('seru')) {
      pkg = packages.find(p => p.id === 3);
      res = language === 'id'
        ? "Siap untuk memacu adrenalin? Anda bisa mengambil **Tour Ubud** dan kami akan tambahkan aktivitas Rafting di Sungai Ayung atau main ATV. Pasti seru."
        : "Ready for an adrenaline rush? You can take the **Ubud Tour** and we'll add Ayung River Rafting or ATV rides. It's guaranteed fun.";
    } else if (q.includes('sunset') || q.includes('matahari terbenam') || q.includes('senja')) {
      pkg = packages.find(p => p.id === 1);
      res = language === 'id'
        ? "Sunset paling ikonik ada di **Uluwatu**. Anda bisa melihat matahari terbenam dari tebing sambil menonton Tari Kecak yang megah."
        : "The most iconic sunset is in **Uluwatu**. You can watch the sun go down from the cliff while enjoying the magnificent Kecak Dance.";
    } else if (q.includes('foto') || q.includes('photo') || q.includes('instagram') || q.includes('estetik')) {
      pkg = packages.find(p => p.id === 6);
      res = language === 'id'
        ? "Untuk koleksi foto terbaik, **Tour Lempuyang (Gate of Heaven)** adalah juaranya. Kami juga akan antar Anda ke Tirta Gangga yang sangat indah."
        : "For the best photo collection, the **Lempuyang Tour (Gate of Heaven)** is the winner. We'll also take you to the stunning Tirta Gangga.";
    } else if (q.includes('harga') || q.includes('price') || q.includes('biaya') || q.includes('bayar') || q.includes('murah')) {
      res = language === 'id'
        ? "Harga sewa mobil pribadi + Driver + BBM mulai dari **Rp 500.000 per mobil** (durasi 10-12 jam). Sangat transparan dan hemat untuk rombongan."
        : "Private car + Driver + Fuel starts from **IDR 500,000 per car** (10-12 hours). Very transparent and economical for groups.";
    } else if (q.includes('halo') || q.includes('hi') || q.includes('hello') || q.includes('pagi') || q.includes('siang') || q.includes('sore')) {
      res = language === 'id'
        ? "Halo! Ada yang bisa saya bantu rencanakan untuk liburan Bali Anda hari ini?"
        : "Hello! How can I help you plan your Bali holiday today?";
    } else {
      res = language === 'id'
        ? "Tentu! Kami menyediakan Sewa Mobil, Antar Jemput Bandara, dan Paket Tour ke berbagai destinasi populer seperti Ubud, Uluwatu, dan Bedugul. Ada yang ingin Anda tanyakan lebih detail?"
        : "Sure! We provide Private Car rentals, Airport Transfers, and Tour Packages to popular spots like Ubud, Uluwatu, and Bedugul. Anything specific you'd like to ask?";
    }
    return { text: res, pkg };
  };

  // No API key lives in the browser: answers come from the built-in offline assistant.
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const offline = getOfflineResponse(userMsg);
    setMessages(prev => [...prev, { type: 'bot', text: offline.text, packageData: offline.pkg }]);
    setIsLoading(false);
  };

  useEffect(() => {
    const handleOpen = () => setIsOpen(prev => !prev);
    window.addEventListener('open-ai-planner', handleOpen);
    return () => window.removeEventListener('open-ai-planner', handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ type: 'bot', text: t('ai.greeting') }]);
    }
  }, [isOpen, t, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages, isLoading]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 pointer-events-auto bg-black/5 dark:bg-black/20"
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-44 right-6 z-[60] w-[95vw] max-w-[450px] h-[650px] max-h-[80vh] bg-white dark:bg-dark-green-900 rounded-3xl shadow-lg border border-gray-100 dark:border-dark-green-800 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#1a4d3e] p-4 flex items-center gap-3 border-b dark:border-dark-green-800">
              <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-white font-semibold text-sm">{t('ai.assistantTitle')}</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full" />
                  <p className="text-white/60 text-[11px]">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-white/70 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-dark-green-950 scrollbar-hide overscroll-contain">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[85%] space-y-2 text-left">
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm whitespace-pre-line break-words ${msg.type === 'user' ? 'bg-[#1a4d3e] text-white rounded-br-none' : 'bg-white dark:bg-dark-green-900 text-gray-700 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-dark-green-800'}`}>
                      {msg.text.split(/(\*\*.*?\*\*)/g).map((part, i) => part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part)}
                    </div>
                    {msg.packageData && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="transform scale-[0.85] -mx-6 -my-4 origin-top-left">
                        <PackageCard tourPackage={msg.packageData} />
                      </motion.div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-dark-green-900 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1 border border-gray-100 dark:border-dark-green-800">
                    <div className="w-1.5 h-1.5 bg-[#c4935f] rounded-full animate-pulse" />
                    <div className="w-1.5 h-1.5 bg-[#c4935f] rounded-full animate-pulse delay-75" />
                    <div className="w-1.5 h-1.5 bg-[#c4935f] rounded-full animate-pulse delay-150" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-dark-green-900 border-t dark:border-dark-green-800">
              <div className="flex gap-2">
                <input
                  type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Tanya liburan di Bali..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-green-700 bg-gray-50 dark:bg-dark-green-950 text-gray-900 dark:text-white outline-none text-xs focus:border-[#1a4d3e] transition-[color,background-color,border-color,opacity,transform,box-shadow]"
                />
                <button onClick={handleSend} disabled={!input.trim() || isLoading} className="btn-3d btn-3d-bronze text-white p-2.5 rounded-xl">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AiPlanner;