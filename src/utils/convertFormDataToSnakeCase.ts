import _ from "lodash";

const convertFormDataToSnakeCase = (formData: FormData): FormData => {
    const newFormData = new FormData();

    for (const [key, value] of formData.entries()) {
        const snakeKey = _.snakeCase(key);
        newFormData.append(snakeKey, value);
    }

    return newFormData;
};

export default convertFormDataToSnakeCase;
