//Tutorial Javascript: https://www.youtube.com/watch?v=PekgJfLb6ak
//Tutorial Solidity: https://www.youtube.com/watch?v=67vkL8XkoJ0

// 1. Import libraries. Use `npm` package manager to install
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

// 2. Collect list of wallet addresses from competition, raffle, etc.
let whitelistAddresses = [
	'0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
	'0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
	'0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
	'0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB',
	'0x617F2E2fD72FD9D5503197092aC168c91465E7f2', // The sample address from remix
];

// 3. Create a new array of `leafNodes` by hashing all indexes of the `whitelistAddresses`
// using `keccak256`. Then creates a Merkle Tree object using keccak256 as the algorithm.
//
// The leaves, merkleTree, and rootHas are all PRE-DETERMINED prior to whitelist claim
const leafNodes = whitelistAddresses.map((addr) =>
	keccak256(Buffer.from(addr))
);
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

// 4. Get root hash of the `merkleeTree` in hexadecimal format (0x)
// Print out the Entire Merkle Tree.
const rootHash = merkleTree.getRoot();
console.log('Whitelist Merkle Tree\n', merkleTree.toString());
console.log(
	'Merkle Root:\n',
	'0x' + Buffer.from(rootHash, 'hex').toString('hex') // Put the merkle root hash to the smart contract
);

// ***** ***** ***** ***** ***** ***** ***** ***** //

// CLIENT-SIDE: Use `msg.sender` address to query and API that returns the merkle proof
// required to derive the root hash of the Merkle Tree

// ✅ Positive verification of address
const claimingAddress = leafNodes[1];
// ❌ Change this address to get a `false` verification
// const claimingAddress = keccak256("0X5B38DA6A701C568545DCFCB03FCB875F56BEDDD6");

// `getHexProof` returns the neighbour leaf and all parent nodes hashes that will
// be required to derive the Merkle Trees root hash.
const hexProof = merkleTree.getHexProof(claimingAddress);
console.log(JSON.stringify(hexProof));

// ✅ - ❌: Verify is claiming address is in the merkle tree or not.
// This would be implemented in your Solidity Smart Contract
console.log(merkleTree.verify(hexProof, claimingAddress, rootHash));
