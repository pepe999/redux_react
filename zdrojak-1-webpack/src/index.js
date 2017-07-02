var x = ["Jarmilo"];

var y = [ //Spread Array direktiva sečte dvě pole
    ...x,
    "Ahoj"
];

document.write(y[1] + " " + y[0]);