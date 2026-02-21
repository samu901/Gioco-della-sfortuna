import { useActionState, useState } from "react";
import { Link } from "react-router";
import Alert from "./Alert";
import '../assets/style/authentication.css';

export function LoginPage(props){
    return (
        <div id="loginPage">
            <section>
                <LoginForm login={props.login} />
                <Link to='/'>Ritorna alla home</Link>
            </section>
            <section id="hero">
                <h1 className="noselect">Il gioco della sfortuna</h1>
            </section>
        </div>
    )
}


function LoginForm(props){
    const [formState, formAction, isPending] = useActionState(loginFunction, {username: '', password: ''});

    async function loginFunction(prevState, formData){
        if(formData.get('username').length < 4 || formData.get('password').length < 6) return { error: 'Campi non validi' };
        const credentials = { username: formData.get('username'), password: formData.get('password') };

        try{
            await props.login(credentials);
            return { success: true };
        }catch(error){
            return { error: 'Username e/o password errati' };
        }
    }

    return (
        <>
            <form id="loginForm" action={formAction}>
                <h2>Accedi</h2>
                { isPending && <Alert type='warning'>Autenticazione in corso...</Alert> }
                <div className="field">
                    <label htmlFor="username">Username</label>
                    <div className="field-wrapper">
                        <i className="bi bi-person"></i>
                        <input type='text' name='username' id="username" placeholder='Inserisci username' minLength={4} required={true} defaultValue={formState.username} autoComplete="text"/>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="password">Password</label>
                    <div className="field-wrapper">
                        <i className="bi bi-lock"></i>
                        <input type='password' name='password' id="password" placeholder='Inserisci password' minLength={6} required={true} defaultValue={formState.password} autoComplete="current-password"/>
                    </div>
                </div>
                { formState.error && <Alert type='danger'>{formState.error}</Alert> }
                <input type="submit" disabled={isPending} value="accedi"/>
            </form>
        </>
    )
}

export function LogoutButton(props){
    const [show, setShow] = useState(false);

    function close() { setShow(false) }
    function open() { setShow(true) }

    return (
        <>
            <button id="logout" onClick={open}>Logout</button>
            { show && <Modal user={props.user} logout={props.logout} close={close}/> }
        </>
    )
}

function Modal(props){
    return (
        <div id="modal-wrapper">
            <div id="backdrop"></div>
            <div id="modal">
                <div id="modal-header">
                    Logout
                    <i className="bi bi-x-lg" onClick={props.close}></i>
                </div>
                <div id="modal-body">
                    <p>Hey {props.user}, sei sicuro di voler uscire dal tuo account?</p>
                </div>
                <div id="modal-actions">
                    <button id="btn-close" onClick={props.close}>Annulla</button>
                    <button id="btn-confirm" onClick={props.logout}>Esci</button>
                </div>
            </div>
        </div>
    )
}