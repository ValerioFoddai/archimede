-- Create bank templates table
CREATE TABLE bank_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create bank column mappings table
CREATE TABLE bank_column_mappings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bank_template_id UUID NOT NULL REFERENCES bank_templates(id) ON DELETE CASCADE,
    source_column TEXT NOT NULL,
    target_column TEXT NOT NULL,
    transformation TEXT, -- Optional transformation logic (e.g., date format conversion)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT valid_target_column CHECK (target_column IN ('date', 'description', 'amount', 'notes'))
);

-- Create indexes
CREATE INDEX idx_bank_templates_user_id ON bank_templates(user_id);
CREATE INDEX idx_bank_column_mappings_template_id ON bank_column_mappings(bank_template_id);

-- Enable Row Level Security
ALTER TABLE bank_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_column_mappings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own bank templates"
    ON bank_templates FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bank templates"
    ON bank_templates FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bank templates"
    ON bank_templates FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bank templates"
    ON bank_templates FOR DELETE
    USING (auth.uid() = user_id);

-- Column mappings policies (through bank_templates relationship)
CREATE POLICY "Users can view column mappings for their templates"
    ON bank_column_mappings FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM bank_templates
        WHERE bank_templates.id = bank_column_mappings.bank_template_id
        AND bank_templates.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert column mappings for their templates"
    ON bank_column_mappings FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM bank_templates
        WHERE bank_templates.id = bank_column_mappings.bank_template_id
        AND bank_templates.user_id = auth.uid()
    ));

CREATE POLICY "Users can update column mappings for their templates"
    ON bank_column_mappings FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM bank_templates
        WHERE bank_templates.id = bank_column_mappings.bank_template_id
        AND bank_templates.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM bank_templates
        WHERE bank_templates.id = bank_column_mappings.bank_template_id
        AND bank_templates.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete column mappings for their templates"
    ON bank_column_mappings FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM bank_templates
        WHERE bank_templates.id = bank_column_mappings.bank_template_id
        AND bank_templates.user_id = auth.uid()
    ));

-- Add updated_at trigger function if not exists
DO $$ BEGIN
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = TIMEZONE('utc'::text, NOW());
        RETURN NEW;
    END;
    $$ language 'plpgsql';
EXCEPTION
    WHEN duplicate_function THEN NULL;
END $$;

-- Create triggers for updated_at
CREATE TRIGGER update_bank_templates_updated_at
    BEFORE UPDATE ON bank_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bank_column_mappings_updated_at
    BEFORE UPDATE ON bank_column_mappings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
