export function Card(id, name, misfortune=null){
    this.id = id;
    this.name = name;
    this.misfortune = misfortune;
}

export function Match(id, win, date, cards){
    this.id = id;
    this.win = win;
    this.date = date;
    this.cards = cards;
}