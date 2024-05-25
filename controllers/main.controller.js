


const mainController = {
    async mainPage(req,res){
        const title = "Beranda | SIBER CSMS";
        res.render('index',{
            title
        });
    },

    async loginPage(req,res){
        const title = "Login | SIBER CSMS";
        res.render('login',{
            title
        });
    },

    async formMitraPage (req,res){
        const title = "Form Pengisian Mitra | SIBER CSMS";

        res.render('form_mitra',{
            title
        });
    }

};


export default mainController;