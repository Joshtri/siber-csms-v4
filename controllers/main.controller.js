


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


        const messageSuccesHse = await req.flash('successUpHse');
        const messageSuccesPsb = await req.flash('successUpPsb');
        const messageSuccesPb = await req.flash('successUpPb');
        const messageSuccesPa = await req.flash('successUpPa');

        res.render('form_mitra',{
            title,
            messageSuccesHse,
            messageSuccesPsb,
            messageSuccesPb,
            messageSuccesPa

        });
    }

};


export default mainController;