from blockchain import *
from save import *
import sys


block1 = loadBlock()
wallets = loadWallets()

# With checker, we won't have any duplicate.
checker = walletChecker(wallets)

newPublicName = sys.argv[1]
newWallet = wallet(newPublicName, newPublicName)
newWallet.updateTransactions(block1)

checker.addWallet(newWallet)

save(block1, checker.wallets)

if len(wallets) < len(checker.wallets):
    print("Wallet creation is successful.")
