const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const name = args[0];

if (!name) {
  console.error("⚠️  Nama seeder wajib diberikan.");
  console.error("   Contoh: node seed-make.js users");
  process.exit(1);
}

const seedsDir = path.join(__dirname, "src", "database", "seeders");
if (!fs.existsSync(seedsDir)) {
  fs.mkdirSync(seedsDir);
}

const files = fs.readdirSync(seedsDir).filter(f => f.endsWith(".js"));

const nextIndex = (files.length + 1).toString().padStart(2, "0");

const filename = `${nextIndex}_${name}.js`;
const filepath = path.join(seedsDir, filename);

const content = `/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // TODO: isi data seeder untuk ${name}
};
`;

fs.writeFileSync(filepath, content, "utf8");
console.log("✅ Seeder dibuat:", filename);
