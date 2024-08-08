export const REGEXP_IS_UPPERCASE_CHAR_EXIST: RegExp = /[A-Z]+/;
export const REGEXP_IS_EMAIL_RFC_5322: RegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
export const REGEXP_IS_NUMBER_CHAR_EXIST: RegExp = /[0-9]+/;

export interface ValidateRule {
    name: string;
    test: (input: string, options?: { [key: string]: any }) => boolean;
    message: string;
}

const isCharactersMoreThan: ValidateRule = {
    name: 'isCharactersMoreThan',
    test: (input: string, { minWidth } = {}) => input.length >= minWidth,
    message: '8 characters or more (no spaces)',
};

const isCharactersLessThan: ValidateRule = {
    name: 'isCharactersLessThan',
    test: (input: string, { maxWidth } = {}) => input.length <= maxWidth,
    message: '64 characters or less (no spaces)',
};

const isUppercaseCharacterExist: ValidateRule = {
    name: 'isUppercaseCharacterExist',
    test: (input: string) => REGEXP_IS_UPPERCASE_CHAR_EXIST.test(input),
    message: 'Uppercase and lowercase letters',
};

const isNumberCharacterExist: ValidateRule = {
    name: 'isNumberCharacterExist',
    test: (input: string) => REGEXP_IS_NUMBER_CHAR_EXIST.test(input),
    message: 'At least one digit',
};

const isEmail: ValidateRule = {
    name: 'isEmail',
    test: (input: string) => REGEXP_IS_EMAIL_RFC_5322.test(input),
    message: 'Please enter a valid email',
};

const isInRange: ValidateRule = {
    name: 'isInRange',
    test: (input: string, { minWidth = 8, maxWidth = 64 } = {}) =>
        isCharactersMoreThan.test(input, { minWidth }) &&
        isCharactersLessThan.test(input, { maxWidth }),
    message: '8 to 64 characters (no spaces)',
};

export const emailValidateRules: ValidateRule[] = [
    isEmail
];

export const passwordValidateRules: ValidateRule[] = [
    isInRange,
    isUppercaseCharacterExist,
    isNumberCharacterExist,
];