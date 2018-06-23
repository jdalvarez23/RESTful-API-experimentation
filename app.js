const express = require('express');
const Joi = require('joi');

const app = express();

app.use(express.json()); // Method that returns middleware

const port = process.env.PORT || 8080;

const courses = [
  {id: 1, name: "course1"},
  {id: 2, name: "course2"},
  {id: 3, name: "course3"}
];


app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Retrieve list of courses
app.get('/api/v1/courses', (req, res) => {
  res.send(courses);
});

// Retrieve information of course with id
app.get('/api/v1/courses/:id', (req, res) => {
  // Read query parameters (req.query.id)
  // Read request parameters  (req.params.id)

  const course = courses.find(c => c.id === parseInt(req.params.id)); // Method that finds a course matching given criteria

  if (!course)  {
    // If course is not found, send 404 error with message
    res.status(404).send("The course with the given ID was not found.");
    return;
  } else {
    // If course is found, send course data
    res.send(course);
  }
});

// Post new course to course list
app.post('/api/v1/courses', (req, res) => {
  // Validate
  const { error } = validateCourse(req.body); // Object destructuring error instead or error.result
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // if (!req.body.name || req.body.name.length < 3) {
  //   // 400 Bad Request
  //   res.status(400).send("Name is required and should be minimum 3 characters");
  //   return; // Avoid the rest of this function being executed
  // }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

// Update course
app.put('/api/v1/courses/:id', (req, res) => {
  // Look up the course
  // If not existing, return 404

  const course = courses.find(c => c.id === parseInt(req.params.id)); // Method that finds a course matching given criteria

  if (!course)  {
    // If course is not found, send 404 error with message
    res.status(404).send("The course with the given ID was not found.");
    return;
  }

  // Validate
  // If invalid, return 400 - Bad Request
  const { error } = validateCourse(req.body); // Object destructuring error instead or error.result

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // Update course
  course.name = req.body.name;

  // Return the updated course
  res.send(course);
});

// Delete course from course list
app.delete('/api/v1/courses/:id', (req, res) => {
  // Look up the course, if not existing return 404
  const course = courses.find(c => c.id === parseInt(req.params.id)); // Method that finds a course matching given criteria

  if (!course)  {
    // If course is not found, send 404 error with message
    res.status(404).send("The course with the given ID was not found.");
    return;
  }

  // Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  // Return the response
  res.send(course);
});

function validateCourse(course) {
  // Define schema
  const schema = {
    name: Joi.string().min(3).required()
  };

  return Joi.validate(course, schema);
}


app.listen(port, () => console.log(`Listening on port ${port}...`));
