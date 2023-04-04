const express = require("express");
const path = require("path");
const port = 3000;

const db = require("./config/mongoose");
const Contact = require("./models/contact");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded());
app.use(express.static("assets"));

var contactList = [
  {
    name: "Arpan",
    phone: "1111111111",
  },
  {
    name: "Tony Stark",
    phone: "1234567890",
  },
  {
    name: "Coding Ninjas",
    phone: "12131321321",
  },
];

app.get("/practice", function (req, res) {
  return res.render("practice", {
    title: "Let us play with ejs",
  });
});

app.get("/", function (req, res) {

  // Contact.find({}, function(err, contacts){
  //   if(err){
  //     console.log("Error in fetching contact from db");
  //     return;
  //   }
  //   return res.render("home", {
  //     title: "Contact List",
  //     contact_list: contacts,
  //   });
  // });

  Contact.find({})
  .exec()
  .then((contacts) => {
    res.render("home", {
      title: "Contact List",
      contact_list: contacts,
    });
  })
  .catch((err) => {
    console.log("Error in fetching contacts from db", err);
    res.status(500).send("Internal Server Error");
  });

});

app.post("/create-contact", function (req, res) {
  Contact.create({
    name: req.body.name,
    phone: req.body.phone,
  })
    .then((newContact) => {
      console.log("Contact created successfully:", newContact);
      return res.redirect("back");
    })
    .catch((err) => {
      console.log("Error in creating a contact!", err);
      return;
    });
});

app.listen(port, function (err) {
  if (err) {
    console.log("Error in running the server", err);
  }
  console.log("Yup!My Server is running on Port", port);
});

app.get("/delete-contact/", function (req, res) {
  // let contactindex = contactList.findIndex((contact) => contact.phone == phone);

  // if (contactindex != -1) {
  //   contactList.splice(contactindex, 1);
  // }

  // return res.redirect("back");
  let id  = req.query.id;
  console.log("Contact deleted successfully");  
   
  Contact.findByIdAndDelete(id)
  .then(() => {
    return res.redirect('back');
  })
  .catch((err) => {
    console.log('Error while deleting the contact:', err);
    return res.status(500).send('Internal Server Error');
  });

});
