"use strict";

const { ServiceBroker } = require("moleculer");
const DbService         = require("moleculer-db");
const SqlAdapter        = require("moleculer-db-adapter-sequelize");
const Sequelize         = require("sequelize");

// Create a ServiceBroker
const broker = new ServiceBroker({
    // transporter: "nats://localhost:4222"
});

// Create a Sequelize service for `post` entities
broker.createService({
    name: "posts",
    mixins: [DbService],

    adapter: new SqlAdapter('user', 'root', 'g25PLao4', { 
        host: 'localhost', 
        dialect: 'mysql',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timezone: '-03:00',    
    }),

    model: {

        define: {
            title: Sequelize.STRING,
            content: Sequelize.TEXT,
            votes: Sequelize.INTEGER,
            author: Sequelize.INTEGER,
            status: Sequelize.BOOLEAN
        },
    },
});    


broker.start()
// Create a new post
// .then(() => broker.call("posts.create", {
//     title: "My first post",
//     content: "Lorem ipsum...",
//     votes: 0
// }))

// Get all posts
// .then(() => broker.call("posts.find").then(console.log));