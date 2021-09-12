from blockchain import *
from blockStart import *
from pymongo import MongoClient


newDatabase = database()


def save(block, wallets):
    newDatabase.saveDatabase(block, wallets, "./public/")

    walletJSON = {"users": []}

    # user.ownerName can be changed to user.publicAddress
    for user in wallets:
        newUser = {
            "name": user.ownerName,
            "balance": block.getBalance(user.ownerName),
            "publicAddress": user.publicAddress,
            "privateAddress": user.privateAddress
        }
        walletJSON["users"].append(newUser)

    transactions = {
        "transactions": []
    }
    blocks = {
        "numberOfBlocks": len(block.blockchain),
        "blocks": []
    }
    blockCounter = 1

    for block in block.blockchain:
        newBlock = {
            "blockNumber": blockCounter,
            "previousHash": block.previousBlockHash,
            "blockHash": block.blockHash,
            "hashDifficulty": block.hashDifficulty,
            "blockTransactions": len(block.blockTransactions),
            "validationTime": block.validationTime
        }
        blocks["blocks"].append(newBlock)
        blockCounter += 1

        for blockTransaction in block.blockTransactions:
            newTransaction = {
                "source":  blockTransaction.source,
                "destination": blockTransaction.destination,
                "balance": blockTransaction.coins,
                "transactionHash": blockTransaction.transactionHash,
                "validationTime": blockTransaction.validationTime
            }
            transactions["transactions"].append(newTransaction)

    saveToDB(walletJSON.copy(), blocks.copy(), transactions.copy())


def saveToDB(wallets, blocks, transactions):
    cluster = MongoClient('mongodb://localhost/test')
    db = cluster["BlockchainWebServer"]

    collection1 = db["UsersCollection"]
    # We need to drop the collection since
    # there could be deletions for wallets.
    collection1.drop()
    for user in wallets["users"]:
        user.update({"_id": user["publicAddress"]})
        try:
            collection1.insert_one(user)
        except:
            collection1.delete_one({"_id": user["publicAddress"]})
            collection1.insert_one(user)
            continue

    collection2 = db["BlocksCollection"]
    for block in blocks["blocks"]:
        block.update({"_id": block["blockHash"]})
        try:
            collection2.insert_one(block)
        except:
            continue

    collection3 = db["transactionsCollection"]
    for transaction in transactions["transactions"]:
        transaction.update({"_id": transaction["transactionHash"]})
        try:
            collection3.insert_one(transaction)
        except:
            continue


def loadBlock():
    try:
        newDatabase.loadDatabase("./public/")
        return newDatabase.blockchain
    except:
        initialize()
        return loadBlock()


def loadWallets():
    try:
        newDatabase.loadDatabase("./public/")
        return newDatabase.wallets
    except:
        initialize()
        return loadWallets()
