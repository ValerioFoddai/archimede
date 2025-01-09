-- Create import_mappings table
create table if not exists import_mappings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  date_format text not null,
  column_mappings jsonb not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id, name)
);

-- Add RLS policies
alter table import_mappings enable row level security;

create policy "Users can view their own import mappings"
  on import_mappings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own import mappings"
  on import_mappings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own import mappings"
  on import_mappings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own import mappings"
  on import_mappings for delete
  using (auth.uid() = user_id);