const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    post:465,
    secure:true,
    //service: 'gmail',
    auth: {
        user: 'project.moment.hungary@gmail.com',
        pass: ''
    }
});

transporter.sendMail({
    to:'',
    subject:'MOMENT',
    html:'<h1>asasdasd</h1>'
}).then(()=>{
    console.log('Email send ')
}).catch(err=>{
    console.log(err);
})