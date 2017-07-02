WEBPACK, BABEL, REDUX, REACT
============================

**inicializace projektu**

    > npm init

**WEBPACK**
-------

Webpack je utilita, která zabalí všechny potřebné zdrojové kódy do jediného ‘bundle’. Navíc umožní nakonfigurovat různé transformace a jiné operace s kódem.

    > npm install webpack -save

- vytvořit soubor **webpack.config.js**

>     module.exports = {
>         entry: "./src/index.js",  //náš vstupní bod aplikace
>         output: {
>             filename: "bundle.js"   //výstupní balík všech zdrojových kódů
>         },
>         module: { //sem budeme zanedlouho vkládat transformační moduly
>         } 
>     };

Také budeme potřebovat adresář **src** a v něm soubor **index.js**, který může obsahovat například 

    document.write(“Ahoj kamarádi”)

 To je zdrojový kód naší aplikace.


Ještě nám chybí reference v souboru **package.json**, aby bylo možno webpack jednoduše spouštět.

    "scripts": {
      ...
      "webpack": "webpack"
    },


SPUŠTĚNÍ WEBPACKu
-----------------

    > npm run webpack

vytvoří **bundle.js**, který lze nalinkovat do HTML stránky 

- **index.html**

>     <html>
>       <head>
>         <meta charset="UTF-8">
>       </head>
>       <body>
>         <h4>Moje stránka</h4>
>         <script src="bundle.js"></script>
>       </body>
>     </html>


Vývojový server
---------------

- do **package.json** (scripts) přidat: 
 

    

> "devserver": "webpack-dev-server --inline"


    > npm run devserver

*pokud nejde pustit: (nejprve `> npm install -g webpack-dev-server`)* viz: [stackoverflow](https://stackoverflow.com/questions/35810172/webpack-is-not-recognized-as-a-internal-or-external-command-operable-program-or)

http://localhost:8080  
- Celou stránku nyní dodává webpack devserver. Ve chvíli, kdy změníte JS kód, stránka se automaticky aktualizuje.


*’webpack –optimize-minimize’ vyrobí minifikovaný balíček, v package.json.* 
*Webpack devserver samozřejmě není určený na veřejnou produkci.*



**Babel – Cesta k ES6**
-------------------

Projekt Babel umožňuje využít nové funkce jazyka JavaScript tak, že je přeloží do staršího formátu vhodného pro současné prohlížeče. Zjednodušeně řečeno platí, že zatímco v pracovním adresáři máme JavaScript normy ES6 (a vyšších), prohlížeč dostává JavaScript podle normy ES5, který je dnes bezpečně podporovaný.

    > npm install -save

- upravit **webpack.config.js**

>     module: {
>           loaders: [
>               {
>                   test: /\/src\/.+\.js$/,    //Všechny soubory s koncovkou js...
>                   loader: 'babel-loader',  //prožeň babel-loaderem (integrace babelu a webpacku)
>                   query: {
>                       presets: ['react', 'es2015'], //vybrané babel presety: https://babeljs.io/docs/plugins/#presets
>                       plugins: ["transform-class-properties"] //vybrané pluginy https://babeljs.io/docs/plugins/#transform-plugins
>                   }
>               }
>         ]
>     }

    > npm run devserver

- pro otestování - úprava **index.js** na:

>     var x = ["Viléme"];
>     
>     var y = [ //Spread Array direktiva sečte dvě pole
>         ...x,
>         "Ahoj"
>     ];
>     
>     document.write(y[1] + " " + y[0]);

v **bundle.js** se kód transformuje do ES5

**ZDROJ:**
https://www.zdrojak.cz/clanky/redux-react-13-prostredi/

----------
----------

INSTALACE REDUX
---------------

    > npm install redux -save

Nainstalovanou knihovnu importovat do souboru **index.js** pomocí ES6 Modules Import direktivy

    import { createStore } from 'redux';     
      //webpack sáhne pro redux do nainstalovaných npm balíčků a zpřístupní z něj funkci 'createStore'

Stav aplikace
-------------

Stav aplikace (state) je úvodní podoba stránky společně se všemi změnami do okamžiku, kdy tento stav posuzujeme. Zahrnuje DOM elementy a jejich obsah, pořadí, atributy, ale i javascriptové proměnné apod.

Redux pracuje podle konceptu ‘jediného zdroje pravdy’ a tímto zdrojem je úložiště store. **Store** obsahuje všechna data a ostatní komponenty na tato data nahlíží a reagují. Když se data změní, komponenty se přerenderují. Žádná komponeta nezjišťuje stav jiné komponenty, vždy se dívá pouze do store. Data vyjadřují aktuální stav aplikace a stejná data musí vždy aplikaci uvést do stejného stavu. Tomuto principu se řiká ‘předvídatelný stav’ (predictable state).

Z takového přístupu plyne mnoho výhod. Například ladění je velmi snadné, protože všechny změny prochází jediným místem, do kterého můžeme nahlédnout. Navíc můžeme implemenovat funkci undo – vracení akcí zpět, nebo celou aplikaci uložit (serializovat) jako v nějaké počítačové hře.


API Reduxu
----------

Při práci s reduxem potkáme tři základní konstrukce: **store**, **akci** a **reducer**.


STORE
=====

Objekt ve kterém jsou uloženy data aplikace (jeden na aplikaci)

    var store = Redux.createStore(reducer);

**store** obsahuje 3 základní metody

> **store.getState()** // vrací naše data (state)
> 
> **store.subscribe(callback)** // pokud chceme zjistit že se data změnila
> 
> **store.dispatch(akce)** // provádíme akci, která změní data ve Store uložená 


AKCE
====

Pokud chceme měnit data ve STORE 
akce má povinný atribut - **type**

Příklad akcí:

    {
        type: "ADD_ITEM",
        text: "Nějaký úkol"
    }

    {
        type: "REMOVE_ITEM",
        id: 15
    }

Akce se volají pomocí **DISPATCH**

např.

    store.dispatch({ type: 'ADD_ITEM', text: "Koupit mléko" });

REDUCER
=======

Funkce ve store, která podle akcí mění data ve store

Příklad

    todo(state, action) {
       //zde bude kód, který nahlédne do akce a podle toho co v ní najde, vytvoří nový 'state'
       return newState;
    }

**Reducer** tedy čeká uvnitř store až zavoláme **dispatch(akce)** a jakmile se tak stane, store zavolá reducer a předá mu:

 - **state** – současná data aplikace
 - **action** – celý objekt akce tak, jak jsme jej vložili do volání dispatch() (akce obsahuje identifikaci ‘type’ a jakákoliv další data potřebná k provedení)

Uvnitř **reduceru** je kód, který podle identifikace akce provede požadovanou změnu dat a vrátí jejich novou podobu (**nový state**).

Příklad

    if (action.type === "add") { //většinou se používá stará dobrá switch ... case konstrukce
        return [...state, action.text] //toto je ES6 Rest-spread direktiva, která zde tvoří nové pole ze starého a jedné nové položky
    } else if (... //zde bude zpracování dalších akcí
    } else return state; //pokud nebyla žádná akce provedena tak vracíme původní nezměněná data

Můžeme to chápat tak, že nový stav vznikne z interakce původního stavu s objektem akce.

Poslední větev (else) je zde pro případ, že store obsahuje více reducerů. Každou akci totiž přijmou všechny reducery a reagují na ni (mění data) jen pokud je pro ně určena. V opačném připadě reducery vrací state nezměněn.

*Máme zde jedno důležité pravidlo: Pokud reducer provede změnu dat, musí tato změna být takzvaně ’immutable‚. Store tak pozná, že byla data změněna, aby mohl informovat vaši prezentační vrstvu (existují i další důvody). V praxi to znamená, že nikdy nezapisujeme do pole nebo objektu přímo. Nejprve strukturu naklonujeme, a pak tuto kopii modifikujeme (vždy v tomto pořadí).*


**Návrh naší aplikace**
V konkrétním příkladě může být aplikace navržena například takto: Stavíme aplikaci, která má nakládat s úkoly (todos), vytvoříme si tedy reducer, který bude tyto úkoly spravovat, a do něj přidáme podporu pro všechny akce, které je možno s úkoly provádět (přidat nový, smazat, seřadit, smazat vše…). V reduceru také nadefinujeme úvodní stav (initial state), tím může být například prázdné pole, nebo, jako v našem případě, pole s nějakými úvodními položkami.

Pokud by naše aplikace spravovala i jiné agendy, jako je kalendář nebo filtr apod., vytvoříme pro ně vlastní reducery.

Kód aplikace
------------

    var initialState = ["První úkol", "Druhý úkol"]; //tohle je úvodní stav reduceru, dáme do něj dva úkoly

    function todo(state = initialState, action) { //toto je reducer

      switch (action.type) {
        case 'ADD':  //zpracování první akce
          return [...state, action.text]

        case 'REMOVE':  //zpracování druhé akce
          var newState = [...state]
          newState.splice(action.id, 1);
          return newState;

        default:
          return state
      }
    }

    var store = createStore(todo); //zde vytváříme store

    // Naše opravdu jednoduchá zobrazovací komponenta vypisuje do konzole a do stránky
    store.subscribe(function() {
      var state = store.getState();
      console.log("Nový stav:", state);
      document.body.innerHTML = "Aktuální stav:<br/>- " + state.join("<br/>- ")
    })

    //a několik akcí na zkoušku
    store.dispatch({ type: 'ADD', text: "Třetí úkol" }); //vložíme dva úkoly
    store.dispatch({ type: 'ADD', text: "Čtvrtý úkol" });
    store.dispatch({ type: 'REMOVE', id: 1 }); //odstraníme druhý úkol

V praxi je běžné rozdělit kód do více souborů. Podívejte se, jak jsou organizovány oficiální ukázky Reduxu - https://github.com/reactjs/redux/tree/master/examples Můžete si zkusit rozdělit kód na více souborů a svázat je pomocí ES6 Modules Import direktiv. Například reducer by byl šťastnější v samostatném souboru.

Jestli se vám takové programování líbí, zkuste si ještě dopsat akce pro seřazení (SORT) a smazání všech položek (REMOVE_ALL). A pokud jste na sebe přísní, můžete zkusit vytvořit druhý reducer, který bude položky filtrovat. Store z více reducerů se vyrábí takto:

    import { createStore, combineReducers } from 'redux';
    var store = Redux.createStore(combineReducers({todo: todo, filter: filter}));

ZDROJ:
https://www.zdrojak.cz/clanky/redux-react-23-redux/


