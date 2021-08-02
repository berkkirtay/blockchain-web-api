from save import *
from blockchain import *

block1 = loadBlock()
wallets = loadWallets()

block1.forceTransaction(transaction(
    "null", "test", 100000000))
block1.handleTransaction("null")

for i in range(150):
    block1.addTransaction(transaction(
        "test", "test2", 100))

# We can change the rate here
block1.handleTransaction("test")

save(block1, wallets)
