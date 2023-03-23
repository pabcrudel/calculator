import { defineStore } from 'pinia';

class OperationState {
//  Constructors
    constructor() {
        this.reset();
    };

//  Getters
    getOperation() {
        return this.operation;
    };

    getOperationLength() {
        return this.operation.length;
    };

    getCharacterFromBehind(position) {
        return this.operation.charAt(this.getOperationLength() - position);
    };

//  Setters
    setOperation(item) {
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
                    this.setOperation(item);
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
                    this.updateOperation(item);
                    this.setLastInput(item);
                    break;
            };
        },
        setOperation(item){
            if (this.isFinished) {
                this.saveOperation();
                this.clear();
            };

            this.current.setOperation(item);

            if (this.lastInput === "/" && item === "0") {
                this.current.result = "No se puede dividir por cero";

                this.hasError = true;
            }
            else this.calc(this.current.operation);
        },
        calc(operation){
            this.setBuffer();
            this.current.result = `${eval(operation)}`;
        },
        setLastInput(item){
            this.lastInput = item;
            this.isOperator = isNaN(item);
        },
        setBuffer(position){
            this.lastOperation = 
            position != undefined ? 
            this.current.operation.slice(0, - position) :
            this.current.getOperation();
        },
        backspace(){
            const length = this.current.getOperationLength();
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
                this.calc(this.current.operation);
            };
            this.setLastInput(this.current.getCharacterFromBehind(1));
        },
        deleteOperator() {
            this.current.sliceOperation(3);
        },
        clear(item){
            if (this.lastInput === item || this.current.isEmpty()) this.$reset();
            else {
                this.current.reset();
                this.setBuffer();
            }
        },
        saveOperation(){
            this.lastArray.push({
                operation: this.current.operation,
                result: this.current.result
            });

            this.current.operation = this.current.result;
        },
        updateOperation(item){
            if (this.lastInput != item) {
                if (this.isFinished) this.isFinished = false;

                this.current.operation = this.lastOperation;

                this.current.operation += ` ${item} `;
            };
        }
    },
})