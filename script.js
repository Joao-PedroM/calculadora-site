class Calculadora {

    constructor() {
        this.nrVisor = '0';
        this.ptDecimal = false;
        this.iniciouSegundo = false;
        this.memTemp = '';
        this.estadoErro = false;
        this.desligado = false;
        this.memoria = 0;
        this.op = {
            NOP: 0,
            DIV: 1,
            MULT: 2,
            SUB: 3,
            SUM: 4,
            PORC: 5
        };
        this.opAtual = this.op.NOP;
    }

    mostrarVisor() {
        if (this.estadoErro) {
            this.nrVisor = '0';
            return 'ERRO!';
        }
        if (this.desligado) {
            this.nrVisor = '0';
            return 'ㅤ';
        }
        if (this.nrVisor.length == 0) {
            this.nrVisor = '0';
        }
        return this.nrVisor;
    }

    // recebe dígito
    digito(dig) {
        if (this.estadoErro) return;
        if (dig.length != 1) return;
        if ((dig < '0' || dig > '9') && dig != '.') return;
        if (!this.iniciouSegundo && this.opAtual != this.op.NOP) {
            this.iniciouSegundo = true;
            this.ptDecimal = false;
            this.nrVisor = '0';
        }
        if (this.nrVisor.length == 10) return;
        if (dig == '.') {
            if (this.ptDecimal) return;
            this.ptDecimal = true;
        }
        if (this.nrVisor == '0') {
            this.nrVisor = dig == '.' ?  '0.' : dig;
        } else {
            this.nrVisor += dig;
        }
    }

    // Definir qual a operação atual
    defineOperacao(op) {
        if (this.estadoErro) return;
        switch (op) {
            case '+':
                this.opAtual = this.op.SUM;
                break;
            case '-':
                this.opAtual = this.op.SUB;
                break;
            case '*':
                this.opAtual = this.op.MULT;
                break;
            case '/':
                this.opAtual = this.op.DIV;
                break;
            case '%':
                this.opAtual = this.op.PORC;
                break;
        }
        this.memTemp = this.nrVisor;
    }

    // Executa operação: tecla IGUAL
    igual() {
        if (this.estadoErro) return;
        if (this.opAtual == this.op.NOP) return;
        let num1 = parseFloat(this.memTemp);
        let num2 = parseFloat(this.nrVisor);
        let resultado = 0;
        switch (this.opAtual) {
            case this.op.DIV:
                if (num2 == 0 && this.desligado == false) {
                    this.estadoErro = true;
                    return;
                }
                resultado = num1/num2;
                break;
            case this.op.MULT:
                resultado = num1*num2;
                break;
            case this.op.SUB:
                resultado = num1 - num2;
                break;
            case this.op.SUM:
                resultado = num1 + num2;
                break;
            case this.op.PORC:
                num1 = num1*0.01
                resultado = num1*num2;
                break;
        }
        this.opAtual = this.op.NOP;
        this.iniciouSegundo = false;
        this.ptDecimal = false;
        this.memTemp = '';
        this.nrVisor = String(resultado).slice(0, 10);
    }
    
    // Limpa todos os dados (incluindo a memória)
    teclaOnOff() {
        if (this.desligado == true) {
            this.desligado = false;
            teclaC();
            teclaCLM();
            this.nrVisor = '0';
            return '0';
        }
        if (this.desligado == false) {
            teclaC();
            teclaCLM();
            this.desligado = true;
        }
    }

    // Limpa dados (exceto memória)
    teclaC() {
        this.nrVisor = '0';
        this.ptDecimal = false;
        this.iniciouSegundo = false;
        this.opAtual = this.op.NOP;
        this.memTemp = '';
        this.estadoErro = false;
    }

    // tecla M+ : acrescenta à memória o número no visor
    teclaMmais() {
        if (this.estadoErro) return;
        this.memoria += parseFloat(this.nrVisor);
    }

    // tecla M- : subtrai da memória o número no visor
    teclaMmenos() {
        if (this.estadoErro) return;
        this.memoria -= parseFloat(this.nrVisor);
    }

    // tecla RM : recupera o conteúdo da memória -> coloca no visor
    teclaRM() {
        if (this.estadoErro) return;
        this.nrVisor = String(this.memoria);
    }

    // tecla CLM : limpa totalmente o conteúdo da memória -> atribui 0
    teclaCLM() {
        if (this.estadoErro) return;
        this.memoria = 0;
    }

    // tecla 1x : calcula o inverso de um número
    tecla1x() {
        if (this.estadoErro) return;
        this.nrVisor = String(1/this.nrVisor);
    }

    // tecla Sinal : calcula a inversão de sinal de um número
    teclaSinal() {
        if (this.estadoErro) return;
        this.nrVisor = -this.nrVisor;
    }

    // tecla Raiz : calcula a raiz quadrada de um número
    teclaRaiz() {   
        if (this.estadoErro) return;
        if (this.nrVisor == 0) {
            return 0;
        }
        if(this.nrVisor < 0) {
            this.estadoErro = true;
            return;
        }
        let guess = (this.nrVisor/2);
        for (var i = 0; i < 100; i++) {
            guess = (guess + this.nrVisor / guess) / 2;
        }
        this.nrVisor = guess;
    }

    // tecla Quad : calcula um número elevado ao quadrado
    teclaQuad() {
        if (this.estadoErro) return;
        this.nrVisor = this.nrVisor*this.nrVisor;
    }
}

// ==================================================================
//  RESPOSTAS A EVENTOS DO HTML
// ==================================================================

// ATUALIZA O VALOR NO VISOR
let atualizaVisor = () => {
    document.getElementById('visor-id').innerHTML = calculadora.mostrarVisor();
}

// RECEBE UM DÍGITO (OU PONTO)
let digito = (dig) => {
    calculadora.digito(dig);
    atualizaVisor();
}

// RECEBE OPERAÇÃO ATUAL
let defOp = (op) => {
    if (calculadora.opAtual != calculadora.op.NOP) {
        defIgual();
        atualizaVisor();
    }
    calculadora.defineOperacao(op);
}

// CALCULA A OPERAÇÃO
let defIgual = () => {
    calculadora.igual();
    atualizaVisor();
}

// TECLA ON/OFF: LIMPA TUDO, INCLUINDO MEMÓRIA
let teclaOnOff = () => {
    calculadora.teclaOnOff();
    atualizaVisor();
}

// TECLA C: LIMPA TUDO, EXCETO MEMÓRIA
let teclaC = () => {
    calculadora.teclaC();
    atualizaVisor();
}

// M+ ACRESCENTA À MEMÓRIA O NÚMERO ATUAL NO VISOR
let teclaMmais = () => {
    calculadora.teclaMmais();
}

// M- SUBTRAI DA MEMÓRIA O NÚMERO ATUAL NO VISOR
let teclaMmenos = () => {
    calculadora.teclaMmenos();
}

// PÕE NO VISOR O CONTEÚDO DA MEMÓRIA
let teclaRM = () => {
    calculadora.teclaRM();
    atualizaVisor();
}

// APAGA TODO O CONTEÚDO DA MEMÓRIA
let teclaCLM = () => {
    calculadora.teclaCLM();
}

// INVERTE UM NÚMERO NO VISOR
let tecla1x = () => {
    calculadora.tecla1x();
    atualizaVisor();
}

// INVERTE O SINAL DO NÚMERO NO VISOR
let teclaSinal = () => {
    calculadora.teclaSinal();
    atualizaVisor();
}

// MOSTRA A RAIZ DO NÚMERO NO VISOR
let teclaRaiz = () => {
    calculadora.teclaRaiz();
    atualizaVisor();
}

// MOSTRA O QUADRADO DO NÚMERO NO VISOR
let teclaQuad = () => {
    calculadora.teclaQuad();
    atualizaVisor();
}

// ========================================================
//  INÍCIO DO PROCESSAMENTO
// ========================================================

let calculadora = new Calculadora();