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
  portOfLoading:
    | "Mundra"
    | "Kandla"
    | "Nhava Sheva (JNPT)"
    | "Chennai"
    | "Kolkata"
    | "Savannah"
    | "Houston"
    | "Baltimore"
    | "New York/New Jersey"
    | "Long Beach";
  images?: File[];
};

/** 1 = active (visible to buyers), 0 = inactive */
export type SlabStatus = 0 | 1;

export type SlabApprovalStatus = "Pending" | "Approved" | "Rejected";

export type SlabListing = Omit<CreateSlabListingRequest, "images"> & {
  id: string;
  vendorId: string;
  lotsPerContainer: number;
  images: string[];
  status: SlabStatus;
  approvalStatus: SlabApprovalStatus;
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

export type MarketplaceSlabListing = SlabListing & { vendorName: string };

export type ListMarketplaceListingsResponse = {
  success: boolean;
  message: string;
  data: MarketplaceSlabListing[];
};

export type UpdateSlabStatusResponse = {
  success: boolean;
  message: string;
  data: SlabListing;
};

export type AdminSlabListing = SlabListing & {
  vendorName: string;
  customerPrice: number | null;
};

export type ListAdminSlabListingsResponse = {
  success: boolean;
  message: string;
  data: AdminSlabListing[];
};

export type ApproveSlabListingResponse = {
  success: boolean;
  message: string;
  data: SlabListing;
};

export type RejectSlabListingResponse = {
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

  async getMarketplaceListings(
    accessToken: string,
  ): Promise<ListMarketplaceListingsResponse> {
    return apiRequest<ListMarketplaceListingsResponse>("/slabs/marketplace", {
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

  async getAdminListings(
    accessToken: string,
  ): Promise<ListAdminSlabListingsResponse> {
    return apiRequest<ListAdminSlabListingsResponse>("/slabs/admin", {
      method: "GET",
      token: accessToken,
    });
  },

  async approveSlabListing(
    id: string,
    customerPrice: number,
    accessToken: string,
  ): Promise<ApproveSlabListingResponse> {
    return apiRequest<ApproveSlabListingResponse>(`/slabs/${id}/approve`, {
      method: "PATCH",
      token: accessToken,
      body: JSON.stringify({ customerPrice }),
    });
  },

  async rejectSlabListing(
    id: string,
    accessToken: string,
  ): Promise<RejectSlabListingResponse> {
    return apiRequest<RejectSlabListingResponse>(`/slabs/${id}/reject`, {
      method: "PATCH",
      token: accessToken,
    });
  },
};

export function getSlabImageUrl(path: string): string {
  return `${API_URL}${path}`;
}
