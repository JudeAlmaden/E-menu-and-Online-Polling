export type MenuItem = {
  id: number | undefined;
  name: string;
  description: string;
  price: number;
  hasStock: boolean;
  availableDays: string[];
  imageUrl: string;
  alwaysAvailable: boolean;
  votes?: number; 
  availabilityRange?: {
    start: string;
    end: string;
  } | null;
};

// A Poll includes info about voting and uses MenuItem
export type Poll = {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  candidates: MenuItem[];
  userHasVoted: boolean | null
  isActive: boolean;
};
