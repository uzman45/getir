module.exports = (myApp)=> {
  const data=require('./controllers/api.controller.js');

  //Default Route
    myApp.get('/',(req,res) => {
        res.json(
          {
                  'code':0,
                  'msg':'Welcome to Getir Assesment API'}
                  )
      });
  //define post route for getting data via filters
  myApp.post('/records',data.getByFilter);

}
