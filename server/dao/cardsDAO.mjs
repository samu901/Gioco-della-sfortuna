import sqlite from 'sqlite3';
import { Card } from '../models/Models.mjs';

const db = new sqlite.Database('./database/db.sqlite', (err) => {
    if(err) throw err;
});

export const getRandomCard = (exclude, misfortune=false) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Card WHERE id NOT IN (${exclude.map(e => '?').join(', ')}) ORDER BY RANDOM() LIMIT 1`;
        db.get(query, exclude, (err, row) => {
            if(err) reject(err);
            else if(row === undefined) resolve(false);
            else{
                if(!misfortune) resolve(new Card(row.id, row.name, NaN));
                else resolve(new Card(row.id, row.name, row.misfortune));
            }
        });
    });
}

export const getCardById = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Card WHERE id = ?';
        db.get(query, [id], (err, row) => {
            if(err) reject(err);
            else if(row === undefined) resolve(false);
            else resolve(new Card(row.id, row.name, row.misfortune));
        })
    });
}