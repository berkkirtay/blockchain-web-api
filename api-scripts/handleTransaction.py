from blockchain import *
from save import *
import sys

block1 = loadBlock()
wallets = loadWallets()

sourceAddress = sys.argv[1]
destAddress = sys.argv[2]
transactionAmount = int(sys.argv[3])

# We are assuming "admin" is the admin of this blockchain and
# can make transactions forcefully. This option is only for tests.

transactionFlag = True

if sourceAddress == "admin":
    block1.forceTransaction(transaction(
        "null", destAddress, transactionAmount))
else:
    transactionFlag = block1.addTransaction(transaction(
        sourceAddress, destAddress, transactionAmount))

# We can change the rate here
if transactionFlag == True:
    block1.handleTransaction("null")

save(block1, wallets)
