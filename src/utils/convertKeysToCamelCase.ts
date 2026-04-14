import _ from "lodash";

const convertKeysToCamelCase = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map((item) => convertKeysToCamelCase(item));
    } 
    else if (obj !== null && typeof obj === "object") {
        return Object.keys(obj).reduce((acc: Record<string, any>, key) => {
            const camelCaseKey = _.camelCase(key);
            acc[camelCaseKey] = convertKeysToCamelCase(obj[key]);
            return acc;
        }, {});
    }
    return obj;
};

export default convertKeysToCamelCase;
