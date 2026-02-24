import { Cake, Salad, UtensilsCrossed, GlassWater } from "lucide-react";


const dessertImgs = [
  "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=160&h=160&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=160&h=160&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=160&h=160&fit=crop&auto=format",
];
const appetizerImgs = [
  "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=160&h=160&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=160&h=160&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1547592180-85f173990554?w=160&h=160&fit=crop&auto=format",
];
const restaurantImgs = [
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=160&h=160&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1558030006-450675393462?w=160&h=160&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=160&h=160&fit=crop&auto=format",
];
const drinkImgs = [
  "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=160&h=160&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1560508180-03f285f67ded?w=160&h=160&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=160&h=160&fit=crop&auto=format",
];

// Categories 
export const categories = [
  {
    label: "Desserts",
    Icon: Cake,
    heroImg: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1600&h=800&fit=crop&auto=format",
  },
  {
    label: "Appetizer",
    Icon: Salad,
    heroImg: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1600&h=800&fit=crop&auto=format",
  },
  {
    label: "Restaurant",
    Icon: UtensilsCrossed,
    heroImg: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&h=800&fit=crop&auto=format",
  },
  {
    label: "Drinks",
    Icon: GlassWater,
    heroImg: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=1600&h=800&fit=crop&auto=format",
  },
];

// Menu Items
export const categoryMenuItems = {
  Desserts: [
    { id: 1, name: "Salted Caramel Tart",  description: "Salted caramel custard tart, vanilla ice-cream.",       price: "$16", img: dessertImgs[0] },
    { id: 2, name: "Chocolate Lava Cake",  description: "Warm chocolate cake with molten center, served hot.",   price: "$14", img: dessertImgs[1] },
    { id: 3, name: "Mango Panna Cotta",    description: "Silky panna cotta topped with fresh mango coulis.",     price: "$12", img: dessertImgs[2] },
    { id: 4, name: "Berry Cheesecake",     description: "Creamy cheesecake on a buttery biscuit base.",          price: "$13", img: dessertImgs[0] },
    { id: 5, name: "Crème Brûlée",        description: "Classic French custard with a caramelised sugar top.",  price: "$11", img: dessertImgs[1] },
    { id: 6, name: "Tiramisu",             description: "Espresso-soaked ladyfingers with mascarpone cream.",    price: "$13", img: dessertImgs[2] },
    { id: 7, name: "Strawberry Pavlova",   description: "Crisp meringue, whipped cream, fresh strawberries.",    price: "$14", img: dessertImgs[0] },
    { id: 8, name: "Lemon Sorbet",         description: "Refreshing lemon sorbet with a zesty finish.",          price: "$9",  img: dessertImgs[1] },
    { id: 9, name: "Profiteroles",         description: "Choux pastry puffs filled with vanilla cream.",         price: "$12", img: dessertImgs[2] },
  ],
  Appetizer: [
    { id: 1, name: "Bruschetta al Pomodoro", description: "Toasted bread with tomatoes, basil and olive oil.",      price: "$8",  img: appetizerImgs[0] },
    { id: 2, name: "Crispy Calamari",        description: "Lightly battered calamari rings with aioli dip.",        price: "$12", img: appetizerImgs[1] },
    { id: 3, name: "Stuffed Mushrooms",      description: "Baked mushrooms filled with cream cheese and herbs.",    price: "$10", img: appetizerImgs[2] },
    { id: 4, name: "Spring Rolls",           description: "Crunchy vegetable spring rolls with sweet chili sauce.", price: "$9",  img: appetizerImgs[0] },
    { id: 5, name: "Beef Crostini",          description: "Toasted crostini topped with seasoned beef tartare.",    price: "$14", img: appetizerImgs[1] },
    { id: 6, name: "Shrimp Cocktail",        description: "Chilled shrimp served with tangy cocktail sauce.",       price: "$16", img: appetizerImgs[2] },
    { id: 7, name: "Caprese Salad",          description: "Fresh mozzarella, tomatoes and basil with balsamic.",    price: "$11", img: appetizerImgs[0] },
    { id: 8, name: "Garlic Flatbread",       description: "Crispy flatbread with roasted garlic and herb butter.",  price: "$7",  img: appetizerImgs[1] },
    { id: 9, name: "Soup du Jour",           description: "Chef's daily selection of freshly made soup.",           price: "$9",  img: appetizerImgs[2] },
  ],
  Restaurant: [
    { id: 1, name: "Grilled Salmon Fillet",  description: "Atlantic salmon with lemon butter and seasonal veg.",    price: "$28", img: restaurantImgs[0] },
    { id: 2, name: "Beef Tenderloin",        description: "8oz tenderloin with red wine jus and truffle mash.",     price: "$38", img: restaurantImgs[1] },
    { id: 3, name: "Chicken Parmesan",       description: "Breaded chicken breast with marinara and mozzarella.",   price: "$22", img: restaurantImgs[2] },
    { id: 4, name: "Lamb Rack",              description: "Herb-crusted lamb rack with rosemary jus.",              price: "$36", img: restaurantImgs[0] },
    { id: 5, name: "Vegetable Risotto",      description: "Creamy arborio rice with seasonal vegetables.",          price: "$18", img: restaurantImgs[1] },
    { id: 6, name: "Sea Bass en Papillote",  description: "Baked sea bass with herbs, capers and cherry tomatoes.", price: "$30", img: restaurantImgs[2] },
    { id: 7, name: "Duck Confit",            description: "Slow-cooked duck leg with orange glaze and potatoes.",   price: "$32", img: restaurantImgs[0] },
    { id: 8, name: "Pasta Carbonara",        description: "Spaghetti with pancetta, egg, pecorino and pepper.",     price: "$20", img: restaurantImgs[1] },
    { id: 9, name: "Mushroom Wellington",    description: "Puff pastry parcel filled with mixed mushrooms.",        price: "$24", img: restaurantImgs[2] },
  ],
  Drinks: [
    { id: 1, name: "Classic Mojito",    description: "Rum, fresh mint, lime juice, sugar and soda water.",      price: "$12", img: drinkImgs[0] },
    { id: 2, name: "Aperol Spritz",     description: "Aperol, prosecco, soda and a slice of orange.",           price: "$13", img: drinkImgs[1] },
    { id: 3, name: "Virgin Colada",     description: "Pineapple juice, coconut cream and crushed ice.",         price: "$10", img: drinkImgs[2] },
    { id: 4, name: "Espresso Martini",  description: "Vodka, coffee liqueur and fresh espresso shot.",          price: "$14", img: drinkImgs[0] },
    { id: 5, name: "Fresh Lemonade",    description: "Hand-squeezed lemonade with mint and honey.",             price: "$7",  img: drinkImgs[1] },
    { id: 6, name: "Berry Smoothie",    description: "Blended mixed berries with yogurt and honey.",            price: "$9",  img: drinkImgs[2] },
    { id: 7, name: "Iced Matcha Latte", description: "Ceremonial matcha with oat milk over ice.",               price: "$8",  img: drinkImgs[0] },
    { id: 8, name: "Sparkling Water",   description: "Chilled sparkling mineral water with lemon slice.",       price: "$4",  img: drinkImgs[1] },
    { id: 9, name: "Hot Chocolate",     description: "Rich dark chocolate with steamed milk and marshmallows.", price: "$7",  img: drinkImgs[2] },
  ],
};
