const getSolana=require('./Utils/getSolana');
const getTron=require('./Utils/getTron');




//UNCOMMENT ANY OF THE FOLLOWING TO USE(OTHER TOKEN TO BE PUT UNDER COMMENTS IF NOT BEING USED)

//for SOLANA

//let SOLaddress='5JPAWfhLNsYVk3tPpD3gHvpHbvaXDbpUpy1wUfQVYRS2';
//let SOLfromTime= new Date(2024, 5, 3, 18, 50, 0)
//let SOLtoTime= new Date(2024, 5, 3, 18, 55, 0)
//let SOLlimit=1000;
//getSolana.getTx(SOLaddress,SOLfromTime,SOLtoTime,SOLlimit);


//for TRON

let TRXaddress='TQooBX9o8iSSprLWW96YShBogx7Uwisuim';
let TRXfromTime= new Date(2024, 5, 3, 21, 55, 0).getTime();
let TRXtoTime= new Date(2024, 5, 3, 21, 57, 0).getTime();
getTron.getTransactions(TRXaddress,TRXfromTime,TRXtoTime);
