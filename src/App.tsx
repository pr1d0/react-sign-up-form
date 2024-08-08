import { Component, ReactNode } from 'react';
import './assets/sass/form.scss';
import Validator, { ValidateRuleResult } from './utils/validator';
import { ValidateRule } from './utils/validateRules';
import { emailValidateRules, passwordValidateRules } from './utils/validateRules';

interface FormProps {
    children: ReactNode;
    [key: string]: any;
}

interface FormTitleProps {
    children: ReactNode;
}

interface FormRowProps {
    children: ReactNode;
}

interface FormActionsProps {
    children: ReactNode;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

interface IconProps extends React.SVGProps<SVGSVGElement> {
    name: string;
}

interface InputIconProps extends IconProps { }

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}
interface PasswordStrengthProps {
    results: ValidateRuleResult[];
    initial: ValidateRule[];
}

interface InputValidateMessageProps {
    message: string;
}

interface SignUpFormValidateState {
    form: { [input: string]: { validate: ValidateRuleResult } };
    isFormSubmitted: boolean;
    showPassword: boolean;
}

interface FormValidateFields {
    [input: string]: { validate: { rules: ValidateRule[] } }
}

function Form(props: FormProps) {
    return (
        <form {...props} className="form" >
            {props.children}
        </form>
    );
}

function FormTitle(props: FormTitleProps) {
    return (
        <h1 className='h1 form__title'>{props.children}</h1>
    );
}

function FormRow(props: FormRowProps) {
    return (
        <div className="form__row">
            {props.children}
        </div>
    );
}

function FormActions(props: FormActionsProps) {
    return (
        <div className="form__actions">
            {props.children}
        </div>
    );
}

function Input(props: InputProps) {
    return (
        <input {...props} />
    );
}

function Icon(props: IconProps) {
    return (
        <svg {...props} className={`icon icon-${props.name} ${props.className}`}>
            <use xlinkHref={`#${props.name}`}></use>
        </svg>
    );
}

function InputIcon(props: InputIconProps) {
    return (
        <Icon {...props} name={props.name} className={`field__icon ${props.className}`} />
    );
}

function Button(props: ButtonProps) {
    return (
        <button {...props}>{props.children}</button>
    );
}

function PasswordStrength({ results, initial }: PasswordStrengthProps) {
    return (
        <div className="validate-rules">
            <ul className="validate-rules__list">
                {results?.map(result =>
                    <li key={result.rule} className="validate-rules__item">
                        <div className={`validate-rule ${result.valid ? 'validate-rule--valid' : 'validate-rule--error'}`}>
                            <div className="validate-rule__icon"></div>
                            <div className="validate-rule__desc">{result.message}</div>
                        </div>
                    </li>
                )}
                {!results && initial?.map(result =>
                    <li key={result.name} className="validate-rules__item">
                        <div className="validate-rule">
                            <div className="validate-rule__icon"></div>
                            <div className="validate-rule__desc">{result.message}</div>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );
}

function InputValidateMessage({ message }: InputValidateMessageProps) {
    return (
        <span className="input-validate-message input-validate-message--error form__validate">{message}</span>
    );
}

class SignUpFormValidate extends Component<{}, SignUpFormValidateState> {
    form: FormValidateFields = {
        email: {
            validate: {
                rules: emailValidateRules,
            }
        },
        password: {
            validate: {
                rules: passwordValidateRules,
            }
        }
    }

    state: SignUpFormValidateState = {
        form: {},
        isFormSubmitted: false,
        showPassword: false,
    }

    handleFormSubmitEvent(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        const form = { ...this.form };
        const formInputs = event.currentTarget.elements;
        const validateFormResult = Validator.validateForm(form, formInputs as any);

        this.setState({ form: validateFormResult, isFormSubmitted: true });

        if (validateFormResult.isValid) {
            console.log('Form valid and submitted');
        } else {
            console.log('Form has errors', validateFormResult);
        }
    }

    handlePasswordChangeEvent(event: React.ChangeEvent<HTMLInputElement>): void {
        const form = { ...this.form };
        const value = event.target.value;
        const input = event.target.name;
        const validateResult = Validator.validate(value, form.password.validate.rules);

        form[input].validate = validateResult;

        this.setState({ form });
    }

    toggleShowPassword(): void {
        this.setState({ showPassword: !this.state.showPassword });
    }

    render(): ReactNode {
        const { form, showPassword, isFormSubmitted } = this.state;

        return (
            <Form action="api/user/signup" onSubmit={event => this.handleFormSubmitEvent(event)} noValidate>
                <FormTitle>Sign up</FormTitle>
                <FormRow>
                    <Input type="email" name='email'
                        className={`input ${form.email?.validate?.isValid === false ? 'input--error' : ''} ${form.email?.validate?.isValid === true ? 'input--valid' : ''}`}
                        required
                        placeholder='Enter your email'
                    />
                    {form.email?.validate?.isValid === false && (
                        <InputValidateMessage message={form.email.validate.results[0]?.message} />
                    )}
                </FormRow>
                <FormRow>
                    <div className="field">
                        <Input type={!showPassword ? 'password' : 'text'} name='password' placeholder='Create your password'
                            className={`input ${isFormSubmitted && form.password?.validate?.isValid === false ? 'input--error' : ''}
                                              ${isFormSubmitted && form.password?.validate?.isValid === true ? 'input--valid' : ''}`}
                            required
                            minLength={8}
                            maxLength={64}
                            onChange={event => this.handlePasswordChangeEvent(event)}
                        />
                        <InputIcon name={!showPassword ? 'hidden' : 'showed'} onClick={() => this.toggleShowPassword()} />
                    </div>
                </FormRow>
                <FormRow>
                    <PasswordStrength initial={this.form.password.validate.rules} results={form.password?.validate?.results} />
                </FormRow>

                <FormActions>
                    <Button className='button form__action'>Sign up</Button>
                </FormActions>
            </Form>
        );
    }
}

function App() {
    return (
        <SignUpFormValidate />
    );
}

export default App
