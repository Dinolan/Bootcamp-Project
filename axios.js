


//Still in Development
const axios = require("axios");
const getBtn = document.getElementById('get_button');
const getData = () => {
    axios.get('https://localhost:5000/products')
        .then(response => {
            console.log(response);
        });
};

getBtn.addEventListener('click', getData);