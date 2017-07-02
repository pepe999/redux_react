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



