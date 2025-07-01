
export interface Lancamento {
  id: string
  produto: string
  produto_id: string
  valor: number
  quantidade: number
  categoria: string
  sacoleira: string
  sacoleira_id: string
  data: string
  total: number
  observacoes?: string
  tipo?: string
}

export interface Produto {
  id: string
  nome: string
  preco_base: number
  categoria: string
}

export interface Sacoleira {
  id: string
  nome: string
}
