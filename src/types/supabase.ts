export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_tags: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
        }
      }
      transaction_tags: {
        Row: {
          transaction_id: string
          tag_id: string
        }
        Insert: {
          transaction_id: string
          tag_id: string
        }
        Update: {
          transaction_id?: string
          tag_id?: string
        }
      }
      user_transactions_rules: {
        Row: {
          id: string
          user_id: string
          keywords: string
          main_category: string
          sub_category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          keywords: string
          main_category: string
          sub_category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          keywords?: string
          main_category?: string
          sub_category?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
