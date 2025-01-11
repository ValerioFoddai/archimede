-- Create the transaction rules table
create table if not exists user_transactions_rules (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  keywords text not null,
  main_category text not null,
  sub_category text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create RLS policies
alter table user_transactions_rules enable row level security;

create policy "Users can view their own transaction rules"
  on user_transactions_rules for select
  using (auth.uid() = user_id);

create policy "Users can insert their own transaction rules"
  on user_transactions_rules for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own transaction rules"
  on user_transactions_rules for update
  using (auth.uid() = user_id);

create policy "Users can delete their own transaction rules"
  on user_transactions_rules for delete
  using (auth.uid() = user_id);

-- Create a trigger function to update the updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = current_timestamp;
    return new;
end;
$$ language plpgsql;

-- Create a trigger that calls the function before update
create trigger update_user_transactions_rules_updated_at
    before update on user_transactions_rules
    for each row
    execute function update_updated_at_column();
