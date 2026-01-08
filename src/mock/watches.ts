export type Brand =
  | "Seiko"
  | "Tissot"
  | "Hamilton"
  | "Orient"
  | "Citizen"
  | "Longines"
  | "Omega"
  | "Rolex"
  | "Tudor"
  | "Grand Seiko";

export type MovementType = "Automatic" | "Manual";
export type CaseMaterial =
  | "Stainless Steel"
  | "Titanium"
  | "Bronze"
  | "Ceramic";
export type Crystal = "Sapphire" | "Hardlex" | "Mineral";
export type Strap = "Leather" | "Bracelet" | "NATO" | "Rubber";

export interface Watch {
  id: string;
  brand: Brand;
  model: string;
  price: number;
  currency: "USD";
  movementType: MovementType;
  caliber: string;
  powerReserveHours: number;
  caseSizeMm: number;
  caseMaterial: CaseMaterial;
  crystal: Crystal;
  waterResistanceM: number;
  complications: string[];
  dialColor: string;
  strap: Strap;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  createdAt: string;
  featured: boolean;
}

// Single default watch image used for all watches
const DEFAULT_WATCH_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&q=80&auto=format";

export const brands: Brand[] = [
  "Seiko",
  "Tissot",
  "Hamilton",
  "Orient",
  "Citizen",
  "Longines",
  "Omega",
  "Rolex",
  "Tudor",
  "Grand Seiko",
];

const complicationsList = [
  "Date",
  "Chronograph",
  "GMT",
  "Moonphase",
  "Power Reserve",
  "Day-Date",
  "Tachymeter",
  "Small Seconds",
  "24-Hour",
];

const dialColors = [
  "Black",
  "White",
  "Silver",
  "Blue",
  "Green",
  "Brown",
  "Champagne",
  "Navy",
  "Grey",
  "Ivory",
];

const models = {
  Seiko: [
    "Presage Cocktail Time",
    "Prospex Diver",
    "SARB017",
    "SKX007",
    "Alpinist",
    "Samurai",
  ],
  Tissot: ["Le Locle", "Visodate", "PRX", "Seastar", "Heritage", "Gentleman"],
  Hamilton: [
    "Khaki Field Auto",
    "Intra-Matic",
    "Jazzmaster",
    "Ventura",
    "Murph",
    "Khaki Navy",
  ],
  Orient: ["Bambino", "Kamasu", "Mako", "Ray", "Sun and Moon", "Defender"],
  Citizen: [
    "Eco-Drive Promaster",
    "Chronomaster",
    "Tsuyosa",
    "Nighthawk",
    "Avion",
  ],
  Longines: [
    "HydroConquest",
    "Master Collection",
    "Conquest",
    "Heritage",
    "Spirit",
  ],
  Omega: [
    "Speedmaster",
    "Seamaster",
    "Constellation",
    "De Ville",
    "Railmaster",
  ],
  Rolex: [
    "Submariner",
    "Datejust",
    "Explorer",
    "GMT-Master",
    "Daytona",
    "Yacht-Master",
  ],
  Tudor: ["Black Bay", "Pelagos", "Ranger", "Royal", "Heritage"],
  "Grand Seiko": ["Snowflake", "Spring Drive", "Heritage", "Elegance", "Sport"],
};

const calibers = [
  "4R35",
  "6R15",
  "7S26",
  "Powermatic 80",
  "ETA 2824-2",
  "ETA 2892",
  "H-10",
  "NH35",
  "Miyota 9015",
  "Cal. 3135",
  "Cal. 3235",
  "Spring Drive 9R65",
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateWatch(id: number): Watch {
  const brand = randomElement(brands);
  const model = randomElement(models[brand]);
  const isLuxury = ["Omega", "Rolex", "Tudor", "Grand Seiko"].includes(brand);
  const basePrice = isLuxury ? randomInt(3000, 15000) : randomInt(200, 2000);

  const complications = complicationsList
    .sort(() => Math.random() - 0.5)
    .slice(0, randomInt(0, 3));

  const dialColor = randomElement(dialColors);
  const caseSize = randomInt(36, 44);
  const waterResistance = randomElement([30, 50, 100, 200, 300]);
  const movementType = randomElement<MovementType>(["Automatic", "Manual"]);
  const caseMaterial = randomElement<CaseMaterial>([
    "Stainless Steel",
    "Titanium",
    "Bronze",
    "Ceramic",
  ]);
  const crystal = isLuxury
    ? "Sapphire"
    : randomElement<Crystal>(["Sapphire", "Hardlex", "Mineral"]);
  const strap = randomElement<Strap>(["Leather", "Bracelet", "NATO", "Rubber"]);

  const rating = randomFloat(3.5, 5.0);
  const reviewCount = randomInt(12, 450);
  const featured = Math.random() < 0.15;
  const inStock = Math.random() < 0.85;

  const powerReserve =
    movementType === "Automatic" ? randomInt(38, 72) : randomInt(40, 80);

  const description = `The ${brand} ${model} represents the pinnacle of mechanical watchmaking. 
    Featuring a ${dialColor.toLowerCase()} dial with ${
    complications.length > 0
      ? complications.join(", ") + " complications"
      : "classic simplicity"
  }, 
    this timepiece combines heritage craftsmanship with modern precision. The ${caseSize}mm case 
    in ${caseMaterial.toLowerCase()} houses a ${movementType.toLowerCase()} ${randomElement(
    calibers
  )} movement 
    with ${powerReserve} hours of power reserve. Water resistant to ${waterResistance} meters.`;

  const createdAt = new Date(
    Date.now() - randomInt(0, 365 * 2) * 24 * 60 * 60 * 1000
  ).toISOString();

  return {
    id: `watch-${id}`,
    brand,
    model,
    price: basePrice,
    currency: "USD",
    movementType,
    caliber: randomElement(calibers),
    powerReserveHours: powerReserve,
    caseSizeMm: caseSize,
    caseMaterial,
    crystal,
    waterResistanceM: waterResistance,
    complications,
    dialColor,
    strap,
    inStock,
    rating: Math.round(rating * 10) / 10,
    reviewCount,
    // Use the same default image for all gallery slots
    images: [DEFAULT_WATCH_IMAGE, DEFAULT_WATCH_IMAGE, DEFAULT_WATCH_IMAGE],
    description,
    createdAt,
    featured,
  };
}

export const watches: Watch[] = Array.from({ length: 85 }, (_, i) =>
  generateWatch(i + 1)
);
