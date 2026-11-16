const functions = require("firebase-functions");
const admin = require("firebase-admin");
const midtransClient = require("midtrans-client");
const sgMail = require("@sendgrid/mail");
const cors = require("cors")({origin: true});

admin.initializeApp();

// 1. Konfigurasi SendGrid
// Gunakan: firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY"
const SENDGRID_API_KEY = functions.config().sendgrid ? functions.config().sendgrid.key : "";
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// 2. Konfigurasi Midtrans
// TIPS: Gunakan Firebase Environment Config untuk menyimpan Key ini di production agar lebih aman
// firebase functions:config:set midtrans.server_key="YOUR_KEY"
const MIDTRANS_SERVER_KEY = functions.config().midtrans ? functions.config().midtrans.server_key : "SB-Mid-server-YOUR_SERVER_KEY_HERE";
const IS_PRODUCTION = false; // Set ke true jika sudah live

const snap = new midtransClient.Snap({
  isProduction: IS_PRODUCTION,
  serverKey: MIDTRANS_SERVER_KEY,
});

/**
 * Trigger: Kirim email ke admin saat ada booking baru
 */
exports.onBookingCreate = functions.firestore
    .document("bookings/{bookingId}")
    .onCreate(async (snap, context) => {
      const bookingData = snap.data();
      const bookingId = context.params.bookingId;

      if (!SENDGRID_API_KEY) {
        console.warn("SendGrid API Key not configured. Skipping email notification.");
        return null;
      }

      const msg = {
        to: "haditransbali@gmail.com",
        from: "haditransbali@gmail.com", // Menggunakan email Gmail yang sudah diverifikasi sebagai pengirim
        subject: `New Booking Request: ${bookingId}`,
        html: `
          <h3>New Booking Received!</h3>
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <p><strong>Customer:</strong> ${bookingData.firstName} ${bookingData.lastName}</p>
          <p><strong>Email:</strong> ${bookingData.email}</p>
          <p><strong>Service:</strong> ${bookingData.serviceName}</p>
          <p><strong>Date:</strong> ${bookingData.date}</p>
          <p><strong>Amount:</strong> IDR ${bookingData.totalPrice || bookingData.amount}</p>
          <br>
          <p>Check the admin dashboard for details.</p>
        `,
      };

      try {
        await sgMail.send(msg);
        console.log(`Notification email sent for booking ${bookingId}`);
      } catch (error) {
        console.error("Error sending email:", error);
      }
      return null;
    });

/**
 * Fungsi untuk membuat transaksi Midtrans (Generate Snap Token)
 */
exports.createTransaction = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({error: "Method Not Allowed"});
    }

    try {
      const {bookingRef, amount, customerDetails, itemDetails} = req.body;

      if (!bookingRef || !amount) {
        return res.status(400).json({error: "Missing required parameters"});
      }

      // Buat Parameter Transaksi Midtrans
      const parameter = {
        transaction_details: {
          order_id: bookingRef,
          gross_amount: Math.round(amount),
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name: customerDetails.firstName || "Customer",
          email: customerDetails.email,
          phone: customerDetails.phone,
        },
        item_details: itemDetails || [
          {
            id: "DP-30",
            price: Math.round(amount),
            quantity: 1,
            name: `Down Payment for Booking ${bookingRef}`,
          },
        ],
        // URL redirect setelah bayar (opsional)
        callbacks: {
          finish: "https://haditransbali.com/profile",
        },
      };

      const transaction = await snap.createTransaction(parameter);
      
      return res.status(200).json({
        token: transaction.token,
        redirect_url: transaction.redirect_url,
      });
    } catch (error) {
      console.error("Midtrans Create Error:", error);
      return res.status(500).json({
        error: "Failed to create transaction",
        message: error.message,
      });
    }
  });
});

/**
 * Webhook: Menerima notifikasi status pembayaran dari Midtrans secara otomatis
 */
exports.paymentWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const notification = req.body;

  try {
    const statusResponse = await snap.transaction.notification(notification);
    
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Transaction notification received. Order ID: ${orderId}. Status: ${transactionStatus}. Fraud: ${fraudStatus}`);

    let bookingStatus = "pending";
    let paymentStatus = "unpaid";

    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      if (fraudStatus === "accept" || fraudStatus === undefined) {
        bookingStatus = "confirmed";
        paymentStatus = "paid";
      }
    } else if (transactionStatus === "cancel" || transactionStatus === "deny" || transactionStatus === "expire") {
      bookingStatus = "cancelled";
      paymentStatus = "failed";
    } else if (transactionStatus === "pending") {
      paymentStatus = "pending";
    }

    // Update status booking di Firestore
    await admin.firestore()
        .collection("bookings")
        .doc(orderId)
        .update({
          status: bookingStatus,
          paymentStatus: paymentStatus,
          midtransRaw: notification,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

    return res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(500).send("Internal Server Error");
  }
});
