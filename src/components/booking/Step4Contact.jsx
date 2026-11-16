'use client';

import { motion } from 'framer-motion';
import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import { normalizeWhatsapp, whatsappError } from '../../lib/phone';

const Step4Contact = () => {
  const { bookingData, updateBooking, nextStep, prevStep } = useBooking();
  const { t, tr, language } = useLanguage();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateBooking({ [name]: value });
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const waError = whatsappError(bookingData.whatsapp, language);
  const isValidWhatsapp = bookingData.whatsapp && !waError;

  const handleWhatsappChange = (e) => {
    updateBooking({ whatsapp: normalizeWhatsapp(e.target.value) });
  };

  const canProceed = 
    bookingData.fullName.trim().length >= 2 &&
    (!bookingData.email || isValidEmail(bookingData.email)) &&
    isValidWhatsapp;

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-2xl lg:text-3xl font-light text-gray-900 dark:text-white transition-colors" style={{ fontFamily: 'Fraunces, serif' }}>
          {t('booking.yourDetails')} <span className="text-[#c4935f]">{t('booking.details')}</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors">{t('booking.howCanWeReach')}</p>
      </div>

      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        {/* Full Name */}
        <div className="space-y-3">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
            {t('booking.fullName')} <span className="text-red-400">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            autoComplete="name"
            value={bookingData.fullName}
            onChange={handleChange}
            placeholder={t('booking.asShownOnId')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-green-700 bg-white dark:bg-dark-green-900 text-gray-900 dark:text-white focus:border-[#1a4d3e] dark:focus:border-[#4ade80] focus:ring-0 outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* Email */}
        <div className="space-y-3">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
            {t('booking.emailAddress')} <span className="text-gray-400 dark:text-gray-500">({t('common.optional')})</span>
          </label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            value={bookingData.email}
            onChange={handleChange}
            placeholder={tr('nama@email.com', 'name@email.com')}
            className={`w-full px-4 py-3 rounded-xl border focus:ring-0 outline-none transition-colors ${
 bookingData.email && !isValidEmail(bookingData.email)
 ? 'border-red-300 dark:border-red-900 focus:border-red-400'
 : 'border-gray-200 dark:border-dark-green-700 bg-white dark:bg-dark-green-900 text-gray-900 dark:text-white focus:border-[#1a4d3e] dark:focus:border-[#4ade80]'
 }`}
          />
          {bookingData.email && !isValidEmail(bookingData.email) && (
            <p className="text-sm text-red-500 dark:text-red-400">{t('booking.invalidEmail')}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{t('booking.emailConfirmation')}</p>
        </div>

        {/* WhatsApp Number */}
        <div className="space-y-3">
          <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
            {t('booking.whatsappNumber')} <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-dark-green-800 rounded-xl text-gray-500 dark:text-gray-400 transition-colors">
              <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>+</span>
            </div>
            <input
              id="whatsapp"
              type="tel"
              inputMode="numeric"
              name="whatsapp"
              autoComplete="tel"
              value={bookingData.whatsapp}
              onChange={handleWhatsappChange}
              placeholder="6281234567890"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-green-700 bg-white dark:bg-dark-green-900 text-gray-900 dark:text-white focus:border-[#1a4d3e] dark:focus:border-[#4ade80] focus:ring-0 outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          {waError ? (
            <p className="text-sm text-red-500 dark:text-red-400">{waError}</p>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {tr('Ketik angka saja, tanpa spasi, tanda + atau tanda hubung. Awalan 0 otomatis menjadi 62. Luar negeri: kode negara lalu nomor (Australia 61, contoh 61412345678).', 'Digits only, no spaces, + or hyphens. A leading 0 becomes 62 automatically. Overseas numbers: country code then number (Australia 61, e.g. 61412345678).')}
            </p>
          )}
        </div>

        {/* Alternative Phone */}
        <div className="space-y-3">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
            {t('booking.alternativePhone')} <span className="text-gray-400 dark:text-gray-500">({t('common.optional')})</span>
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            value={bookingData.phone}
            onChange={handleChange}
            placeholder={t('booking.localOrHotelPhone')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-green-700 bg-white dark:bg-dark-green-900 text-gray-900 dark:text-white focus:border-[#1a4d3e] dark:focus:border-[#4ade80] focus:ring-0 outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </form>

      {/* Preferred Contact Method */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">{t('booking.preferredContact')}</label>
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'whatsapp', label: t('booking.whatsapp'), icon: 'chat' },
            { id: 'email', label: t('booking.email'), icon: 'envelope' },
            { id: 'phone', label: t('booking.phoneCall'), icon: 'phone' },
          ].map((method) => {
            const icons = {
              chat: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              ),
              envelope: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              ),
              phone: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              ),
            };
            return (
              <button
                key={method.id}
                onClick={() => updateBooking({ preferredContact: method.id })}
                className={`p-4 rounded-xl border text-center transition-[color,background-color,border-color,opacity,transform,box-shadow] ${
 bookingData.preferredContact === method.id
 ? 'border-[#1a4d3e] bg-[#1a4d3e]/5 dark:border-[#4ade80] dark:bg-[#4ade80]/10'
 : 'border-gray-200 dark:border-dark-green-700 bg-white dark:bg-dark-green-900 hover:border-[#c4935f]'
 }`}
              >
                <span className={`block mb-1 flex justify-center ${bookingData.preferredContact === method.id ? 'text-[#1a4d3e] dark:text-[#4ade80]' : 'text-gray-500 dark:text-gray-400'}`}>
                  {icons[method.icon]}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white transition-colors">{method.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Privacy Note */}
      <div className="p-4 bg-[#f3ede6] dark:bg-dark-green-900 rounded-xl transition-colors border border-transparent dark:border-dark-green-700">
        <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          {t('booking.privacyNote')}
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={prevStep}
          className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span>{t('booking.back')}</span>
        </button>
        <button
          onClick={nextStep}
          disabled={!canProceed}
          className={`group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-medium ${
 canProceed
 ? 'btn-3d btn-3d-green-adaptive text-white dark:text-gray-900'
 : 'bg-gray-200 dark:bg-dark-green-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
 }`}
        >
          <span>{t('booking.reviewBooking')}</span>
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default Step4Contact;
