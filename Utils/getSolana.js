
require('dotenv').config();
const solanaWeb3 = require('@solana/web3.js');
const fs = require('fs');



const connection = new solanaWeb3.Connection(`${process.env.SOL_RPC_URL}`);

const getTx = async (address, fromTime, toTime, numTx) => {
    const pubKey = new solanaWeb3.PublicKey(address);
    let transactionList = await connection.getSignaturesForAddress(pubKey, { limit: numTx });

    // Prepare the output file
    const outputStream = fs.createWriteStream('Output/outputSOL.txt', { flags: 'w' });
    
    for (let i = 0; i < transactionList.length; i++) {
        const transaction = transactionList[i];
        const time = transaction.blockTime;
        let startTimestamp = Math.floor(fromTime.getTime() / 1000);
        let endTimestamp = Math.floor(toTime.getTime() / 1000);
        
        if (time > startTimestamp && time < endTimestamp) {
            try {
                const txDetails = await connection.getTransaction(transaction.signature);
                const meta = txDetails.meta;
                const status = meta.err ? 'Failure' : 'Success';
                let tokenSymbol='SOL' ;                      
                let listOfAddresses = txDetails.transaction.message.accountKeys;
                let AccountPre =txDetails.meta.preBalances;
                let AccountPost=txDetails.meta.postBalances;
               
                
                outputStream.write(`Transaction ID: ${transaction.signature}\n`);
                outputStream.write(`Addresses Involved: ${listOfAddresses.join(', ')}\n`);
                outputStream.write(`Status: ${status}\n`);
                outputStream.write(`Accounts Pre-Balance: ${AccountPre}\n`);
                outputStream.write(`Accounts Post-Balance: ${AccountPost}\n`);
                outputStream.write(`Token Symbol: ${tokenSymbol}\n`);
                outputStream.write(`Time: ${new Date(time * 1000)}\n`);
                outputStream.write('-'.repeat(20) + '\n');
            } catch (error) {
                console.error(`Error fetching transaction details for signature ${transaction.signature}:`, error);
            }
        }
    }

    // Close the output stream
    outputStream.end();
};

/*const searchAddress = '5JPAWfhLNsYVk3tPpD3gHvpHbvaXDbpUpy1wUfQVYRS2';
let from = new Date(2024, 5, 3, 18, 50, 0);
let to = new Date(2024, 5, 3, 18, 55, 0);
getTx(searchAddress, from, to, 1000);*/
module.exports={getTx};
