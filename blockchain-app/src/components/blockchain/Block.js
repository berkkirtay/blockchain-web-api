
const Block = ({ block }) => {
    return (
        <div id="block">
            <h4>Block Number: {block.blockNumber}, Validation Time: {block.validationTime}
            </h4>
            <h4>Previous Block Hash: {block.previousHash}
            </h4>
            <h4>Block Hash: {block.blockHash}
            </h4>
            <h4>Hashing Difficulty: {block.hashDifficulty}, Block Transactions: {block.blockTransactions}
            </h4>
        </div>
    )
}

export default Block
