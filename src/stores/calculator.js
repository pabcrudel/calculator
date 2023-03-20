import { defineStore } from 'pinia';

export const useCalculator = defineStore('Calculator', {
    state: () => ({
        current: {
            operation: "0",
            result: 0
        },
        last: {
            operation: "0",
            result: 0
        },
        buffer: {
            operation: "0",
            result: 0
        },
        saveOperation: false,
    }),
    actions: {
        sendItem(item){
            /* Checking if the item is a number. If it is, it adds it to the number. */
            if (!isNaN(item)) {
                this.current.operation === "0" ? this.current.operation = item : this.current.operation += item;
                this.current.result = eval(this.current.operation)
            }
            /* Checking if the item is backspace and if the number has something. If it is, it will slice the number. */
            else if (item === "backspace") {
                const opLength = this.current.operation.length;

                if (opLength > 0) {
                    /* Checking if the last character of the string is a space. If it is, it will slice
                    the string by 3. If it is not, it will slice the string by 1. */
                    this.current.operation = 
                    this.current.operation.charAt(opLength - 1) === " " ? 
                    this.current.operation.slice(0, -3) : 
                    this.current.operation.slice(0, -1);

                    this.current.result = eval(this.last.operation);
                }
            }
            
            /* Resetting the store. */
            else if (item === "C") {this.$reset()}

            /* Setting the last operation to the current operation and then resetting the current
            operation. */
            else if (item === "=") {
                this.buffer.operation = this.current.operation;
                this.buffer.result = this.current.result;
                
                this.saveOperation = true;
            }
            
            /* Adding the item to the operation and then evaluating the operation. */
            else {
                if (this.saveOperation) {
                    this.saveOperation = false;

                    this.last.operation = this.current.operation;
                    this.last.result = this.current.result;

                    this.current.operation = this.current.result;
                }

                this.current.operation += ` ${item} `;
            };
        }
    },
})