export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categorias: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      movimentacoes: {
        Row: {
          created_at: string | null
          data_movimentacao: string | null
          id: string
          observacoes: string | null
          produto_id: string | null
          quantidade: number
          sacoleira_id: string | null
          tipo_movimentacao: string
          valor_unitario: number | null
        }
        Insert: {
          created_at?: string | null
          data_movimentacao?: string | null
          id?: string
          observacoes?: string | null
          produto_id?: string | null
          quantidade: number
          sacoleira_id?: string | null
          tipo_movimentacao: string
          valor_unitario?: number | null
        }
        Update: {
          created_at?: string | null
          data_movimentacao?: string | null
          id?: string
          observacoes?: string | null
          produto_id?: string | null
          quantidade?: number
          sacoleira_id?: string | null
          tipo_movimentacao?: string
          valor_unitario?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "movimentacoes_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacoes_sacoleira_id_fkey"
            columns: ["sacoleira_id"]
            isOneToOne: false
            referencedRelation: "estoque_sacoleiras"
            referencedColumns: ["sacoleira_id"]
          },
          {
            foreignKeyName: "movimentacoes_sacoleira_id_fkey"
            columns: ["sacoleira_id"]
            isOneToOne: false
            referencedRelation: "sacoleiras"
            referencedColumns: ["id"]
          },
        ]
      }
      precos_personalizados: {
        Row: {
          created_at: string | null
          id: string
          preco_personalizado: number
          produto_id: string | null
          sacoleira_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          preco_personalizado: number
          produto_id?: string | null
          sacoleira_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          preco_personalizado?: number
          produto_id?: string | null
          sacoleira_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "precos_personalizados_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "precos_personalizados_sacoleira_id_fkey"
            columns: ["sacoleira_id"]
            isOneToOne: false
            referencedRelation: "estoque_sacoleiras"
            referencedColumns: ["sacoleira_id"]
          },
          {
            foreignKeyName: "precos_personalizados_sacoleira_id_fkey"
            columns: ["sacoleira_id"]
            isOneToOne: false
            referencedRelation: "sacoleiras"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          categoria_id: string | null
          created_at: string | null
          estoque_minimo: number | null
          id: string
          nome: string
          preco_base: number
        }
        Insert: {
          categoria_id?: string | null
          created_at?: string | null
          estoque_minimo?: number | null
          id?: string
          nome: string
          preco_base: number
        }
        Update: {
          categoria_id?: string | null
          created_at?: string | null
          estoque_minimo?: number | null
          id?: string
          nome?: string
          preco_base?: number
        }
        Relationships: [
          {
            foreignKeyName: "produtos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      sacoleiras: {
        Row: {
          cpf: string | null
          created_at: string | null
          email: string | null
          endereco: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          id: string
          nome: string
          sacoleira_relacionada: string | null
          tipo_usuario: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          nome: string
          sacoleira_relacionada?: string | null
          tipo_usuario: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
          sacoleira_relacionada?: string | null
          tipo_usuario?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      estoque_sacoleiras: {
        Row: {
          preco_base: number | null
          produto_id: string | null
          produto_nome: string | null
          quantidade_estoque: number | null
          sacoleira_id: string | null
          sacoleira_nome: string | null
          valor_estoque: number | null
        }
        Relationships: [
          {
            foreignKeyName: "movimentacoes_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
