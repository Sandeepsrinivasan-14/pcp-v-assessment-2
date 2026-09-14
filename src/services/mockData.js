/* Standalone mock dataset — no external API needed */

const RESTAURANTS = [
  'Burger Palace', 'Pizza Heaven', 'Sushi World', 'Spice Garden',
  'The Tandoor House', 'Noodle Box', 'Wrap & Roll', 'Green Bowl',
  'The Biryani Co.', 'Chai & Snacks', 'Dosa Express', 'Grillhouse',
];

const MENUS = {
  'Burger Palace':     [{ name: 'Classic Burger', price: 149 }, { name: 'Cheese Fries', price: 89 }, { name: 'Chocolate Shake', price: 99 }, { name: 'Crispy Chicken Burger', price: 179 }],
  'Pizza Heaven':      [{ name: 'Margherita Pizza', price: 299 }, { name: 'BBQ Chicken Pizza', price: 349 }, { name: 'Garlic Bread', price: 99 }, { name: 'Cheese Burst', price: 399 }],
  'Sushi World':       [{ name: 'California Roll', price: 249 }, { name: 'Dragon Roll', price: 299 }, { name: 'Miso Soup', price: 89 }, { name: 'Salmon Nigiri', price: 199 }],
  'Spice Garden':      [{ name: 'Paneer Butter Masala', price: 199 }, { name: 'Dal Makhani', price: 149 }, { name: 'Butter Naan', price: 39 }, { name: 'Jeera Rice', price: 99 }],
  'The Tandoor House': [{ name: 'Chicken Tikka', price: 249 }, { name: 'Tandoori Roti', price: 29 }, { name: 'Seekh Kebab', price: 199 }, { name: 'Mint Chutney', price: 29 }],
  'Noodle Box':        [{ name: 'Hakka Noodles', price: 149 }, { name: 'Fried Rice', price: 139 }, { name: 'Manchurian', price: 159 }, { name: 'Spring Rolls', price: 99 }],
  'Wrap & Roll':       [{ name: 'Veg Frankie', price: 99 }, { name: 'Chicken Wrap', price: 139 }, { name: 'Cheese Wrap', price: 119 }, { name: 'Nachos', price: 89 }],
  'Green Bowl':        [{ name: 'Garden Salad', price: 169 }, { name: 'Quinoa Bowl', price: 219 }, { name: 'Hummus Plate', price: 149 }, { name: 'Fresh Juice', price: 79 }],
  'The Biryani Co.':   [{ name: 'Chicken Biryani', price: 249 }, { name: 'Mutton Biryani', price: 299 }, { name: 'Veg Biryani', price: 199 }, { name: 'Raita', price: 49 }],
  'Chai & Snacks':     [{ name: 'Masala Chai', price: 39 }, { name: 'Samosa (2 pcs)', price: 49 }, { name: 'Bread Pakora', price: 59 }, { name: 'Maggi', price: 69 }],
  'Dosa Express':      [{ name: 'Masala Dosa', price: 89 }, { name: 'Idli Sambar', price: 69 }, { name: 'Vada', price: 59 }, { name: 'Filter Coffee', price: 49 }],
  'Grillhouse':        [{ name: 'Grilled Chicken', price: 299 }, { name: 'BBQ Ribs', price: 449 }, { name: 'Corn on Cob', price: 79 }, { name: 'Lemonade', price: 69 }],
};

const CUSTOMERS = [
  'Aarav Sharma', 'Priya Patel', 'Rohan Mehta', 'Sneha Iyer',
  'Vikram Singh', 'Ananya Nair', 'Kabir Joshi', 'Divya Reddy',
  'Arjun Kumar', 'Meera Pillai', 'Rahul Gupta', 'Pooja Verma',
  'Nikhil Bansal', 'Kavya Rao', 'Amit Desai', 'Shreya Bose',
  'Karan Malhotra', 'Deepa Nambiar', 'Siddharth Chauhan', 'Lavanya Murthy',
  'Harsh Agarwal', 'Ritu Saxena', 'Aditya Kapoor', 'Tanya Bhatt',
];

const STATUSES = ['pending', 'delivered', 'delivered', 'delivered', 'cancelled'];
const DELIVERY_TIMES = ['20-25 mins', '25-30 mins', '30-35 mins', '35-40 mins', '40-45 mins', '15-20 mins'];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildOrder(orderId, seed) {
  // deterministic-ish using seed so data is stable on reload
  const rng = (n) => Math.abs(Math.sin(seed * 9301 + n * 49297) * 233280) % 1;
  const restaurantIndex = Math.floor(rng(1) * RESTAURANTS.length);
  const restaurant = RESTAURANTS[restaurantIndex];
  const menu = MENUS[restaurant];
  const customerIndex = Math.floor(rng(2) * CUSTOMERS.length);
  const statusIndex = Math.floor(rng(3) * STATUSES.length);
  const status = STATUSES[statusIndex];

  // 2–4 items per order
  const itemCount = 2 + Math.floor(rng(4) * 3);
  const items = [];
  const usedIndices = new Set();
  for (let i = 0; i < itemCount; i++) {
    let idx;
    let attempts = 0;
    do { idx = Math.floor(rng(5 + i * 7) * menu.length); attempts++; }
    while (usedIndices.has(idx) && attempts < 10);
    usedIndices.add(idx);
    const quantity = 1 + Math.floor(rng(6 + i) * 3);
    items.push({ name: menu[idx].name, price: menu[idx].price, quantity });
  }

  const totalAmount = items.reduce((s, item) => s + item.price * item.quantity, 0);
  const rating = status === 'delivered' ? 3 + Math.round(rng(7) * 20) / 10 : null;
  const deliveryTimeIndex = Math.floor(rng(8) * DELIVERY_TIMES.length);

  return {
    orderId,
    customerName: CUSTOMERS[customerIndex],
    restaurant,
    status,
    totalAmount,
    items,
    rating: rating ? Math.min(5, Math.max(1, rating)) : undefined,
    deliveryTime: status !== 'cancelled' ? DELIVERY_TIMES[deliveryTimeIndex] : undefined,
  };
}

// Generate 48 orders with stable seeds
export const MOCK_ORDERS = Array.from({ length: 48 }, (_, i) => buildOrder(1001 + i, i + 1));
