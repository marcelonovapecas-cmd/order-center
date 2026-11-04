export type Cargo =
    | 'EMPREGADO'
    | 'GERENTE'
    | 'ADMIN';

export interface Usuario {
    id: number;
    nome: string;
    email: string;
    cargo: Cargo;
}

export interface LoginResponse {
    usuario: Usuario;
    token: string;
}