export interface Tag {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  created_at: string;
}

export interface CreateTagInput {
  name: string;
  description?: string | null;
}

export interface UpdateTagInput extends CreateTagInput {
  id: string;
}
