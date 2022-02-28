import {Cliente} from "./Cliente.js";

export class ContaCorrente {
    static numeroDeContas = 0; //vale para todas as contas, se eu alterar eu algum lugar todas as contas são alteradas
    agencia;
    _cliente;
    // _saldo é um campo privado por convenção, futuramente iremos 
    // escrever como #saldo https://github.com/tc39/proposal-class-
    // fields#private-fields
    _saldo = 0;



    set cliente(novoValor) {      //Usar assessores do tipo set é uma boa prática para garantirmos que a atribuição de propriedades está sempre segura
        if(novoValor instanceof Cliente){
            this._cliente = novoValor;
        }
    }

    get cliente(){
        return this._cliente;
    }

    get saldo(){
        return this._saldo;
    }

    constructor(agencia, cliente){
        this.agencia = agencia;
        this.cliente = cliente;
        ContaCorrente.numeroDeContas += 1; //contador para o número de conta, sempre que uma new ContaCorrente é criada contador soma 1
    }


    sacar(valor) {
        if (this._saldo >= valor) {
            this._saldo -= valor;
            return valor;
        }
    }

    depositar(valor) {
        if (valor <= 0) {
            return;
        }
        this._saldo += valor;
    }

    transferir(valor, conta) {
        const valorSacado = this.sacar(valor);
        conta.depositar(valorSacado);
    }
}