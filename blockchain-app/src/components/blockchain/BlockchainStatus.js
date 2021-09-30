import { useState, useEffect } from "react"
import axios from "axios"

//import { FaBeer } from 'react-icons/fa';

import Block from "./Block"

import apiUrl from "../../ServerInfo"

const BlockchainStatus = () => {
    const [blocks, setBlocks] = useState([])
    useEffect(() => getBlocks(), []);

    const getBlocks = () => {
        axios.get(apiUrl + '/blockchain')
            .then(response => {
                setBlocks(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const [selectedBlock, setSelectedBlock] = useState(blocks[0])
    const setBlock = (block) => {
        setSelectedBlock(block);
    }

    return (
        <div id="blockchainStatus">
            <h2>Blockchain Status</h2>
            <h4>Blocks : {blocks.length}
            </h4>
            <div id="blockchainStatus-child">
                <ul>
                    {blocks.slice(0).reverse().map((block) => (
                        <li key={block._id}>
                            <button onClick={() => setBlock(block)} id="transactionButton">See</button>
                            <h4>Block Number: {block.blockNumber}, Validation Time: {block.validationTime}
                            </h4>
                        </li>
                    ))}
                </ul>
            </div>
            <div id="blockchainStatus-child">
                {selectedBlock !== undefined &&
                    <Block block={selectedBlock} />
                }

            </div>
        </div>
    )
}

export default BlockchainStatus
