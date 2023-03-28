import { defineStore } from 'pinia';

class OperationState {
//  Constructors
    constructor(operation, result) {
        if (operation === undefined && result === undefined) this.reset();
        else {
            this.setOperation(operation);
            this.setResult(result);
        };
    };

//  Getters
    get getOperation() {return this.operation;};

    get showOperation() {return this.operation.replace(/([\+\-\*\/\%])/g, ' $1 ');};

    get getOperationLength() {return this.operation.length;};

    getCharacterFromBehind(position) {return this.operation.charAt(this.getOperationLength - position);};

    get getResult() {return this.result;};

    get showResult() {return "= " + this.result;};

//  Setters
    setOperation(currentInput) {this.operation = currentInput;};

    setResult(currentInput) {this.result = currentInput;};

//  Methods
    reset() {
        this.operation = "0";
        this.result = "0";
    };
    
    sliceOperation(position) {this.operation = this.operation.slice(0, - position);};

    isEmpty() {return this.operation === "0" && this.result === "0";};

    calc(operation) {this.result = `${eval(operation || this.operation)}`;};

    addcurrentInput(currentInput) {this.operation === "0" ? this.setOperation(currentInput) : this.operation += currentInput;};
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
        handleInput(currentInput){
            if (this.hasError) {
                this.clear();

                this.hasError = false;
            };

            switch (true) {
                case /^\d+(\.\d+)?$/.test(currentInput):
                    this.addNumber(currentInput);
                    if (this.isFinished) this.isFinished = false;
                    break;
                case currentInput === "backspace":
                    this.backspace();
                    if (this.isFinished) this.isFinished = false;
                    break;
                case currentInput === "C":
                    this.clear(currentInput);
                    if (this.isFinished) this.isFinished = false;
                    break;
                case currentInput === "=" && !this.isOperator:
                    this.isFinished = true;
                    break;
                case /[+\-*/%.]/.test(currentInput):
                    this.addOperator(currentInput);
                    if (this.isFinished) this.isFinished = false;
                    break;
            };
        },
        addNumber(currentInput){
            if (this.isFinished && isNaN(this.current.getOperation)) {
                this.saveOperation();
                this.clear();
            };

            this.current.addcurrentInput(currentInput);

            if (this.lastInput === "/" && currentInput === "0") {
                this.current.setResult("No se puede dividir por cero");

                this.hasError = true;
            }
            else this.calc();

            this.setLastInput(currentInput);
        },
        addOperator(currentInput){
            if (this.current.getOperation != 0 && this.lastInput != currentInput) {

                this.current.setOperation(this.lastOperation);
                this.current.addcurrentInput(currentInput);

                this.setLastInput(currentInput);
            };
        },
        backspace(){
            if (this.current.getOperationLength > 1) {
                this.current.sliceOperation(1);
                const lastChar = this.current.getCharacterFromBehind(1);
                
                if (/[+\-*/%.]/.test(lastChar)) {
                    const operation = this.current.getOperation.slice(0, this.current.getOperationLength - 1);
    
                    this.calc(operation);
                    this.lastOperation = operation;
                }
                else this.calc();
    
                this.setLastInput(this.current.getCharacterFromBehind(1));
            }
            else this.clear();
        },
        clear(currentInput){
            if (this.lastInput === currentInput || (this.current.isEmpty() && this.lastArray.length === 0)) this.$reset();
            else {
                this.current.reset();
                this.setBuffer();
                this.setLastInput(currentInput || "");
            }
        },
        setLastInput(currentInput){
            this.lastInput = currentInput;
            this.isOperator = isNaN(currentInput);
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

            this.lastArray.push(new OperationState(this.current.getOperation, this.current.getResult));
        },
    },
})