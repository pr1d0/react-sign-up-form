import { ValidateRule } from "./validateRules";

export interface ValidateResult {
    results: ValidateRuleResult[];
    isValid: boolean;
    rules: ValidateRule[];
}

export interface ValidateRuleResult {
    rule: string;
    valid: boolean;
    message: string;
}

export interface ValidateFormResult {
    [input: string]: {
        validate: ValidateResult
    };
}

class Validator {
    static validate(value: string, rules: ValidateRule[]): ValidateResult {
        const results: ValidateRuleResult[] = [];

        rules.reduce((results, rule) => {
            const result = rule.test(value);
            results.push({ rule: rule.name, valid: result, message: rule.message });
            return results;
        }, results);

        return {
            rules,
            results,
            isValid: !results.some(result => result.valid === false)
        };
    }

    static validateForm(form: { [input: string]: { validate: { rules: ValidateRule[] } } }, formInputs: any ): ValidateFormResult {
        const validateFormResult: any = { ...form, isValid: true};

        for (const input in form) {
            const value = formInputs[input].value;
            const validateRules = form[input].validate.rules;
            const validateResult = this.validate(value, validateRules);

            validateFormResult[input].validate = validateResult;

            if (validateResult.isValid === false) {
                validateFormResult.isValid = false;
            }
        }

        return validateFormResult;
    }
}

export default Validator
