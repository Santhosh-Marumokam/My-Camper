const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')


const mongoose = require('mongoose');
const cities = require('./cities');
const {places ,descriptors} = require('./seedHelpers')

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
}

const Campground = require('../models/campground');

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () =>{
    await Campground.deleteMany({})

    for(let i=0;i<50;i++)
    {
        const rand1000 = Math.floor(Math.random()*1000);
        const c = new Campground({
            author: '65f1b506b5ceea7784b530de',
            location:`${cities[rand1000].city} ${cities[rand1000].state}`,
            title : `${sample(descriptors)} ${sample(places)} `,
            images : [ {
                url: 'https://res.cloudinary.com/dlfqqyin7/image/upload/v1710422331/YelpCamp/nf5qdl5topqeevxpaeuc.jpg',
                filename: 'YelpCamp/nf5qdl5topqeevxpaeuc'
              },
              {
                url: 'https://res.cloudinary.com/dlfqqyin7/image/upload/v1710422331/YelpCamp/xxnuzjqknakxlsna03uz.jpg',
                filename: 'YelpCamp/xxnuzjqknakxlsna03uz' 
              },
              {
                url: 'https://res.cloudinary.com/dlfqqyin7/image/upload/v1710422331/YelpCamp/eovezt4ewzsmdfrftam1.jpg',
                filename: 'YelpCamp/eovezt4ewzsmdfrftam1'
              },
              {
                url: 'https://res.cloudinary.com/dlfqqyin7/image/upload/v1710422333/YelpCamp/l6eoxd6w6tund7cjtd5n.jpg',
                filename: 'YelpCamp/l6eoxd6w6tund7cjtd5n'
              }],
            description : '10 Hours of React just added. Become a Developer With ONE course - HTML, CSS, JavaScript, React, Node, MongoDB and More!',
            price : Math.floor(Math.random() * 20)
        })
        await c.save();
    }
    
}

seedDB().then( () => {
    mongoose.connection.close();
});
