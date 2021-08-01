from blockchain import *
from save import *
import sys


block1 = loadBlock()
wallets = loadWallets()

newPublicName = sys.argv[1]

for i in range(0, len(wallets)):
    if wallets[i].ownerName == newPublicName:
        wallets.pop(i)
        break

save(block1, wallets)
