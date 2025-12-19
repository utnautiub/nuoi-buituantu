/**
 * Script to fix old donations timezone
 * Run once to add transactionDate field to existing donations
 * 
 * Usage: node scripts/fix-old-donations-timezone.js
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function fixOldDonations() {
  console.log('🔧 Starting to fix old donations...\n');

  const donationsRef = db.collection('donations');
  const snapshot = await donationsRef.get();

  if (snapshot.empty) {
    console.log('No donations found.');
    return;
  }

  console.log(`Found ${snapshot.size} donations\n`);

  let fixed = 0;
  let skipped = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();

    // Skip if already has transactionDate
    if (data.transactionDate) {
      console.log(`⏭️  Skipping ${doc.id} - already has transactionDate`);
      skipped++;
      continue;
    }

    try {
      // Convert createdAt Timestamp to VN time string
      const createdAt = data.createdAt.toDate();
      
      // Add 7 hours to correct the timezone (assuming it was stored as UTC but should be VN time)
      const vnDate = new Date(createdAt.getTime() + 7 * 60 * 60 * 1000);
      
      // Format as "YYYY-MM-DD HH:mm:ss"
      const year = vnDate.getFullYear();
      const month = String(vnDate.getMonth() + 1).padStart(2, '0');
      const day = String(vnDate.getDate()).padStart(2, '0');
      const hour = String(vnDate.getHours()).padStart(2, '0');
      const minute = String(vnDate.getMinutes()).padStart(2, '0');
      const second = String(vnDate.getSeconds()).padStart(2, '0');
      
      const transactionDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

      // Update document
      await doc.ref.update({
        transactionDate: transactionDate,
      });

      console.log(`✅ Fixed ${doc.id}: ${transactionDate}`);
      fixed++;
    } catch (error) {
      console.error(`❌ Error fixing ${doc.id}:`, error.message);
    }
  }

  console.log(`\n✨ Done!`);
  console.log(`Fixed: ${fixed}`);
  console.log(`Skipped: ${skipped}`);
}

// Run the script
fixOldDonations()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

