import api from "./api";

const getListings = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach((key) => {
    if (filters[key] !== "" && filters[key] !== undefined && filters[key] !== null) {
      params.append(key, filters[key]);
    }
  });
  const response = await api.get(`/listings?${params.toString()}`);
  return response.data;
};

const getListingById = async (id) => {
  const response = await api.get(`/listings/${id}`);
  return response.data;
};

const getMyListings = async () => {
  const response = await api.get("/listings/owner/my-listings");
  return response.data;
};

const createListing = async (listingData) => {
  const response = await api.post("/listings", listingData);
  return response.data;
};

const updateListing = async (id, listingData) => {
  const response = await api.put(`/listings/${id}`, listingData);
  return response.data;
};

const deleteListing = async (id) => {
  const response = await api.delete(`/listings/${id}`);
  return response.data;
};

const uploadImages = async (files) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append("images", file);
  });

  const response = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export default {
  getListings,
  getListingById,
  getMyListings,
  createListing,
  updateListing,
  deleteListing,
  uploadImages,
};
