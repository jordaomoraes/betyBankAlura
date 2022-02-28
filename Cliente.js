export class Cliente {
    nome;
    _cpf;

    get cpf(){
        return this._cpf;
    }

    constructor(nome, cpf){  //não poderá ser alterado
        this.nome = nome;
        this._cpf = cpf;
    }
}
