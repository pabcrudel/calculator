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

    getLength(){
        return this.operation.length;
    };
};

export const useCalculator = defineStore('Calculator', {
    state: () => ({
        current: new OperationState,
        // last: new OperationState,
        lastOperation: "0",
        lastArray: [],
        hasError: false,
        isFinished: false,
        lastOperator: ""
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
                case item === "=" && isNaN(this.current.operation):
                    this.isFinished = true;
                    break;
                case /[+\-*/%.]/.test(item):
                    this.updateOperation(item)
                    break;
            };

            this.setLastOperator(item)
        },
        setOperation(item){
            if (this.isFinished) {
                this.saveOperation();
                this.clear();
            };

            this.current.setOperation(item);

            if (this.lastOperator === "/" && item === "0") {
                this.current.result = "No se puede dividir por cero";

                this.hasError = true;
            }
            else {
                this.setBuffer();
                this.calc(this.current.operation)
            };
        },
        setLastOperator(item){
            this.lastOperator = item;
        },
        calc(operation){
            this.current.result = `${eval(operation)}`;
        },
        backspace(){
            if (this.current.getLength() <= 1) this.current.reset();
            else {
                if (this.getLastChar(1) === " ") {
                    this.setLastOperator(this.getLastChar(2))
                    
                    this.current.operation = this.current.operation.slice(0, -3)
                }
                else {
                    this.setLastOperator(this.getLastChar(1))

                    this.current.operation = this.current.operation.slice(0, -1)

                    this.setBuffer(this.lastOperator != "." ? this.getLastChar(3) : this.getLastChar(2));
                }

                console.log(this.lastOperator)
                // this.calc(this.lastOperation);
            };
        },
        getLastChar(position){
            return this.current.operation.charAt(this.current.getLength() - position);
        },
        clear(item){
            if (this.lastOperator === item) this.$reset()
            else {
                this.current.reset();
            }
        },
        setBuffer(operation){
            this.lastOperation = 
            operation != undefined ? 
            operation :
            this.current.operation;
        },
        saveOperation(){
            this.lastArray.push({
                operation: this.current.operation,
                result: this.current.result
            });

            this.current.operation = this.current.result;
        },
        updateOperation(item){
            if (this.lastOperator != item) {
                if (this.isFinished) this.isFinished = false;

                this.current.operation = this.lastOperation;

                this.current.operation += 
                item === "." ?
                item :
                ` ${item} `;
            };
        },
    },
})