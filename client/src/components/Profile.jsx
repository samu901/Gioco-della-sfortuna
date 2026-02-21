import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { LogoutButton } from "./Authentication";
import { Card } from "./Card";
import API from "../API/API.mjs"
import "../assets/style/profile.css";

export default function Profile(props) {
    const [matches, setMatches] = useState([]);

    async function getMatches() {
        await API.getMatches().then(matches => {
            setMatches(matches);
        }).catch(error => {});
    }

    useEffect(() => {
        getMatches();
    }, []);

    return (
        <div id="profile">
            <UserInfo logout={props.logout} matches={matches} user={props.user}/>
            <MatchesInfo matches={matches} />
        </div>
    )
}

function UserInfo(props) {
    const navigate = useNavigate();

    return (
        <aside className="column" id="user-info">
            <h1>Benvenuto<br />{props.user}</h1>
            <div id="statistics">
                <h3 id="section">Statistiche</h3>
                <div className="box" id="played">
                    Partite: {props.matches.length}
                </div>
                <div className="box" id="won">
                    Vittorie: { props.matches.filter(match => match.win).length }
                </div>
                <div className="box" id="lost">
                    Sconfitte: { props.matches.filter(match => !match.win).length }
                </div>
            </div>
            <div id="actions">
                <LogoutButton logout={props.logout} user={props.user}/>
                <button id="home" onClick={() => navigate('/')}>Vai alla home</button>
            </div>
        </aside>
    )
}

function MatchesInfo(props) {
    return (
        <div className="column" id="matches-info">
            { 
                props.matches.length === 0 ? 
                    <h2 id="no-matches">Non hai giocato partite</h2> : 
                    <>
                        <h2 id="title">Le tue partite</h2>
                        { props.matches.map((match, idx) => <Match key={idx} match={match} /> )}
                    </>
            }        
        </div>
    )
}

function Match(props){
    const [visible, setVisible] = useState(false);

    function handleVisibility() {
        setVisible(visible => !visible);
    }

    return (
        <article className={`match ${!visible && 'rounded'}`}>
            <div className={`header ${props.match.win ? 'won' : 'lost'} ${!visible && 'rounded'}`} onClick={handleVisibility}>
                <div>
                    <h2>{props.match.date.split('T').join(' ')} - {props.match.win ? 'Vittoria' : 'Sconfitta'}</h2>
                    <p>{props.match.cards.filter(card => card.possessed).length} carte raccolte</p>
                </div>
                <i className={visible ? "bi bi-caret-up-fill" : "bi bi-caret-down-fill"}></i>
            </div>
            <div className='rounds'>
                {   visible && 
                    props.match.cards.map((card, idx) => {
                        return <div className={`round ${!card.possessed ? 'lost' : ''}`} key={idx}>
                                <h3>{card.round ? `Round ${card.round}` : 'Assegnata'}</h3>
                                <p className="possession">{card.possessed ? "posseduta" : "non posseduta"}</p>
                                <Card id={card.id} name={card.name} />
                            </div>

                    })
                }
            </div>
        </article>
    )
}