import { useNavigate } from "react-router";
import "../assets/style/notfound.css";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div id="not-found">
            <div id="background"></div>
            <div id="wrapper">
                <h1>Altra sfortuna...</h1>
                <h2>La pagina che cerchi non esiste</h2>
                <button id="home" onClick={() => navigate('/')}>Vai alla home</button>
            </div>
        </div>
    )
}