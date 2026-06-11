import axiosClient from "./api/axiosClient";

export async function getOpportunities() {
  const response = await axiosClient.get("/opportunities");
  return response.data;
}

export async function getOpportunityBySlug(slug: string) {
  const response = await axiosClient.get(`/opportunities/${slug}`);
  return response.data;
}