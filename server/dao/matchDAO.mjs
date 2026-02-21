import sqlite from 'sqlite3';
import dayjs from 'dayjs';

const db = new sqlite.Database('./database/db.sqlite', (err) => {
    if(err) throw err;
});

export const addMatch = (userID, cards) => {
    return new Promise(async (resolve, reject) => {
        const query1 = 'INSERT INTO Match (win, userID, date) VALUES (?, ?, ?);';
        const query2 = `INSERT INTO Card_Match (CardId, MatchID, possessed) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?);`;
        const query3 = `INSERT INTO Card_Match VALUES ${cards.map((c, id)=>{if(id>2) return '(?, ?, ?, ?)';}).filter(c => c).join(', ')};`;
        let matchId = undefined;

        db.run('BEGIN TRANSACTION;');
        db.run(query1, [cards.filter(a=>a.possessed==true).length===6, userID, dayjs.unix(cards[0].timestamp).format('YYYY/MM/DDTHH:mm:ss')], function(err){
            if(err){
                console.log('Errore 1');
                db.run('ROLLBACK;');
                reject(err);
            }else{
                matchId = this.lastID;
                const array = cards.filter((c, id) => id<3);
                db.run(query2, array.map(c => [c.id, matchId, c.possessed]).flat(), function(err){
                    if(err){
                        console.log('Errore 2');
                        db.run('ROLLBACK;');
                        reject(err);
                    }else{
                        const array = cards.filter((c, id) => id>2);
                        db.run(query3, array.map((c, idx) => [c.id, matchId, idx+1, c.possessed?true:false]).flat(), function(err){
                            if(err){
                                console.log('Errore 3');
                                db.run('ROLLBACK;');
                                reject(err);
                            }else{
                                db.run("COMMIT;");
                                resolve(true);
                            }
                        })
                    }
                });  
            }
        });

    });
}

export const getMatches = (userID) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT MatchID, CardID, userID, date, win, round, possessed, name FROM Match M, Card_Match CM, Card C WHERE M.id=CM.MatchID AND M.userID=? AND C.id=CM.CardID ORDER BY DATE DESC';
        db.all(query, [userID], (err, rows) => {
            if(err){
                reject(err);
            }
            else{
                const map = new Map();
                for(const row of rows){
                    if(!map.has(row.MatchID)) map.set(row.MatchID, []);
                    map.get(row.MatchID).push(row);
                }
                resolve(Array.from(map.values()));
            }
        })
    });
}