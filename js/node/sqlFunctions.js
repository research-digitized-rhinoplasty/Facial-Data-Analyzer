var mysql = require('mysql')

// server connection details
const con = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "password",
    database: "rhinodb"
}) // end con

module.exports = {  
  getStats: function getStats(sql, flag) {
    // for returning single value db results from sql statements and/or called procedures
    return new Promise((resolve, reject) => {
      con.query(sql, (err, result) => {
        if (err) reject(err)
        if(flag==0) {
          resolve(result[0].result)
        } else if(flag==1) {
          resolve(result[0][0].result)
        } // end flag if else
      }) // end query
    }) // end promise
  }, // end getStats
  
  getRows: function getRows(sql) {
    // for returning all db result rows
    return new Promise((resolve, reject) => {
      con.query(sql, (err, result) => {
        if(err) reject(err)
        resolve(JSON.parse(JSON.stringify(result)))
      }) // end query
    }) // end promise
  } // end getRows
} // end export