 class Utils {
    static createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    static createUniqueTopicName(topics) {
        let uniqueName;
        do {
            uniqueName = Utils.createGuid();
        } while (topics.some(topic => topic.name === uniqueName));
        return uniqueName;
    }
}