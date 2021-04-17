"use strict";

const { ServiceBroker } = require("moleculer");
const DbService         = require("moleculer-db");
const SqlAdapter        = require("moleculer-db-adapter-sequelize");

const Sequelize         = require("sequelize");

// Create a ServiceBroker
const broker = new ServiceBroker({
    transporter: "nats://localhost:4222"
});

// Create a Sequelize service for `post` entities
broker.createService({
    name: "posts", 
    mixins: [DbService],
    adapter: new SqlAdapter('daq', 'root', 'g25PLao4', { 
        host: 'localhost', 
        dialect: 'mysql',
    }),
    // settings: {
	// 	fields: ["_id", "channel", "value", "votes", "createdAt", "updatedAt"]
	// },


    model: {
        name: "uoutrd",
        define: {
            channel: Sequelize.INTEGER, 
            value: Sequelize.FLOAT,
        }, 
    },

    afterConnected() {
        this.logger.info("Successfully connected to the database.");
    },
})


broker.start()



.then(() => broker.call("posts.create",  {_id: 1, channel: 1, value: null,}))
.then(() => broker.call("posts.create",  {_id: 2, channel: 2, value: null,}))
.then(() => broker.call("posts.create",  {_id: 3, channel: 3, value: null,}))
.then(() => broker.call("posts.create",  {_id: 4, channel: 4, value: null,}))

// Create a new post
// .then(() => broker.call("posts.create", {

//     channel: 1,
//     value: 0,
     
// }))

// .then(() => broker.call("posts.insert", { entity: {
//     _id: 1,
//     channel: 4,
//     value: 4,    
// }}
 
// ))
 
// Create a new post
// .then(() => broker.call("posts.create", {
//     uoutrd_id: 1,
//     value: 5,    
// }))

// // Get all posts
// .then(() => broker.call("posts.find").then(console.log));