// const {app, mongoose} = require("./app/index.js");



//Create schema for Customer collection
//Customer
// const customerSchema = mongoose.Schema({
//     name: {
//         type: String,
//         require: true
//     },
//     email: {
//         type: String,
//         require: true
//     },
//     phone: Number
// });

// const Customer = mongoose.model("Customer", customerSchema);

// //Trips
// const tripSchema = mongoose.Schema({
//     departure: String,
//     arrival: String,
//     startime: Date,
//     status: String,
// })

// const Trip = mongoose.model("Trip", tripSchema)

// //=======Routing==========
// //=======Customer=========
// app.route("/")
// .get(function (req, res) {
//     res.redirect(__dirname + "/public/index.html");
// })

// app.route("/customers/:id")
// .get(function (req, res) {
//     Customer.findById({_id: req.params.id})
//     .then(result => {
//         res.send(result);
//     })
//     .catch(err => {
//         console.log(err);
//     })
// })
// .put(function (req, res) {
//     Customer.findByIdAndUpdate({_id: req.params.id}, {
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone
//     }).then(result => {
//         res.send({
//             message: "Thành Công"
//         })
//     }).catch(err => {
//         console.log(err);
//     })
// })
// .delete(function (req, res) {
//     Customer.deleteOne({_id: req.body.id})
//     .then(() => {
//         res.send({message: "Thành Công"});
//     }).catch(err => {
//         console.log(err);
//     })
// })

// //=======Trips=========

// app.route("/trips")
// .get(function (req, res) {
//     Trip.find().then(result => {
//         res.send(result);
//     }).catch(err => {
//         console.log(err);
//     });
// })
// .post(function (req, res) {
//     const trip = new Trip({
//         departure: req.body.departure,
//         arrival: req.body.arrival,
//         startime: req.body.startime,
//         status: req.body.status
//     }).then(() => {
//         res.send({
//             message: "Thành Công"
//         })
//     }).catch(err => {
//         console.log(err);
//     });
// });
