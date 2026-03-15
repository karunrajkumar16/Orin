export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    description: string;
    materials: string[];
    colors: string[];
    sizes: string[];
}

export const CATEGORIES = [
    { id: 'figurines', name: 'Figurines', image: '/images/figurine.png' },
    { id: 'desk', name: 'Desk Accessories', image: '/images/desk_organizer.png' },
    { id: 'gaming', name: 'Gaming Accessories', image: '/images/gaming_stand.png' },
    { id: 'custom', name: 'Custom Prints', image: '/images/plant_pot.png' },
];

export const PRODUCTS: Product[] = [
    {
        id: "prod-1",
        name: "Custom Figurine",
        category: "figurines",
        price: 45,
        image: "/images/figurine.png",
        description: "Highly detailed 3D printed figurine with a smooth matte finish. Perfect for art collectors.",
        materials: ["PLA", "PETG"],
        colors: ["White", "Black", "Purple"],
        sizes: ["Small", "Medium", "Large"]
    },
    {
        id: "prod-2",
        name: "Desk Organizer",
        category: "desk",
        price: 28,
        image: "/images/desk_organizer.png",
        description: "Modern minimalist desk organizer. Keeps your pens and stationery neatly arranged.",
        materials: ["PLA", "PETG"],
        colors: ["White", "Lavender"],
        sizes: ["Standard"]
    },
    {
        id: "prod-3",
        name: "Gaming Headphone Stand",
        category: "gaming",
        price: 35,
        image: "/images/gaming_stand.png",
        description: "Sleek and sturdy headphone stand. Premium addition to any gaming setup.",
        materials: ["PLA", "PETG"],
        colors: ["White", "Black"],
        sizes: ["Standard"]
    },
    {
        id: "prod-4",
        name: "Geometric Plant Pot",
        category: "custom",
        price: 22,
        image: "/images/plant_pot.png",
        description: "Clean geometric plant pot, ideal for succulents. Custom printed with water-resistant PETG.",
        materials: ["PETG"],
        colors: ["White", "Black", "Marble"],
        sizes: ["Small", "Medium"]
    },
    {
        id: "prod-5",
        name: "Controller Stand",
        category: "gaming",
        price: 18,
        image: "/images/gaming_stand.png",
        description: "Minimalist stand for your gaming controller.",
        materials: ["PLA"],
        colors: ["White", "Black", "Purple"],
        sizes: ["Standard"]
    },
    {
        id: "prod-6",
        name: "Phone Stand",
        category: "desk",
        price: 15,
        image: "/images/desk_organizer.png",
        description: "Ergonomic phone stand for desk use.",
        materials: ["PLA", "PETG"],
        colors: ["White", "Lavender"],
        sizes: ["Standard"]
    },
    {
        id: "prod-7",
        name: "Mini Statue",
        category: "figurines",
        price: 30,
        image: "/images/figurine.png",
        description: "Classical art replica printed in high-res.",
        materials: ["PLA"],
        colors: ["White", "Marble"],
        sizes: ["Small", "Medium"]
    },
    {
        id: "prod-8",
        name: "Cable Holder",
        category: "desk",
        price: 12,
        image: "/images/desk_organizer.png",
        description: "Keep your cables organized with this simple clip.",
        materials: ["PLA"],
        colors: ["White", "Black"],
        sizes: ["Standard"]
    },
    {
        id: "prod-9",
        name: "Laptop Stand",
        category: "desk",
        price: 40,
        image: "/images/desk_organizer.png",
        description: "Ergonomic raised laptop stand.",
        materials: ["PETG"],
        colors: ["White", "Black"],
        sizes: ["Standard"]
    },
    {
        id: "prod-10",
        name: "Gaming Dock",
        category: "gaming",
        price: 55,
        image: "/images/gaming_stand.png",
        description: "All-in-one dock for your handheld console.",
        materials: ["PETG"],
        colors: ["White", "Purple"],
        sizes: ["Standard"]
    },
    {
        id: "prod-11",
        name: "Book Holder",
        category: "desk",
        price: 20,
        image: "/images/desk_organizer.png",
        description: "Minimalist bookends to keep your shelf tidy.",
        materials: ["PLA", "PETG"],
        colors: ["White", "Black"],
        sizes: ["Standard"]
    },
    {
        id: "prod-12",
        name: "Art Sculpture",
        category: "figurines",
        price: 60,
        image: "/images/figurine.png",
        description: "Abstract modern art piece for interior decoration.",
        materials: ["PLA"],
        colors: ["White"],
        sizes: ["Large"]
    },
    {
        id: "prod-13",
        name: "Pen Holder",
        category: "desk",
        price: 14,
        image: "/images/desk_organizer.png",
        description: "Simple hexagonal pen holder.",
        materials: ["PLA"],
        colors: ["White", "Lavender"],
        sizes: ["Standard"]
    },
    {
        id: "prod-14",
        name: "Mini Rocket Model",
        category: "custom",
        price: 35,
        image: "/images/plant_pot.png",
        description: "Detailed scale model of a rocket.",
        materials: ["PLA"],
        colors: ["White", "Black"],
        sizes: ["Medium", "Large"]
    },
    {
        id: "prod-15",
        name: "Geometric Lamp",
        category: "custom",
        price: 75,
        image: "/images/plant_pot.png",
        description: "Translucent geometric lamp shade. Requires LED bulb.",
        materials: ["PETG"],
        colors: ["White"],
        sizes: ["Large"]
    }
];
