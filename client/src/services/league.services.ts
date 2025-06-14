import { League } from "@/types/league.types";
import axiosConfig from "../axios";
export const apiGetAllLeagues = async () => {
  try {
    const response = await axiosConfig({
      method: "GET",
      url: "/leagues/",
    });
    return response;
  } catch (error) {
    console.error("Error fetching all leagues:", error);
    throw error;
  }
};
export const apiGetLeagueById = async (id: string) => {
  try {
    const response = await axiosConfig({
      method: "GET",
      url: "/leagues/" + id,
    });
    return response;
  } catch (error) {
    console.error("Error fetching league by ID:", error);
    throw error;
  }
};
export const apiDeleteLeagueById = async (id: string) => {
  try {
    const response = await axiosConfig({
      method: "DELETE",
      url: "/leagues/" + id,
    });
    return response;
  } catch (error) {
    console.error("Error deleting league by ID:", error);
    throw error;
  }
};
export const apiCreateLeague = async (data: League) => {
  try {
    const response = await axiosConfig({
      method: "POST",
      url: "/leagues/",
      data,
    });
    return response;
  } catch (error) {
    console.log("Error fetching current league:", error);
    throw error;
  }
};
export const apiUpdateLeague = async (id: string, data: League) => {
  try {
    const response = await axiosConfig({
      method: "PUT",
      url: "/leagues/" + id,
      data,
    });
    return response;
  } catch (error) {
    console.log("Error fetching current league:", error);
    throw error;
  }
};
