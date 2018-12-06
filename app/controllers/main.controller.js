module.exports = {
    //show home page
    showHome: (request,response)  => {

       var userName = request.parameters.name;

        response.send(`hello ${userName} - welcome to CryptoDashBoard`);
    }
};