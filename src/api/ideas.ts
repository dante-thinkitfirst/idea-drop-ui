import api from "@/lib/axios";
import type { Idea } from "@/types";

export const fetchIdeas = async (limit?: number): Promise<Idea[]> => {
  const response = await api.get("/ideas", {
    params: limit ? { _limit: limit } : {},
  });
  return response.data;
};

export const fetchIdea = async (ideaId: string): Promise<Idea> => {
  const response = await api.get(`/ideas/${ideaId}`);
  return response.data;
};

export const createIdea = async (newIdea: {
  title: string;
  summary: string;
  description: string;
  tags: string[];
}): Promise<Idea> => {
  const response = await api.post("/ideas", {
    ...newIdea,
    createdAt: new Date().toISOString(),
  });

  return response.data;
};

export const deleteIdea = async (ideaId: string): Promise<void> => {
  await api.delete(`/ideas/${ideaId}`);
};

export const updateIdea = async (
  ideaId: string,
  updatedData: {
    title: string;
    summary: string;
    description: string;
    tags: string[];
  }
): Promise<Idea> => {
  // Backend expects PUT for updates
  const response = await api.put(`/ideas/${ideaId}`, {
    ...updatedData,
  });
  return response.data;
};
