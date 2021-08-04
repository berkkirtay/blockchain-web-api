from blockchainChat import *
from save import *
import sys

db = database()


sourceAddress = sys.argv[1]
textToBeSent = str(sys.argv[2])

block2 = loadBlock()
wallets = loadWallets()

block2.addText(textTransactions(
    sourceAddress, "TOALL", textToBeSent))

block2.handleTransaction("null")
# We can change the rate here
save(block2, wallets)
#newDatabase.saveDatabase(block2, wallets, "./chat-")
