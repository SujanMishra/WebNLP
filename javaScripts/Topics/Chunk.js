 class Chunk {
    constructor(text, language, isCode) {
        this.text = text;
        this.language = language;
        this.isCode = isCode;
    }

    serialize() {
        return JSON.stringify({
            text: this.text,
            language: this.language,
            isCode: this.isCode,
        });
    }

    static deserialize(chunkData) {
        return new Chunk(chunkData.text, chunkData.language, chunkData.isCode);
    }
}