
require('dotenv').config();
const TronWeb = require('tronweb');
const fs=require('fs');

const tronWeb = new TronWeb({
    fullHost: process.env.TRON_HOST,
    headers: { 'TRON-PRO-API-KEY': process.env.TRON_API_KEY }
    
    
});

async function getBlockNumberByTimestamp(timestamp) {
    try {
        // Start from the latest block
        let block = await tronWeb.trx.getCurrentBlock();
        let blockNumber = block.block_header.raw_data.number;

        // Binary search for efficiency
        let start = 0;
        let end = blockNumber;
        let bestBlock = null;

        while (start <= end) {
            let mid = Math.floor((start + end) / 2);
            let currentBlock = await tronWeb.trx.getBlock(mid);
            let blockTimestamp = currentBlock.block_header.raw_data.timestamp;

            if (blockTimestamp === timestamp) {
                return mid; // Exact match
            } else if (blockTimestamp < timestamp) {
                bestBlock = currentBlock;
                start = mid + 1;
            } else {
                end = mid - 1;
            }
        }

        // Best block closest to the timestamp
        if (bestBlock) {
            return bestBlock.block_header.raw_data.number;
        } else {
            console.error("No block found for the given timestamp.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching block number: ", error.message);
        return null;
    }
}


async function getTransactions(address, fromTimestamp, toTimestamp) {
    try {
        let transactions = [];
        
        // Get the block numbers for the provided timestamps
        const initialBlockNumber = await getBlockNumberByTimestamp(fromTimestamp);
        console.log(initialBlockNumber);
        const finalBlockNumber = await getBlockNumberByTimestamp(toTimestamp);
        console.log(finalBlockNumber);

        // Iterate over the blocks
        for (let i = initialBlockNumber; i <= finalBlockNumber; i++) {
            const block = await tronWeb.trx.getBlock(i);
            
            if (block && block.transactions) {
                const filteredTransactions = block.transactions.filter(tx => {
                    //Add the line below if we only want trx token transfers or else comment it

                    //if (tx.raw_data.contract[0].type !== 'TransferContract') return false;
                    
                    const ownerAddress = tronWeb.address.fromHex(tx.raw_data.contract[0].parameter.value.owner_address);
                    return ownerAddress === address ;
                });
                transactions = transactions.concat(filteredTransactions);

            }
        }
        const outputStream = fs.createWriteStream('Output/outputTRX.txt', { flags: 'w' });
        for (const tx of transactions) {
            try {
                const status = tx.ret;
                const time = tx.raw_data.timestamp;
                const contractParams = tx.raw_data.contract[0].parameter.value;
                const fromAddress = tronWeb.address.fromHex(contractParams.owner_address);
                const toAddress = tronWeb.address.fromHex(contractParams.to_address);
                const amount = Number(contractParams.amount) / 1000000;
                const type = toAddress === address ? 'Deposit' : 'Withdrawal';

                
                outputStream.write(`From: ${fromAddress}\n`);
                outputStream.write(`To: ${toAddress}\n`);
                outputStream.write(`Amount (TRX): ${amount}\n`);
                outputStream.write(`Type: ${type}\n`);
                outputStream.write(`TxID: ${tx.txID}\n`);
                outputStream.write(`Time: ${time}\n`);
                outputStream.write('-'.repeat(20) + '\n');
            } catch (error) {
                console.error("Error writing transaction details to file:", error);
            }
        }
        

        outputStream.end();
    } catch (error) {
        console.error("Error fetching transactions: ", error);
        return [];
    }
}

module.exports={getTransactions};

   
