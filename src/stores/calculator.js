import { defineStore } from 'pinia';

class OperationState {
//  Constructors
    constructor() {this.reset();};

//  Getters
    get getOperation() {return this.operation;};

    get getOperationLength() {return this.operation.length;};

    getCharacterFromBehind(position) {return this.operation.charAt(this.getOperationLength - position);};

    get getResult() {return this.result;}

//  Setters
    setOperation(item) {this.operation = item;};

    setResult(item) {this.result = item;};

//  Methods
    reset() {
        this.operation = "0";
        this.result = "0";
    };
    
    sliceOperation(position) {this.operation = this.operation.slice(0, - position);};

    isEmpty() {return this.operation === "0" && this.result === "0";};

    calc(operation) {this.result = `${eval(operation || this.operation)}`;};

    addItem(item) {this.operation === "0" ? this.setOperation(item) : this.operation += item;};
};

export const useCalculator = defineStore('Calculator', {
    state: () => ({
        current: new OperationState,
        lastOperation: "0",
        lastArray: [],
        hasError: false,
        isFinished: false,
        isOperator: false,
        lastInput: "",
    }),
    actions: {
        handleInput(item){
            if (this.hasError) {
                this.clear();

                this.hasError = false;
            };

            switch (true) {
                case /^\d+(\.\d+)?$/.test(item):
                    this.addItem(item);
                    this.setLastInput(item);
                    break;
                case item === "backspace":
                    this.backspace();
                    break;
                case item === "C":
                    this.clear(item);
                    this.setLastInput(item);
                    break;
                case item === "=" && !this.isOperator:
                    this.isFinished = true;
                    this.setLastInput(item);
                    break;
                case /[+\-*/%.]/.test(item):
                    this.addOperator(item);
                    this.setLastInput(item);
                    break;
            };
        },
        addItem(item){
            if (this.isFinished) {
                this.saveOperation();
                this.clear();
            };

            this.current.addItem(item);

            if (this.lastInput === "/" && item === "0") {
                this.current.setResult("No se puede dividir por cero");

                this.hasError = true;
            }
            else this.calc();
        },
        addOperator(item){
            if (this.lastInput != item) {
                if (this.isFinished) this.isFinished = false;

                this.current.setOperation(this.lastOperation);
                this.current.addItem(item);
            };
        },
        backspace(){
            const length = this.current.getOperationLength;
            
            if (length <= 1) {
                this.current.reset();
                this.setBuffer();
            }
            else {
                this.current.sliceOperation(1);
                const lastChar = this.current.getCharacterFromBehind(1);
                
                if (/[+\-*/%.]/.test(lastChar)) {
                    const operation = this.current.getOperation.slice(0, this.current.getOperationLength - 1);

                    this.calc(operation);
                    this.lastOperation = operation;
                }
                else this.calc();
            };
            this.setLastInput(this.current.getCharacterFromBehind(1));
        },
        clear(item){
            if (this.lastInput === item || this.current.isEmpty()) this.$reset();
            else {
                this.current.reset();
                this.setBuffer();
            }
        },
        setLastInput(item){
            this.lastInput = item;
            this.isOperator = isNaN(item);
        },
        calc(operation){
            this.setBuffer();
            this.current.calc(operation);
        },
        setBuffer(position){
            this.lastOperation = 
            position != undefined ? 
            this.current.sliceOperation(position) :
            this.current.getOperation;
        },
        saveOperation(){
            if (this.lastArray.length >= 3) this.lastArray.shift();

            this.lastArray.push({
                operation: this.current.getOperation,
                result: this.current.getResult
            });
        },
    },
})