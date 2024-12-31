export interface UserTag {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface CreateUserTagInput {
  name: string;
  description?: string;
}

export interface UpdateUserTagInput {
  id: string;
  name: string;
  description?: string;
}
