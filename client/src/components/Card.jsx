import { useState } from 'react';
import '../assets/style/card.css';

export function Card(props){
    return (
        <div className="card">
            <div className='misfortune'>{ props.misfortune || '?' }</div>
            <img src={`http://localhost:3001/static/images/cards/card${props.id}.jpeg`} alt={`foto carta`} />
            <h2 className="name">{props.name}</h2>
        </div>
    )
}

export function Selector(props){
    return (
        <button className='selector' onClick={() => props.verify(props.idx)} disabled={props.verifing}>Quì</button>
    )
}