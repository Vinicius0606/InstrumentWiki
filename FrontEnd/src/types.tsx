export type Generico = {
    id: string;
    nome: string;
    descricao: string | null;
}

export type AudioTipo = {
    info: Generico;
    audio: string;
    nota: string;
    oitava: number;
    bpm: number | null;
    creditos: string | null;
}

export type ParteMaterial = {
    parteNome: string;
    parteDescricao: string;
    materialId: number;
    materialNome: string;
    materialDescricao: string;
}

export type AlcanceInstrumento = {
    tipo: String;
    nota_min: String | null;
    nota_max: String | null;
}

export type Afinacao = {
    info: Generico;
    referencia: string | null;
    contexto: string;
}

export const AfinacaoTransposicao = {
    C: "C",
    Bb: "BB",
    Eb: "EB",
    F: "F",
    OUTRO: "OUTRO"
} as const;

export const CategoriaPercussao = {
    MEMBRANOFONE: "MEMBRANOFONE",
    IDIOFONE: "IDIOFONE",
    ELECTROFONE: "ELECTROFONE",
    AEROFONE: "AEROFONE",
    CORDOFONE: "CORDOFONE"
} as const;

export const TocadoCom = {
    BAQUETAS: "BAQUETAS",
    MAO: "MAO",
    HIBRIDO: "HIBRIDO",
    OUTRO: "OUTRO"
} as const;

export type InstrumentoEspecializacao = {
    especializacao: string;
    opcao1: number | boolean;
    opcao1Nome: string;
    opcao2: boolean | typeof AfinacaoTransposicao[keyof typeof AfinacaoTransposicao] 
        | typeof CategoriaPercussao[keyof typeof CategoriaPercussao];
    opcao2Nome: string;
    opcao3: boolean | typeof TocadoCom[keyof typeof TocadoCom];
    opcao3Nome: string;
}

export type Instrumento = {
    info: Generico; 
    familia_instrumento: Generico; 
    historia: string; 
    classificacao_sonoridade: string; 
    imagem: string | null; 
    apelidos: string[] | null; 
    audios: AudioTipo[] | null; 
    partesMateriais: ParteMaterial[] | null; 
    alcances: AlcanceInstrumento[]; 
    afinacao: Afinacao; 
    especializacoes: InstrumentoEspecializacao; 
}