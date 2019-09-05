const SHA256 = require ('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor (timestamp, transactions, previousHash = ''){
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transations = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;
        //nonce is often a random or pseudo-random number issued in an authentication protocol to ensure that old communications cannot be reused in replay attacks.
    }

    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

        //create a new block every 10 minutes. Use the process Proof of Work or "Mining". It basically gives you computing power to create hash with enough intergers
        //to do this. Use while loop.
    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}
class Blockchain{
    constructor(){
        this.chain = [this.createAlphaBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }
//Difficulty adds zeros to blocks. Controls how fast new blocks can be added to blockchain. 
//Difficulty is instrumental to safety of blockchain.

    createAlphaBlock (){
        return new Block ("01/01/2018", "Alpha Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction (null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }
    
    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
                
            }
        }

        return balance;
    }
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}

let cooperCoin = new Blockchain();
cooperCoin.createTransaction(new Transaction('address1', 'address2', 100));
cooperCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\nStarting the miner...');
cooperCoin.minePendingTransactions('bryans-address');



