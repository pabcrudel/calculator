import { defineStore } from 'pinia';

class OperationState {
//  Constructors
    constructor() {
        this.reset();
    };

//  Getters
    get getOperation() {
        return this.operation;
    };

    get getOperationLength() {
        return this.operation.length;
    };

    getCharacterFromBehind(position) {
        return this.operation.charAt(this.getOperationLength - position);
    };

    get getResult() {
        return this.result;
    }

//  Setters
    addNumber(item) {
        this.operation === "0" ? this.operation = item : this.operation += item;
    };

//  Methods
    reset() {
        this.operation = "0";
        this.result = "0";
    };
    
    sliceOperation(position) {
        this.operation = this.operation.slice(0, - position);
    };

    isEmpty() {
        return this.operation === "0" && this.result === "0";
    };

    calc() {
        this.result = `${eval(this.operation)}`;
    };
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
                    this.addNumber(item);
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
        addNumber(item){
            if (this.isFinished) {
                this.saveOperation();
                this.clear();
            };

            this.current.addNumber(item);

            if (this.lastInput === "/" && item === "0") {
                this.current.result = "No se puede dividir por cero";

                this.hasError = true;
            }
            else this.calc();
        },
        backspace(){
            const length = this.current.getOperationLength;
            const lastChar = this.current.getCharacterFromBehind(1);

            if (length <= 1) {
                this.current.reset();
                this.setBuffer();
            }
            else {
                if (lastChar === " ") this.deleteOperator();
                else {
                    this.current.sliceOperation(1);

                    if (this.current.getCharacterFromBehind(1) === " ") this.deleteOperator();
                };
                this.calc();
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
        addOperator(item){
            if (this.lastInput != item) {
                if (this.isFinished) this.isFinished = false;

                this.current.operation = this.lastOperation;

                this.current.operation += ` ${item} `;
            };
        },
        setLastInput(item){
            this.lastInput = item;
            this.isOperator = isNaN(item);
        },
        calc(){
            this.setBuffer();
            this.current.calc();
        },
        setBuffer(position){
            this.lastOperation = 
            position != undefined ? 
            this.current.sliceOperation(position) :
            this.current.getOperation;
        },
        deleteOperator() {
            this.current.sliceOperation(3);
        },
        saveOperation(){
            if (this.lastArray.length >= 3) this.lastArray.shift();

            this.lastArray.push({
                operation: this.current.operation,
                result: this.current.result
            });

            this.current.operation = this.current.result;
        },
    },
})