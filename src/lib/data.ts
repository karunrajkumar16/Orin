export interface MaterialOption {
    name: 'PLA' | 'ABS' | 'Resin';
    multiplier: number;
}

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    originalPrice: number;
    discountPercentage: number;
    image: string;
    images: string[];
    description: string;
    materials: string[];
    materialOptions: MaterialOption[];
    colors: string[];
    sizes: string[];
    stock: number;
    model3d?: string;
}

export const MATERIAL_OPTIONS: MaterialOption[] = [
    { name: 'PLA', multiplier: 1.0 },
    { name: 'ABS', multiplier: 1.2 },
    { name: 'Resin', multiplier: 1.5 },
];

export const CATEGORIES = [
    { id: 'figurines', name: 'Figurines', image: '/images/figurine.png' },
    { id: 'desk', name: 'Desk Accessories', image: '/images/desk_organizer.png' },
    { id: 'gaming', name: 'Gaming Accessories', image: '/images/gaming_stand.png' },
    { id: 'custom', name: 'Custom Prints', image: '/images/plant_pot.png' },
];

export interface PrintPriceConfig {
    basePrice: number;
    material: 'PLA' | 'ABS' | 'Resin';
    quantity: number;
    estimatedPrintTimeHours: number;
}

export function calculatePrintPrice(config: PrintPriceConfig): number {
    const { basePrice, material, quantity, estimatedPrintTimeHours } = config;
    const multiplier = MATERIAL_OPTIONS.find(m => m.name === material)?.multiplier ?? 1;
    const timeCost = estimatedPrintTimeHours * 20;
    const unitPrice = Math.max(99, Math.round(basePrice * multiplier + timeCost));
    return unitPrice * quantity;
}

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    size?: string;
}

export interface CartTotals {
    subtotal: number;
    shipping: number;
    platformFee: number;
    gst: number;
    total: number;
}

export function calculateCartTotals(cartItems: CartItem[]): CartTotals {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 999 ? 0 : 99;
    const platformFee = 19;
    const gst = Math.round((subtotal + platformFee) * 0.18 * 100) / 100;
    const total = Math.round(subtotal + shipping + platformFee + gst);
    return { subtotal, shipping, platformFee, gst, total };
}

export const PRODUCTS: Product[] = [
    {
        id: 'prod-1',
        name: 'Anime Chibi Figurine',
        category: 'figurines',
        price: 599,
        originalPrice: 799,
        discountPercentage: 25,
        image: '/images/figurine.png',
        images: ['/images/figurine.png'],
        description: 'Highly detailed 3D printed chibi anime figurine with smooth matte finish. Perfect for collectors and anime fans.',
        materials: ['PLA', 'ABS', 'Resin'],
        materialOptions: MATERIAL_OPTIONS,
        colors: ['White', 'Black', 'Purple'],
        sizes: ['Small', 'Medium', 'Large'],
        stock: 20,
    },
    {
        id: 'prod-2',
        name: 'Modular Desk Organizer',
        category: 'desk',
        price: 499,
        originalPrice: 649,
        discountPercentage: 23,
        image: '/images/desk_organizer.png',
        images: ['/images/desk_organizer.png'],
        description: 'Modern minimalist desk organizer with separate compartments for pens, stationery, and small gadgets.',
        materials: ['PLA', 'ABS'],
        materialOptions: MATERIAL_OPTIONS.filter(m => m.name !== 'Resin'),
        colors: ['White', 'Lavender', 'Black'],
        sizes: ['Standard'],
        stock: 35,
    },
    {
        id: 'prod-3',
        name: 'Gaming Headphone Stand',
        category: 'gaming',
        price: 799,
        originalPrice: 999,
        discountPercentage: 20,
        image: '/images/gaming_stand.png',
        images: ['/images/gaming_stand.png'],
        description: 'Sleek and sturdy headphone stand with cable management groove. Premium addition to any gaming setup.',
        materials: ['PLA', 'ABS'],
        materialOptions: MATERIAL_OPTIONS.filter(m => m.name !== 'Resin'),
        colors: ['White', 'Black', 'Purple'],
        sizes: ['Standard'],
        stock: 18,
    },
    {
        id: 'prod-4',
        name: 'Geometric Planter Pot',
        category: 'custom',
        price: 349,
        originalPrice: 449,
        discountPercentage: 22,
        image: '/images/plant_pot.png',
        images: ['/images/plant_pot.png'],
        description: 'Clean geometric planter pot ideal for succulents and small indoor plants. Water-resistant finish.',
        materials: ['ABS', 'Resin'],
        materialOptions: MATERIAL_OPTIONS.filter(m => m.name !== 'PLA'),
        colors: ['White', 'Black', 'Marble'],
        sizes: ['Small', 'Medium'],
        stock: 40,
    },
    {
        id: 'prod-5',
        name: 'PS5 Controller Stand',
        category: 'gaming',
        price: 299,
        originalPrice: 399,
        discountPercentage: 25,
        image: '/images/gaming_stand.png',
        images: ['/images/gaming_stand.png'],
        description: 'Minimalist stand designed for PS5 and Xbox controllers. Keeps your desk tidy and controllers accessible.',
        materials: ['PLA', 'ABS'],
        materialOptions: MATERIAL_OPTIONS.filter(m => m.name !== 'Resin'),
        colors: ['White', 'Black', 'Purple'],
        sizes: ['Standard'],
        stock: 50,
    },
    {
        id: 'prod-6',
        name: 'Adjustable Phone Stand',
        category: 'desk',
        price: 199,
        originalPrice: 249,
        discountPercentage: 20,
        image: '/images/desk_organizer.png',
        images: ['/images/desk_organizer.png'],
        description: 'Ergonomic adjustable phone stand for desk use. Compatible with all phone sizes including tablets.',
        materials: ['PLA', 'ABS'],
        materialOptions: MATERIAL_OPTIONS.filter(m => m.name !== 'Resin'),
        colors: ['White', 'Black', 'Lavender'],
        sizes: ['Standard'],
        stock: 60,
    },
    {
        id: 'prod-7',
        name: 'Dragon Mini Statue',
        category: 'figurines',
        price: 999,
        originalPrice: 1299,
        discountPercentage: 23,
        image: '/images/figurine.png',
        images: ['/images/figurine.png'],
        description: 'Intricate dragon statue with fine scale detailing. A showpiece for your desk or shelf.',
        materials: ['PLA', 'Resin'],
        materialOptions: MATERIAL_OPTIONS.filter(m => m.name !== 'ABS'),
        colors: ['White', 'Black', 'Gold'],
        sizes: ['Small', 'Medium', 'Large'],
        stock: 12,
    },
    {
        id: 'prod-8',
        name: 'Cable Management Clips',
        category: 'desk',
        price: 149,
        originalPrice: 199,
        discountPercentage: 25,
        image: '/images/desk_organizer.png',
        images: ['/images/desk_organizer.png'],
        description: 'Set of 6 cable management clips. Keep your desk cables organized and tangle-free.',
        materials: ['PLA'],
        materialOptions: MATERIAL_OPTIONS.filter(m => m.name === 'PLA'),
        colors: ['White', 'Black'],
        sizes: ['Standard'],
        stock: 100,
    },
    {
        id: 'prod-9',
        name: 'Laptop Cooling Stand',
        category: 'desk',
        price: 899,
        originalPrice: 1199,
        discountPercentage: 25,
        image: '/images/desk_organizer.png',
        images: ['/images/desk_organizer.png'],
        description: 'Ergonomic raised laptop stand with ventilation slots. Reduces neck strain and improves airflow.',
        materials: ['ABS'],
        materialOptions: MATERIAL_OPTIONS.filter(m => m.name === 'ABS'),
        colors: ['White', 'Black'],
        sizes: ['Standard'],
        stock: 25,
    },
    {
        id: 'prod-10',
        name: 'Handheld Console Dock',
        category: 'gaming',
        price: 1299,
        originalPrice: 1599,
        discountPercentage: 19,
        image: '/images/gaming_stand.png',
        images: ['/images/gaming_stand.png'],
        description: 'All-in-one dock for Steam Deck and Nintendo Switch. Includes controller and game card slots.',
        materials: ['ABS'],
        materialOptions: MATERIAL_OPTIONS.filter(m => m.name === 'ABS'),
        colors: ['White', 'Black', 'Purple'],
        sizes: ['Standard'],
        stock: 15,
    },
    {
        id: 'prod-11',
        name: 'Bookend Set',
        category: 'desk',
        price: 399,
        originalPrice: 499,
        discountPercentage: 20,
        image: '/images/desk_organizer.png',
        images: ['/images/desk_organizer.png'],
        description: 'Pair of minimalist geometric bookends. Keeps your bookshelf tidy and adds a modern aesthetic.',
        materials: ['PLA', 'ABS'],
        materialOptions: MATERIAL_OPTIONS.filter(m => m.name !== 'Resin'),
        colors: ['White', 'Black', 'Marble'],
        sizes: ['Standard'],
        stock: 30,
    },
    {
        id: 'prod-12',
        name: 'Abstract Art Sculpture',
        category: 'figurines',
        price: 1999,
        originalPrice: 2499,
        discountPercentage: 20,
        image: '/images/figurine.png',
        images: ['/images/figurine.png'],
        description: 'Large abstract modern art sculpture for interior decoration. A conversation starter for any room.',
        materials: ['PLA', 'Resin'],
        materialOptions: MATERIAL_OPTIONS.filter(m => m.name !== 'ABS'),
        colors: ['White', 'Marble'],
        sizes: ['Large'],
        stock: 8,
    },
    {
        id: 'prod-13',
        name: 'Hexagonal Pen Holder',
        category: 'desk',
        price: 249,
        originalPrice: 299,
        discountPercentage: 17,
        image: '/images/desk_organizer.png',
        images: ['/images/desk_organizer.png'],
        description: 'Honeycomb-inspired hexagonal pen holder. Holds pens, markers, scissors, and more.',
        materials: ['PLA'],
        materialOptions: MATERIAL_OPTIONS.filter(m => m.name === 'PLA'),
        colors: ['White', 'Lavender', 'Black'],
        sizes: ['Standard'],
        stock: 45,
    },
    {
        id: 'prod-14',
        name: 'ISRO Rocket Scale Model',
        category: 'custom',
        price: 1499,
        originalPrice: 1899,
        discountPercentage: 21,
        image: '/images/plant_pot.png',
        images: ['/images/plant_pot.png'],
        description: 'Detailed scale model of ISRO PSLV rocket. Great for space enthusiasts and educational display.',
        materials: ['PLA', 'ABS'],
        materialOptions: MATERIAL_OPTIONS.filter(m => m.name !== 'Resin'),
        colors: ['White', 'Silver', 'Black'],
        sizes: ['Medium', 'Large'],
        stock: 10,
    },
    {
        id: 'prod-15',
        name: 'Geometric Lamp Shade',
        category: 'custom',
        price: 2499,
        originalPrice: 2999,
        discountPercentage: 17,
        image: '/images/plant_pot.png',
        images: ['/images/plant_pot.png'],
        description: 'Translucent geometric lamp shade that casts beautiful patterns. Requires standard E27 LED bulb.',
        materials: ['Resin'],
        materialOptions: MATERIAL_OPTIONS.filter(m => m.name === 'Resin'),
        colors: ['White', 'Amber'],
        sizes: ['Large'],
        stock: 6,
    },
];
