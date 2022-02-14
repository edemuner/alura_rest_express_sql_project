const customExpress = require('./config/customExpress');
const connection = require('./infrastructure/database/connection');


connection.sync()
.then(() => {
  console.log('Successfully connected to database')
  const app = customExpress()
  app.listen(3000, () => console.log('Server running at port 3000'))
  app.get('/', (req, res) => {
    res.send('oi')
  })
})
.catch(erro => console.log('n'))

// for now, just a testing index
// (async () => {
//     try{
//       connection.sync();
//       console.log('Connection has been established successfully.');
//   } catch (error) {
//       console.error('Unable to connect to the database:', error);
//   }
// })()

// connection.connect(error => {
//     if (error){
//         console.log(error)
//     } else {

//         console.log('Successfully connected to database')
        
//         tables.init(connection)

//         const app = customExpress()

//         app.listen(3000, () => console.log('Server running at por 3000'))
//     }
// })

