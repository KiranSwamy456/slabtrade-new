import { apiRequest, API_URL } from "@/lib/api";

export type CreateSlabListingRequest = {
  materialName: string;
  thickness: "2cm" | "3cm";
  slabsPerLot: number;
  lengthMin: number;
  lengthMax: number;
  widthMin: number;
  widthMax: number;
  unitPrice: number;
  colorCategory: "Dark" | "Light" | "White";
  veinPattern: "Long" | "Short";
  images?: File[];
};

/** 1 = active (visible to buyers), 0 = inactive */
export type SlabStatus = 0 | 1;

export type SlabListing = Omit<CreateSlabListingRequest, "images"> & {
  id: string;
  vendorId: string;
  lotsPerContainer: number;
  images: string[];
  status: SlabStatus;
  createdAt: string;
};

export type CreateSlabListingResponse = {
  success: boolean;
  message: string;
  data: SlabListing;
};

export type ListSlabListingsResponse = {
  success: boolean;
  message: string;
  data: SlabListing[];
};

export type UpdateSlabStatusResponse = {
  success: boolean;
  message: string;
  data: SlabListing;
};

export const slabService = {
  async createSlabListing(
    data: CreateSlabListingRequest,
    accessToken: string,
  ): Promise<CreateSlabListingResponse> {
    const { images, ...fields } = data;

    const formData = new FormData();

    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    images?.forEach((file) => {
      formData.append("images", file);
    });

    return apiRequest<CreateSlabListingResponse>("/slabs", {
      method: "POST",
      token: accessToken,
      body: formData,
    });
  },

  async getMySlabListings(
    accessToken: string,
  ): Promise<ListSlabListingsResponse> {
    return apiRequest<ListSlabListingsResponse>("/slabs", {
      method: "GET",
      token: accessToken,
    });
  },

  async updateSlabStatus(
    id: string,
    status: SlabStatus,
    accessToken: string,
  ): Promise<UpdateSlabStatusResponse> {
    return apiRequest<UpdateSlabStatusResponse>(`/slabs/${id}/status`, {
      method: "PATCH",
      token: accessToken,
      body: JSON.stringify({ status }),
    });
  },
};

export function getSlabImageUrl(path: string): string {
  return `${API_URL}${path}`;
}
