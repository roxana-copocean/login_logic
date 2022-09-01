import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';
import AuthContext from '../../context/auth-context';
import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';

const Login = () => {
	const [ formIsValid, setFormIsValid ] = useState(false);
	const context = useContext(AuthContext);
	const [ emailState, dispatchEmail ] = useReducer(
		(state, action) => {
			if (action.type === 'USER_INPUT') {
				return { value: action.val, isValid: action.val.includes('@') };
			}
			if (action.type === 'INPUT_BLUR') {
				return { value: state.value, isValid: state.value.includes('@') };
			}
			return { value: ' ', isValid: false };
		},
		{ value: '', isValid: null }
	);

	const [ passwordState, dispatchPassword ] = useReducer(
		(state, action) => {
			if (action.type === 'USER_INPUT') {
				return { value: action.val, isValid: action.val.trim().length > 6 };
			}
			if (action.type === 'INPUT_BLUR') {
				return { value: state.value, isValid: state.value.trim().length > 6 };
			}
			return { value: ' ', isValid: false };
		},
		{ value: '', isValid: null }
	);

	const emailInputRef = useRef();
	const passwordInputRef = useRef();

	// Alias Assignment - so we rename isValid ->
	const { isValid: emailIsValid } = emailState;
	const { isValid: passIsValid } = passwordState;

	useEffect(
		() => {
			const identifier = setTimeout(() => {
				setFormIsValid(emailIsValid && passIsValid);
			}, 500);

			return () => {
				clearTimeout(identifier);
			};
		},
		[ emailIsValid, passIsValid ]
	);

	const emailChangeHandler = (event) => {
		dispatchEmail({ type: 'USER_INPUT', val: event.target.value });
	};

	const passwordChangeHandler = (event) => {
		dispatchPassword({ type: 'USER_INPUT', val: event.target.value });
	};

	const validateEmailHandler = () => {
		dispatchEmail({
			type: 'INPUT_BLUR'
		});
	};

	const validatePasswordHandler = () => {
		dispatchPassword({ type: 'INPUT_BLUR' });
	};

	const submitHandler = (event) => {
		event.preventDefault();
		if (formIsValid) {
			context.onLogin(emailState.value, passwordState.value);
		} else if (!emailIsValid) {
			emailInputRef.current.focus();
		} else {
			passwordInputRef.current.focus();
		}
	};

	return (
		<Card className={classes.login}>
			<form onSubmit={submitHandler}>
				<Input
					ref={emailInputRef}
					type="email"
					id="email"
					label="E-Mail"
					onChange={emailChangeHandler}
					isValid={emailIsValid}
					value={emailState.value}
					onBlur={validateEmailHandler}
				/>
				<Input
					ref={passwordInputRef}
					type="password"
					id="password"
					label="Password"
					onChange={passwordChangeHandler}
					isValid={passIsValid}
					value={passwordState.value}
					onBlur={validatePasswordHandler}
				/>

				<div className={classes.actions}>
					<Button type="submit" className={classes.btn}>
						Login
					</Button>
				</div>
			</form>
		</Card>
	);
};

export default Login;
