const express=require('express');
const session=require('express-session');
const app=express();
const fs=require('fs');
var url = require('url');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('donnee.json')
const db = low(adapter)
const adapter2 = new FileSync('login.json')
const db2 = low(adapter2)
const bodyParser=require('body-parser');
app.use(express.static('style'))
app.use(express.static('views'))
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}))

app.get('/',(req,res)=>{
fs.readFile('donnee.json',(err,data)=>{
        res.render('index.ejs',{data:JSON.parse(data)})
    })
});

app.post('/addE',(req,res)=>{
    db.get('entreprise')
   .push({ nom:req.body.nom, local:req.body.local,description:req.body.description,departement:[] })
  .write()
  res.redirect("/");
 });
 app.post('/addD',(req,res)=>{
    let departement = db
    .get('entreprise')
    .find({ nom:req.body.select })
    .get('departement')
    .value();
departement.push({nomDepartement:req.body.nomD,chef:req.body.chef,descriptionD:req.body.descriptionD,salarie:[]});
db.get('entreprise')
    .find({ nom:req.body.select  })
    .assign({ departement })
    .write();
    res.redirect("/");
    db2.get('departement')
    .push({nomDepartement:req.body.nomD,chef:req.body.chef,descriptionD:req.body.descriptionD,salarie:[]})
    .write();
 });

app.post('/afficheD',(req,res)=>{
   
    let departement = db
    .get('entreprise')
    .find({ nom:req.query.nom})
    .get('departement')
    .value();

   
  res.render('afficheD.ejs',{data:departement})
})
//******************************************* */
app.post('/departement',(req,res)=>{
//     let entreprise=db2.get('departement').value();
// let departement=db2.get('departement')
// .find({nomDepartement:req.body.check2})
// .value()
// console.log(departement);
let entreprise=db.get('entreprise')
.flatMap('departement')
.value();
let departement=db.get('entreprise')
.flatMap('departement')
.find({nomDepartement:req.query.nomD})
.value()

  res.render('departement.ejs',{dataD2:entreprise,data:departement})
})
//****************************************** */

app.post('/addSalarie',(req,res)=>{
    let departement = db
    .get('entreprise')
    .flatMap('departement')
    .find({nomDepartement:req.body.select})
    .get('salarie')
    .value()
    departement.push({matricule:req.body.matricule,nom:req.body.nom,prenom:req.body.prenom,age:req.body.age,salaire:req.body.salaire})
db.get('departement')
    .find({ nomDepartement:req.body.select  })
    .assign({ departement })
    .write();

//    let salarie= db2.get('departement')
//     .find({nomDepartement:req.body.select})
//     .get('salarie')
//     .value()
//     salarie.push({matricule:req.body.matricule,nom:req.body.nom,prenom:req.body.prenom,age:req.body.age,salaire:req.body.salaire})
//     db2.get('departement')
//     .find({ nom:req.body.select  })
//     .assign({ salarie })
//     .write();
//     db2.get('salarie')
//     .push({matricule:req.body.matricule,nom:req.body.nom,prenom:req.body.prenom,age:req.body.age,salaire:req.body.salaire})
//     .write()
//     res.redirect('/')
 });
 //************************************** */
app.post('/afficheS',(req,res)=>{
    let salairie = db
    .get('entreprise')
    .flatMap('departement')
    .find({nomDepartement:req.query.nomD})
    .get('salarie')
    .value()
    // let salairie = db2
    // .get('departement')
    // .find({nomDepartement:req.body.check3})
    // .get('salarie')
    // .value()
    res.render('afficheS.ejs',{dataS:salairie})
})
//*********************************** */
app.get('/rechercheS',(req,res)=>{
   

   res.render('rechercheS.ejs')
    
})
app.post('/recherche',(req,res)=>{
//    let salarie=db2.get('salarie')
//    .find({nom:req.body.recherche})
//    .value();
let salarie=db.get('entreprise')
.flatMap('departement')
.flatMap('salarie')
.filter({nom:req.body.recherche})
.value()
   console.log(salarie)

  res.render('rechercheS.ejs',{salarie:salarie})
})

app.listen(4000,()=>{
    console.log('server run');
    })