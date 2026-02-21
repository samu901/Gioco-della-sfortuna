import { useNavigate } from "react-router";
import '../assets/style/home.css';

function Home(props){

    return (
        <div id="homepage">
            <div className="box" id="box1">
                <img src="http://localhost:3001/static/images/cards/card48.jpeg" alt="" />
            </div>
            <div className="box" id="box2">
                <img src="http://localhost:3001/static/images/cards/card50.jpeg" alt="" />
            </div>
            <div id='wrapper'>
                <div id="info">
                    <h1>Il gioco della sfortuna</h1>
                    <p id="theme">tema vacanza</p>
                </div>
                <Actions logged={props.logged} logout={props.logout} user={props.user}/> 
            </div>
        </div>
    )
}

function Actions(props){
    return (
        <div id="actions">
            <Action path="/rules" type="rules">Regole</Action>
            <Action path="/match" type="play"> { props.logged ? 'partita' : 'demo' } </Action>
            { props.logged ? <Action path='profile' type="profile">Profilo</Action> : <Action path='/login' type='profile'>Login</Action> }
        </div>
    )
}

function Action(props){
    const navigate = useNavigate();

    return (
        <div className="action">
            <button onClick={() => navigate(props.path) } type={props.type}>{ props.children }</button>
        </div>
    )
}

export default Home;