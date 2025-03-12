import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface Title {
  id: string;
  tconst: string;
  titleType: string;
  primaryTitle: string;
  originalTitle: string;
  isAdult: boolean;
  startYear: number;
  endYear?: number;
  runtimeMinutes?: number;
  genres: Array<{ name: string }>;
  rating?: {
    averageRating: number;
    numVotes: number;
  };
  principals?: Array<{
    name: {
      primaryName: string;
    };
    category: {
      name: string;
    };
  }>;
  posterUrl?: string;
  plot?: string;
  cast?: CastMember[];
  crew?: CrewMember[];
  reviews?: Review[];
  totalResults?: number;
}

export interface CastMember {
  id: string;
  name: string;
  character: string;
  profileUrl?: string;
  order: number;
}

export interface CrewMember {
  id: string;
  name: string;
  department: string;
  job: string;
  profileUrl?: string;
}

export interface Review {
  id: string;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
}

export interface SearchTitleDto {
  search?: string;
  titleType?: string;
  genres?: string[];
  startYear?: number;
  endYear?: number;
  ratingRange?: [number, number];
  isAdult?: boolean;
  runtimeRange?: [number, number];
  language?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  items: Title[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Person {
  id: string;
  primaryName: string;
  birthYear?: number;
  deathYear?: number;
  primaryProfession: string[];
  knownForTitles?: Array<{
    id: string;
    primaryTitle: string;
    startYear: number;
    posterUrl?: string;
  }>;
  profileUrl?: string;
}

export interface SearchPeopleDto {
  search?: string;
  profession?: string;
  birthYearRange?: [number, number];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PeopleSearchResponse {
  items: Person[];
  total: number;
  page: number;
  pageSize: number;
}

// Utility function to transform _id to id recursively
const transformId = (data: any): any => {
  if (!data) return data;
  
  if (Array.isArray(data)) {
    return data.map(item => transformId(item));
  }
  
  if (typeof data === 'object') {
    const transformed = { ...data };
    if ('_id' in transformed) {
      transformed.id = transformed._id;
      delete transformed._id;
    }
    
    for (const key in transformed) {
      transformed[key] = transformId(transformed[key]);
    }
    
    return transformed;
  }
  
  return data;
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor to transform _id to id
api.interceptors.response.use((response) => {
  response.data = transformId(response.data);
  return response;
});

export const titleService = {
  getAllTitles: async (skip?: number, take?: number) => {
    const response = await api.get<SearchResponse>('/api/titles', { params: { skip, take } });
    return response.data;
  },

  getTitleById: async (id: string) => {
    const response = await api.get<Title>(`/api/titles/${id}`);
    return response.data;
  },

  getTitleByImdbId: async (imdbId: string) => {
    const response = await api.get<Title>(`/api/titles/imdb-id/${imdbId}`);
    return response.data;
  },

  searchTitles: async (params: SearchTitleDto) => {
    const response = await api.get<SearchResponse>('/api/titles/search', { params });
    return response.data;
  },

  getTitleCast: async (id: string) => {
    const response = await api.get<CastMember[]>(`/api/titles/${id}/cast`);
    return response.data;
  },

  getTitleCrew: async (id: string) => {
    const response = await api.get<CrewMember[]>(`/api/titles/${id}/crew`);
    return response.data;
  },

  getTitleReviews: async (id: string) => {
    const response = await api.get<Review[]>(`/api/titles/${id}/reviews`);
    return response.data;
  },
};

export const peopleService = {
  searchPeople: async (params: SearchPeopleDto) => {
    const response = await api.get<PeopleSearchResponse>('/api/people/search', { params });
    return response.data;
  },

  getPersonById: async (id: string) => {
    const response = await api.get<Person>(`/api/people/${id}`);
    return response.data;
  },
}; 