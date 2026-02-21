import { useNavigate } from 'react-router';
import '../assets/style/rules.css';

const rules = [
    "Il gioco si basa su un archivio di 50 carte con situazioni orribili che possono succedere in vacanza\
    (da “ti si dimentichi la crema solare”\
     a “ti senti male e finisci in ospedale”). Ogni carta include il nome della situazione, un'immagine rappresentativa e un indice\
     di sfortuna da 1 a 100 (dove 1 è “niente di grave” e 100 è “ma perché proprio a me?”). Ogni carta ha un indice di sfortuna univoco\
     ,con una differenza tra ogni indice di almeno 0.5. L'applicazione permette di giocare più partite. La partita inizia con un giocatore che\
     riceve 3 carte casuali e si svolge in più round. Ogni round propone una\
     nuova situazione orribile, come segue:",
    "Il giocatore vede nome e immagine (ma non l'indice di sfortuna!) della situazione orribile a lui/lei assegnata, diversa da quelle\
    presenti nelle sue carte, e potendo vedere tutte le carte in suo possesso con\
    tutti i relativi dettagli, ordinate per indice di sfortuna crescente, deve indicare dove la situazione ricevuta si colloca, come indice\
    di sfortuna, tra le carte in suo possesso. Per esempio, se il giocatore avesse carte con indice 1.5, 42.5 e 99, potrebbe ipotizzare che\
    la situazione assegnata abbia un indice di sfortuna tra 42.5 e 99 e quindi collocarla tra quelle due carte.",
    "Se il giocatore indovina la collocazione corretta entro 30 secondi, ottiene la carta di quella situazione, che viene quindi aggiunta\
    all'insieme di carte in suo possesso e ne vengono mostrate tutte le informazioni. ",
    "Se il giocatore, invece, non indovina la collocazione corretta entro 30 secondi o il tempo scade senza che il giocatore abbia fatto\
    una scelta, non riceve la carta (e non vede nessuna informazione su quella carta). Tale carta non dovrà essere presentata nuovamente\
    nei round successivi della stessa partita.",
    "Sia in caso di vincita o perdita di un round, l’applicazione mostra un messaggio appropriato e chiede al giocatore di confermare quando\
    è pronto a iniziare un nuovo round.",
    "La partita termina quando il giocatore ha 6 carte in suo possesso (vince) oppure non ha indovinato la collocazione corretta di tre\
    situazioni orribili (perde)."
]

const images = [48, 44, 34, 35, 21];


export default function Rules(){
    const navigate = useNavigate('/');

    return (
        <div id="rules-wrapper">
            <h1>Il gioco della sfortuna</h1>
            <p id="prelude">{rules[0]}</p>
            <div id="rules">
                { rules.map((rule, idx) => {
                    if(idx != 0) return <Rule key={idx} number={idx} text={rules[idx]} image={images[idx-1]}/>
                }) }
            </div>
            <button id="home" onClick={() => navigate('/')}>Vai alla home</button>
        </div>
    )
}

function Rule(props){
    return (
        <div className="rule">
            <div className="info" style={{backgroundImage: `url("http://localhost:3001/static/images/cards/card${props.image}.jpeg")`}}>
                <h2>{props.number}</h2>
            </div>
            <div className="text">
                <p>{props.text}</p>
            </div>
        </div>
    )
}
