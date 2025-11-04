const fs = require("fs");
const path = require("path");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const uploadDir = path.join(__dirname, "uploads/products");

// Pastikan folder upload tersedia
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Folder uploads/products dibuat.");
}

const products = [
  "nasi goreng",
  "mie ayam bakso",
  "ayam geprek",
  "sate ayam",
  "soto ayam",
  "es teh manis",
  "es jeruk",
  "kopi hitam",
  "cappuccino",
  "teh tarik",
  "kentang goreng",
  "pisang goreng",
  "tahu crispy",
  "risoles",
  "bakwan jagung",
  "es krim coklat",
  "puding coklat",
  "cheesecake",
  "pancake",
  "brownies",
];

async function downloadImage(query, filename) {
  try {
    const unsplashUrl = `https://source.unsplash.com/600x400/?${encodeURIComponent(
      query
    )}`;
    const res = await fetch(unsplashUrl);
    if (!res.ok) throw new Error(`Gagal fetch gambar untuk ${query}`);
    const buffer = await res.arrayBuffer();

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, Buffer.from(buffer));
    console.log(`✅ Berhasil download ${filename}`);
  } catch (err) {
    console.error(`❌ Gagal download ${filename}:`, err.message);
  }
}

(async () => {
  console.log("🚀 Mulai download gambar produk dari Unsplash...\n");
  for (const name of products) {
    const filename = name.replace(/\s+/g, "-") + ".jpg";
    await downloadImage(name, filename);
  }
  console.log("\n🎉 Semua gambar selesai diunduh ke uploads/products/");
})();
