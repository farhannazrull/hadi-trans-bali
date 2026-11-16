// WhatsApp number rules: digits only, international format without "+", Indonesian numbers as 628...
export const normalizeWhatsapp = (raw) => {
  let digits = String(raw || '').replace(/\D/g, ''); // drop spaces, "+", "-", "(", ")"
  if (digits.startsWith('00')) digits = digits.slice(2); // 0062... -> 62...
  if (digits.startsWith('0')) digits = `62${digits.slice(1)}`; // 0812... -> 62812...
  if (digits.startsWith('620')) digits = `62${digits.slice(3)}`; // 62 0812... -> 62812...
  return digits.slice(0, 15); // E.164 allows at most 15 digits
};

// Returns an error message, or '' when the number is acceptable
export const whatsappError = (number, language = 'id') => {
  const id = language === 'id';
  if (!number) return '';
  if (number.startsWith('62')) {
    if (!/^628\d{8,11}$/.test(number)) {
      return id
        ? 'Nomor Indonesia harus diawali 628 dan berjumlah 11 sampai 14 digit, contoh 6281234567890'
        : 'Indonesian numbers must start with 628 and have 11 to 14 digits, e.g. 6281234567890';
    }
    return '';
  }
  if (number.length < 10) {
    return id
      ? 'Nomor terlalu pendek. Sertakan kode negara, contoh 61412345678'
      : 'Number too short. Include the country code, e.g. 61412345678';
  }
  return '';
};
