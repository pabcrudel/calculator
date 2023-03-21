import { defineStore } from 'pinia';

export const useCalculator = defineStore('Calculator', {
    state: () => ({
        current: {
            operation: "0",
            result: "0"
        },
        last: {
            operation: "0",
            operator: "",
            result: "0"
        },
        buffer: {
            operation: "0",
            result: "0"
        },
        isSaved: false,
    }),
    actions: {
        handleInput(item){
            switch (true) {
                case /^\d+(\.\d+)?$/.test(item):
                    this.setOperation(item)
                    break;
                case item === "backspace":
                    this.saveOperation()
                    this.backspace()
                    break;
                case item === "C":
                    this.$reset()
                    break;
                case item === "=":
                    this.setBuffer()
                    break;
                case /[+\-*/%.]/.test(item):
                    this.saveOperation()
                    this.updateOperation(item)
                    break;
            };
        },
        setOperation(item){
            this.current.operation === "0" ? this.current.operation = item : this.current.operation += item;

            this.last.operator = "";

            this.calc(this.current.operation)
        },
        calc(operation){
            this.current.result = `${eval(operation)}`
        },
        backspace(){
            const opLength = this.current.operation.length;

            if (opLength > 0) {
                /* Checking if the last character of the string is a space. If it is, it will slice
                the string by 3. If it is not, it will slice the string by 1. */
                this.current.operation = 
                this.current.operation.charAt(opLength - 1) === " " ? 
                this.current.operation.slice(0, -3) : 
                this.current.operation.slice(0, -1);

                this.calc(this.last.operation)
            }
        },
        // clear(item){

        // },
        setBuffer(){
            this.buffer.operation = this.current.operation;
            this.buffer.result = this.current.result;
            
            this.isSaved = true;
        },
        saveOperation(){
            if (this.isSaved) {
                this.isSaved = false;
    
                this.last.operation = this.current.operation;
                this.last.result = this.current.result;
    
                this.current.operation = this.current.result;
            };
        },
        updateOperation(item){
            if (this.last.operator != item) {
                this.current.operation += 
                item === "." ?
                item :
                ` ${item} `;
    
                this.last.operator = item;
            };
        },
    },
})