Instalace Reactu + jednoduchý příklad
- obecné jádro + implementace pro prohlížeče
> npm install react react-dom -save

do INDEX.JS přidáme import reactu

import React from 'react'; //je potřeba aby fungovala 'jsx' syntaxe
import ReactDOM from 'react-dom'; //vstupní bod pro renderování reactu

ReactDOM.render(<div>Ahoj</div>, document.getElementById("root"));

INDEX.HTML

<html>
  <head>
    <meta charset="UTF-8">
  </head>
  <body>
    <h4>Moje stránka</h4>
    <div id="root"></div>
        <script src="bundle.js"></script>
  </body>
</html>

a vyzkoušíme

> npm run devserver

pokud nefunguje - kontrola package.json a webpack.config.js


REACT

- něco jako šablonovací systém
- nejprve vyrenderuje HTML 
- následně se stará i o aktualizaci
- čistě výstupní knihovna

- s daty pracuje REDUX

STROM KOMPONENT

- cílem rozdělit prezentační vrstvu na logické celky


- vytvořit adresář components s 2 soubory:

Item.js
- ES6 třída poděděná od React.Component
- přetížená metoda render vrací objekty vytvořenépomocí JSX (konkrétně LI a BUTTON)
- property THIS.PROPS - obsahuje konfiguraci komponenty (viz dále)

    import React from 'react';

    //reprezentace jediné položky listu
    export default class Item extends React.Component {

    render() {
        return <li>{this.props.text} <button onClick={this.props.removeItem}>&#10006;</button></li>;
    }
    };


App.js
- hlavní komponenta systému

    import React from 'react';

    //Import vnořené komponenty
    import Item from './Item';

    export default class App extends React.Component {

    //uložíme data pro renderování do 'state', render se zavolá automaticky
    updateState() {
        this.setState({todos: this.props.store.getState()});
    }

    //okamžik v životním cyklu komponenty před prvním renderováním
    componentWillMount() {
        this.updateState() //úvodní načtení stavu
        this.props.store.subscribe(this.updateState.bind(this)); //aktualizace stavu
    }

    render() {
        //V props je uložena funkce na odebírání úkolů
        var removeItem = this.props.removeItem;

        //vytvoříme pro každou todo položku její DOM vyjádření
        var items = this.state.todos.map(function(todo, id) {
        return <Item key={id} text={todo} removeItem={function() { removeItem(id) }}/>
        });

        //vykreslíme komponenty
        return (<div>
                <ul>{items}</ul>
                </div>);
    }
    };



- metoda render - vykresluje list UL s položkami z pole (instance komponenty Item)

- removeItem={} na straně volání komponenty nastaví propertu 
- this.props.removeItem uvnitř komponenty propertu přečte.

- komponenty se píší s velkým písmenem <Item/> tagy HTML s malým <div>

-this.props obsahují konfiguraci zvenčí, this.state obsahuje stav komponenty, po každé jeho změně se komponenta přerenderuje.

- this.state se nastavuje takto: this.setState({todos: [] }); a čte takto: this.state.todos.

- Komponenta je navěšená na store pomocí funkce subscribe, kterou znáte z předchozího dílu seriálu.

- Atribut s názvem key obsahuje unikátní hodnotu a pomáhá reactu optimálně renderovat opakující se komponenty.

- Store se do komponenty dostal jako properta, stejně tak funkce removeItem.


Vložení komponentdo aplikace

úprava INDEX.JS
přidání do kódu z "REDUX"

import App from './components/App';

var removeItem = function(id) {
  store.dispatch({ type: 'REMOVE', id: id }); //odstraníme druhý úkol
}

ReactDOM.render(<App removeItem={removeItem} addItem={addItem} store={store}/>, document.getElementById("root"));


..toto již funguje

SHRNUTÍ
- na začátku je funkce na odstraňování položek listu (removeItem)
- předámeji jako propertě komponentě App a ta ji předá dál každé položce seznamu
- Store si předáváme proto, abychom z něj mohli číst data a také navěsit komponentu App na handler signalizující jejich změnu (subscribe)



Vytvoření formuláře

třetí komponenta form.js

- render s elementy INPUT a BUTTON
- vložíme komponentu do hlavní komponenty App (stejně jako Item) + také do render
- vytvoříme metodu addItem (obdobně jako removeItem)



Nyní se ale musíme podívat na princip, kterým čteme data z formulářů. Existují minimálně dva způsoby, jak data číst, my si ukážeme ten přímočařejší:

render() {
    var input;
    var addItem = this.props.addItem;

    return (<div>
              <input ref={function(ref) { input = ref }}/>
              <button onClick={function() {
                 addItem(input.value);
                 input.value = "";
                }}>Vložit</button>
            </div>);
  }
Tlačítko, které řídí odesílání dat, musí získat přístup k inputu, který data drží. Pomocí funkce v atributu ref získáme instanci tohoto inputu během renderování a uložíme si ji do stejnojmenné proměnné. Odesílací funkce se pak pomocí této proměnné dotáže na hodnotu a obsah inputu vymaže. Data předáme funkci addItem, která je propertou komponenty Form, ale to už víte.


Zdroj:
https://www.zdrojak.cz/clanky/redux-react-33-react/
