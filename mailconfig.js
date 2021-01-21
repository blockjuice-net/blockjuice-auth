
/*
let config = {
  service: "smtp.gmail.com",
  auth: {
    user: "giuseppe.zileni@gmail.com",
    pass: "mar1annaval3r1a!Z44"
  }
};
*/

let config = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'giuseppe.zileni@gmail.com',
    pass: 'mar1annaval3r1a!Z44'
  }
}

/*
let config = {
  user: 'b849659ce7074c',
  password: 'cb166d36c5211d',
  host: 'smtp.mailtrap.io',
  ssl: false
}
*/

module.exports = config;