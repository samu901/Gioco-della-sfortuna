import sqlite from 'sqlite3'
import crypto from 'crypto';

const db = new sqlite.Database('./database/db.sqlite', (err) => {
    if(err) throw err;
});


export const getUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM User WHERE username = ?;';
        db.get(query, [username], (err, row) => {
            if(err) reject(err);
            else if(row === undefined) resolve(false);
            else{
                const user = {id: row.id, username: row.username};
                crypto.scrypt(password, row.salt, 32, function(err, hashedPassword){
                    if(err) reject(err);
                    if(!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword)) resolve(false);
                    else resolve(user);
                });
            }
        });
    });
}