# Inventory Application

This project is an Inventory Management Application built using Node.js. It's designed to manage the inventory of an imaginary store, with the flexibility to adapt to any type of business, from groceries to car parts, baby toys, musical instruments, and more.

Here are the technical aspects of the project:

Node.js and Express.js: The application is built on Node.js, a JavaScript runtime, and Express.js, a web application framework for Node.js. Express.js is used to set up middleware to respond to HTTP requests and to define a routing table for performing different actions based on HTTP methods and URLs.

MongoDB and Mongoose: MongoDB, a NoSQL database, is used to store the inventory data. Mongoose, an Object Data Modeling (ODM) library, is used to manage relationships between data, provide schema validation, and translate between objects in code and the representation of those objects in MongoDB.

Models and Schemas: The application has two main models - Items and Categories. Each Item has a name, description, category, price, number in stock, and URL. Each Category has a name, description, and URL.

CRUD Operations: The application supports all CRUD (Create, Read, Update, Delete) operations for both Items and Categories. This allows users to manage the inventory effectively.

Express-Generator: The Express application generator is used to quickly create an application skeleton.

Pug Templating Engine: Pug, a template engine for Node.js, is used to generate the HTML of the application. It allows for a clean and easy way to design views and reuse components.

Middleware: Middleware functions are used to perform operations on the request and response objects. They are used for tasks like parsing request bodies, adding security headers, handling file uploads, and more.

Security: Destructive actions like deleting and updating are protected by requiring users to enter a secret admin password.

Deployment: The application is ready for deployment on a server or a cloud platform.

This project demonstrates a solid understanding of Node.js, Express.js, MongoDB, Mongoose, and the principles of web application development, including database modeling, server-side routing, and user interface design.

![image](https://github.com/Dallair220/inventory-application/assets/93786532/a1d5c61b-6688-4bed-8cdc-89629b9a7ff6)
Live Website: https://scented-oceanic-curve.glitch.me
