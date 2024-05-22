const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const StudentModel = require('./models/Student.model');
const BootcampModel = require('./models/Bootcamp.model')

const app = express();

//connect mongoose
mongoose
  .connect('mongodb://127.0.0.1:27017/students-app')
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch((err) => console.log("Error connecting to mongo", err));


//middleware
app.use(logger('dev'));
app.use(express.static('public'));
app.use(express.json());

//routes
app.get('/', (req, res) => {
  res.json({message: "Hello World!"});
});

//read students
app.get('/students', (req, res) => {
  StudentModel.find()
    .populate("bootcamp")
    .then((students) => {
      res.json(students);
    })
    .catch((err) => {
      console.log('Error getting students:', err);
      res.status(500).json({ error: 'Failed to get students'});
    });
})

app.get('/students/:id', (req, res) => {
  const { id } = req.params;

  StudentModel.findById(id)
    .populate("bootcamp")
    .then((student) => {
      if(!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      res.json(student);
    })
    .catch((err) => {
      console.error("Error getting student:", err);
      res.status(500).json({ error: "Failed getting student" })
    })
})

//update Student
app.put('/students/:id', (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;

  StudentModel.findByIdAndUpdate(id, { name, age }, { new: true })
    .then((student) => {
      res.json(student);
    })
    .catch((err) => {
      console.log('Error updating student:', err);
      res.status(500).json({ error: "Failed to update student" })
    });
});

//posting students
app.post('/students', (req, res) => {
  const { name, age, bootcamp } = req.body;

  StudentModel.create({
    name,
    age,
    bootcamp
  })
    .then((student) => {
      console.log('Student created:', student);
      res.status(201).json(student);
    })
    .catch((err) => {
      console.log('Error creating student:', err);
      res.status(500).json({err: 'Failed to create student'});
    })
})


//delete students
app.delete("/students/:id", (req, res) => {
  const { id } = req.params;

  StudentModel.findByIdAndDelete(id)
    .then((student) => {
      res.json(student);
    })
    .catch((err) => {
      console.error("Error deleting student:", err);
      res.status(500).json({ error: "Failed to delete student" })
    });
});

// Read all bootcamps
app.get("/bootcamps", (req, res) => {
  BootcampModel.find()
    .then((bootcamps) => {
      res.json(bootcamps);
    })
    .catch((err) => {
      console.error("Error getting bootcamps:", err);
      res.status(500).json({ error: "Failed to get bootcamps" });
    });
});

// Create a new bootcamp
app.post("/bootcamps", (req, res) => {
  const { name } = req.body;

  // check if bootcamp already exists, by name
  BootcampModel.findOne({ name: name.toLowerCase() })
    .then((bootcamp) => {
      if (bootcamp) {
        return res.status(400).json({ error: "Bootcamp already exists" });
      }

      // create bootcamp
      BootcampModel.create({
        name: name.toLowerCase(),
      })
        .then((bootcamp) => {
          console.log("Bootcamp created:", bootcamp);
          res.status(201).json(bootcamp);
        })
        .catch((err) => {
          console.error("Error creating bootcamp:", err);
          res.status(500).json({ error: "Failed to create bootcamp" });
        });
    })
    .catch((err) => {
      console.error("Error creating bootcamp:", err);
      res.status(500).json({ error: "Failed to create bootcamp" });
    });
});


app.listen(3000, () => console.log('App listening on port 3000!'))