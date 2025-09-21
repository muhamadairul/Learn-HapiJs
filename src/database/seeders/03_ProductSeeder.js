/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("products").del();
  await knex("product_categories").del();

  await knex("product_categories").insert([
    { name: "Makanan", description: "Menu utama seperti nasi, mie, dll" },
    { name: "Minuman", description: "Aneka minuman dingin maupun panas" },
    { name: "Snack", description: "Cemilan ringan" },
    { name: "Dessert", description: "Hidangan penutup manis" },
  ]);

  const categoryMap = {};
  const rows = await knex("product_categories").select("id", "name");
  rows.forEach((row) => {
    categoryMap[row.name] = row.id;
  });

  await knex("products").insert([
    {
      name: "Nasi Goreng Spesial",
      description: "Nasi goreng dengan telur dan ayam suwir",
      price: 25000,
      stock: 20,
      category_id: categoryMap["Makanan Berat"],
    },
    {
      name: "Mie Ayam Bakso",
      description: "Mie ayam dengan tambahan bakso",
      price: 20000,
      stock: 15,
      category_id: categoryMap["Makanan Berat"],
    },
    {
      name: "Ayam Geprek",
      description: "Ayam goreng tepung dengan sambal bawang",
      price: 22000,
      stock: 18,
      category_id: categoryMap["Makanan Berat"],
    },
    {
      name: "Sate Ayam",
      description: "10 tusuk sate ayam dengan bumbu kacang",
      price: 30000,
      stock: 12,
      category_id: categoryMap["Makanan Berat"],
    },
    {
      name: "Soto Ayam",
      description: "Soto ayam hangat dengan nasi putih",
      price: 20000,
      stock: 10,
      category_id: categoryMap["Makanan Berat"],
    },

    {
      name: "Es Teh Manis",
      description: "Teh manis dingin segar",
      price: 5000,
      stock: 50,
      category_id: categoryMap["Minuman"],
    },
    {
      name: "Es Jeruk",
      description: "Jeruk peras segar dengan es batu",
      price: 7000,
      stock: 40,
      category_id: categoryMap["Minuman"],
    },
    {
      name: "Kopi Hitam",
      description: "Kopi tubruk panas",
      price: 8000,
      stock: 25,
      category_id: categoryMap["Minuman"],
    },
    {
      name: "Cappuccino",
      description: "Kopi susu cappuccino",
      price: 15000,
      stock: 15,
      category_id: categoryMap["Minuman"],
    },
    {
      name: "Teh Tarik",
      description: "Teh susu khas Malaysia",
      price: 12000,
      stock: 20,
      category_id: categoryMap["Minuman"],
    },

    {
      name: "Kentang Goreng",
      description: "French fries dengan saus",
      price: 15000,
      stock: 30,
      category_id: categoryMap["Snack"],
    },
    {
      name: "Pisang Goreng",
      description: "Pisang goreng crispy",
      price: 10000,
      stock: 25,
      category_id: categoryMap["Snack"],
    },
    {
      name: "Tahu Crispy",
      description: "Tahu goreng renyah dengan bumbu",
      price: 8000,
      stock: 20,
      category_id: categoryMap["Snack"],
    },
    {
      name: "Risoles",
      description: "Risoles isi ayam dan sayuran",
      price: 10000,
      stock: 15,
      category_id: categoryMap["Snack"],
    },
    {
      name: "Bakwan Jagung",
      description: "Bakwan jagung gurih",
      price: 8000,
      stock: 18,
      category_id: categoryMap["Snack"],
    },

    {
      name: "Es Krim Coklat",
      description: "Es krim coklat scoop",
      price: 12000,
      stock: 20,
      category_id: categoryMap["Dessert"],
    },
    {
      name: "Puding Coklat",
      description: "Puding coklat dengan fla vanilla",
      price: 10000,
      stock: 18,
      category_id: categoryMap["Dessert"],
    },
    {
      name: "Cheesecake",
      description: "Kue keju lembut",
      price: 20000,
      stock: 12,
      category_id: categoryMap["Dessert"],
    },
    {
      name: "Pancake",
      description: "Pancake dengan madu dan butter",
      price: 18000,
      stock: 15,
      category_id: categoryMap["Dessert"],
    },
    {
      name: "Brownies",
      description: "Brownies coklat panggang",
      price: 15000,
      stock: 20,
      category_id: categoryMap["Dessert"],
    },
  ]);
};
