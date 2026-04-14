import _ from "lodash";

const convertKeysToPascalCase = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map((item) => convertKeysToPascalCase(item));
    } 
    else if (obj !== null && typeof obj === "object") {
        return Object.keys(obj).reduce((acc: Record<string, any>, key) => {
            const pascalKey = _.upperFirst(_.camelCase(key));
            acc[pascalKey] = convertKeysToPascalCase(obj[key]);
            return acc;
        }, {});
    }
    return obj;
};

export default convertKeysToPascalCase;
