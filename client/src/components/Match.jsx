import React from "react";
import { useEffect, useRef, useState } from "react"
import { Card } from "./Card";
import API from "../API/API.mjs";
import '../assets/style/match.css';
import { useNavigate } from "react-router";

export default function Match(props){
    const [timer, setTimer] = useState(-1);
    const [round, setRound] = useState(1);
    const [life, setLife] = useState(1);
    const [deck, setDeck] = useState(undefined);
    const [drawed, setDrawed] = useState(undefined);
    const [verifing, setVerifing] = useState(false);
    const [finished, setFinished] = useState(false);
    const [confirmDraw, setConfirmDraw] = useState(false);
    const [message, setMessage] = useState('');
    const [done, setDone] = useState(false);

    const handleDrawBox = () => {
        setConfirmDraw(old => !old);
    }

    useEffect(() => {
        setDone(true);
    }, [done]);

    useEffect(() => {
        const initGame = async () => {
            try{
                const response = await API.init();
                setDeck([response[0], response[1], response[2]]);
                setDrawed(response[3]);
                setConfirmDraw(false);
                setTimer(30);
                setVerifing(false);
                setRound(1);
                return true;
            }catch(error){}
        }

        if(!done) return;
        initGame();
    }, [done]);


    useEffect(() => {
        const checkEnd = async () => {
            if(life === 0 || deck.length === 6 || props.demo){
                setFinished(true);
                setVerifing(false);
                if(props.demo)return;   
                try{
                    await API.save();
                }catch(error){}
            }else{
                if(props.demo) return;
                handleDrawBox();
            }
        }
        if(verifing) checkEnd();
    }, [life, deck]);


    useEffect(() => {
        setLife(props.logged ? 3 : 1);
    }, [props.logged]);

    useEffect(() => {
        if(timer === 0){
            setTimer(-1);
            select(0);
        }else if(timer>0){
            setTimeout(() => setTimer(timer => timer-1), 1000);
        }
    }, [timer]);

    async function nextRound(){
        await draw();
        setVerifing(false);
        setRound(round => round+1);
        handleDrawBox();
    }

    

    async function draw() {
        try{
            const response = await API.draw();
            setDrawed(response);
            setTimer(30);
        }catch(error){}
    }

     async function select(index){
        try{
            if(verifing || finished) return;
            setVerifing(true);
            setTimer(-1);
            const response = await API.verify(index);
            if(response.success){
                const card = await API.getCardById(drawed.id);
                setDeck(deck => [...deck, card]);
                setMessage('Hai indovinato');
            }
            else{
                setMessage('Hai sbagliato');
                setLife(life => life-1);
            }
        }catch(error){}
    }

    return (
        <>
        { finished && <Summary finished={finished} summary={deck} setFinished={setFinished} setDone={setDone} setLife={setLife} logged={props.logged} demo={props.demo}/> }
        { !finished && 
            <div id="match">
                { confirmDraw && <DrawBox result={message} handleClick={nextRound}/> }
                <MatchInfo timer={timer} round={round} life={life}/>
                {   deck && <div id="deck"> 
                    {[...deck].sort((a, b) => a.misfortune - b.misfortune).map((card, idx) => {
                        return (<React.Fragment key={idx}>
                                <Button index={idx} draw={draw} verifing={verifing} select={select}/>
                                <Card id={card.id} name={card.name} misfortune={card.misfortune}/>
                                { idx === deck.length-1 && <Button index={idx+1} verifing={verifing} select={select}/> }
                            </React.Fragment>)
                    })}
                    </div>
                }
                {   <div id="drawed">
                    {drawed && <Card id={drawed.id} name={drawed.name} misfortune={drawed.misfortune}/>}
                    </div>
                }
            </div>
        }
        </>
    )
}

function Button(props) {
    const handleClick = () => {
        props.select(props.index);
    }

    return (
        <button id="select" onClick={handleClick} disabled={props.verifing}>Qui</button>
    )
}

function MatchInfo(props){
    return (
        <div id="match-bar">
            <div id="timebar" className={props.timer>=0 ? 'animate' : ''}>
                <p>{props.timer>0 ? props.timer : 0}s</p>
            </div>
            <div id="counters">
                <div className="counter">
                    <div className="text" id="round-text">Round</div>
                    <div id="round">{props.round}</div>
                </div>
                <div className="counter">
                    <div className="text" id="life-text">Vite</div>
                    <div id="life">
                        {Array(props.life).fill(0).map((_, idx) => <i key={idx} className="bi bi-heart-fill"></i>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

function DrawBox(props) {
    return(
        <div id="draw-wrapper">
            <div id="draw-box">
                <h1>{props.result}</h1>
                <p>Clicca sul pulsante quando sei pronto per continuare.</p>
                <div id="draw-actions">
                    <button onClick={props.handleClick}>Pesca</button>
                </div>
            </div>
        </div>
    )
}

function Summary(props){
    const navigate = useNavigate();
    const win = (props.demo && props.summary.length === 4) || (!props.demo && props.summary.length === 6);

    function restart(){
        props.setDone(false);
        props.setFinished(false);
        props.setLife(props.logged ? 3 : 1);
    }

    return (
        <div id="summary">
            <h1>
                {win ? 'Hai vinto' : 'Hai perso'}
            </h1>
            <div id="cards">
                { [...props.summary].sort((a, b) => a.misfortune - b.misfortune).map((card, idx) => {
                    return <div key={idx} className="round">
                            <Card id={card.id} name={card.name} misfortune={card.misfortune}/>
                        </div>    
                })}
            </div>
            <div id="summary-actions">
                <button id="restart" onClick={restart}>Nuova partita</button>
                <button id="home" onClick={() => navigate('/')}>Vai alla home</button>
            </div>
        </div>
    )
}