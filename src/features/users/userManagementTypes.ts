// ─── Types ────────────────────────────────────────────────────────────────────

export type Role = "admin" | "distributor" | "client";
export type UserStatus = "active" | "inactive";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: UserStatus;
  joinedDate: string;
  lastLogin: string;
  city?: string;
  notes?: string;
  vehicle?: string;
  zones?: string[];
  storeName?: string;
  taxId?: string;
};

export type UserFormData = {
  name: string;
  email: string;
  phone: string;
  city: string;
  role: Role;
  password: string;
  notes: string;
  vehicle: string;
  zonesRaw: string;
  storeName: string;
  taxId: string;
};

// ─── Mock data ────────────────────────────────────────────────────────────────

export const INITIAL_USERS: User[] = [
  {
    id: "1", name: "Admin User", email: "admin@taba3ni.tn",
    phone: "+216 71 000 000", role: "admin", status: "active",
    joinedDate: "2022-01-10", lastLogin: "Today", city: "Tunis",
    notes: "Primary system administrator",
  },
  {
    id: "2", name: "Ahmed Mahmoudi", email: "ahmed.mahmoudi@taba3ni.tn",
    phone: "+216 98 123 456", role: "distributor", status: "active",
    joinedDate: "2023-03-15", lastLogin: "Today", city: "Tunis",
    vehicle: "Refrigerated Truck — 123 TU 1234",
    zones: ["Tunis", "Lac 1", "Lac 2", "Les Berges du Lac"],
  },
  {
    id: "3", name: "Mohamed Trabelsi", email: "mohamed.trabelsi@taba3ni.tn",
    phone: "+216 98 234 567", role: "distributor", status: "active",
    joinedDate: "2023-05-20", lastLogin: "Yesterday", city: "Ariana",
    vehicle: "Van — 456 TU 5678",
    zones: ["Ariana", "Manouba", "Ennasr"],
  },
  {
    id: "4", name: "Karim Belaid", email: "karim.belaid@taba3ni.tn",
    phone: "+216 98 345 678", role: "distributor", status: "active",
    joinedDate: "2024-01-08", lastLogin: "2 days ago", city: "Ben Arous",
    vehicle: "Refrigerated Van — 789 TU 9012",
    zones: ["Ben Arous", "La Marsa", "Carthage"],
  },
  {
    id: "5", name: "Carrefour Lac 2", email: "client@taba3ni.tn",
    phone: "+216 71 123 456", role: "client", status: "active",
    joinedDate: "2023-06-20", lastLogin: "Today", city: "Tunis",
    storeName: "Carrefour Lac 2", taxId: "TN-123456789",
  },
  {
    id: "6", name: "Magasin Général Marsa", email: "general.marsa@email.com",
    phone: "+216 71 234 567", role: "client", status: "inactive",
    joinedDate: "2023-08-14", lastLogin: "1 month ago", city: "La Marsa",
    storeName: "Magasin Général Marsa", taxId: "TN-234567890",
  },
  {
    id: "7", name: "Monoprix Menzah", email: "monoprix.menzah@email.com",
    phone: "+216 71 345 678", role: "client", status: "active",
    joinedDate: "2023-11-01", lastLogin: "3 days ago", city: "Ariana",
    storeName: "Monoprix Menzah", taxId: "TN-345678901",
  },
  {
    id: "8", name: "Superette Ariana", email: "superette.ariana@email.com",
    phone: "+216 71 456 789", role: "client", status: "active",
    joinedDate: "2024-02-15", lastLogin: "1 week ago", city: "Ariana",
    storeName: "Superette Ariana", taxId: "TN-456789012",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getInitials(name: string): string {
  return name.trim().split(" ").slice(0, 2).map(n => n[0]?.toUpperCase()).join("");
}

export function formatDate(str: string): string {
  return new Date(str).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}