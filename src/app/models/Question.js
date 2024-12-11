export default class Question {
    constructor(type, label) {
        this.type = type;
        this.label = label;
        this.options === type === 'multipleChoice' ? [] : null,
        this.value === null
    }

    addOption(option){
        if (this.type === 'multipleChoice') {
            this.options.push(option)
        } else {
            throw new Error("Not able to add options to non-multipleChoice questions")
        }
    }
}