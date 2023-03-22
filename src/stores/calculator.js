import { defineStore } from 'pinia';

class OperationState {
    constructor() {
        this.reset();
    };

    reset() {
        this.operation = "0";
        this.result = "0";
    };

    setOperation(item) {
        this.operation === "0" ? this.operation = item : this.operation += item;
    };

    sliceOperation(position) {
        this.operation = this.operation.slice(0, - position);
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
                    this.setOperation(item)
                    break;
                case item === "backspace":
                    this.backspace()
                    break;
                case item === "C":
                    this.clear(item)
                    break;
                case item === "=" && !this.isOperator:
                    this.isFinished = true;
                    break;
                case /[+\-*/%.]/.test(item):
                    this.updateOperation(item)
                    break;
            };

            this.setLastInput(item);
            this.isOperator = isNaN(item);
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
            else {
                this.setBuffer();
                this.calc(this.current.operation)
            };
        },
        setLastInput(item){
            this.lastInput = item;
        },
        setBuffer(position){
            this.lastOperation = 
            position != undefined ? 
            this.current.operation.slice(0, - position) :
            this.current.operation;
        },
        calc(operation){
            this.current.result = `${eval(operation)}`;
        },
        backspace(){
            const length = this.current.operation.length;

            if (length <= 1) this.current.reset();
            else {
                if (this.current.operation.charAt(length - 1) === " ") {
                    this.current.sliceOperation(3);
                    this.setBuffer();
                } 
                else {
                    this.current.sliceOperation(1);
                    this.setBuffer(2);
                };
                this.calc(this.lastOperation);
            };
        },
        clear(item){
            if (this.lastInput === item) this.$reset()
            else {
                this.current.reset();
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

                this.current.operation += 
                item === "." ?
                item :
                ` ${item} `;
            };
        }
    },
})