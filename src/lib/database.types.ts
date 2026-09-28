export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "admin" | "editor";

export type PageTemplate = "standard" | "faq" | "contact";

export type ServiceKind = "practice" | "agency";

export type EnquiryStatus = "new" | "read" | "archived";

export type ProfileRow = {
  id: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export type PageRow = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  template: PageTemplate;
  content: Json;
  published: boolean;
  show_in_nav: boolean;
  nav_label: string | null;
  nav_order: number;
  seo_title: string | null;
  seo_desc: string | null;
  og_image: string | null;
  created_at: string;
  updated_at: string;
}

export type FaqRow = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  active: boolean;
}

export type ServiceRow = {
  id: string;
  kind: ServiceKind;
  title: string;
  slug: string;
  summary: string;
  scope: string[];
  body: Json | null;
  image: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type TeamMemberRow = {
  id: string;
  name: string;
  slug: string | null;
  role: string;
  summary: string | null;
  bio: string | null;
  photo: string | null;
  sort_order: number;
  active: boolean;
}

export type EnquiryRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  topic: string | null;
  message: string;
  status: EnquiryStatus;
  created_at: string;
}

export type MediaRow = {
  id: string;
  path: string;
  url: string;
  alt: string | null;
  size_bytes: number | null;
  created_at: string;
}

export type SettingRow = {
  key: string;
  value: Json;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, "created_at"> & { created_at?: string };
        Update: Partial<Omit<ProfileRow, "id">>;
        Relationships: [];
      };
      pages: {
        Row: PageRow;
        Insert: Omit<PageRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<PageRow, "id">>;
        Relationships: [];
      };
      faqs: {
        Row: FaqRow;
        Insert: Omit<FaqRow, "id"> & { id?: string };
        Update: Partial<Omit<FaqRow, "id">>;
        Relationships: [];
      };
      services: {
        Row: ServiceRow;
        Insert: Omit<ServiceRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ServiceRow, "id">>;
        Relationships: [];
      };
      team_members: {
        Row: TeamMemberRow;
        Insert: Omit<TeamMemberRow, "id"> & { id?: string };
        Update: Partial<Omit<TeamMemberRow, "id">>;
        Relationships: [];
      };
      enquiries: {
        Row: EnquiryRow;
        Insert: Omit<EnquiryRow, "id" | "created_at" | "status"> & {
          id?: string;
          created_at?: string;
          status?: EnquiryStatus;
        };
        Update: Partial<Omit<EnquiryRow, "id">>;
        Relationships: [];
      };
      media: {
        Row: MediaRow;
        Insert: Omit<MediaRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<MediaRow, "id">>;
        Relationships: [];
      };
      settings: {
        Row: SettingRow;
        Insert: SettingRow;
        Update: Partial<SettingRow>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_staff: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
    Enums: {
      user_role: UserRole;
    };
    CompositeTypes: { [_ in never]: never };
  };
}
