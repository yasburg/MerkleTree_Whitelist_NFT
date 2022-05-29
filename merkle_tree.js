//Tutorial Javascript: https://www.youtube.com/watch?v=PekgJfLb6ak
//Tutorial Solidity: https://www.youtube.com/watch?v=67vkL8XkoJ0

// 1. Import libraries. Use `npm` package manager to install
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

// 2. Collect list of wallet addresses from competition, raffle, etc.
let whitelistAddresses = [
	'0xAb3A4965C5A6e1b317659D90034f60aD3b29cBA7',
	'0x77CfcAd27e4A4b25eBD54808DC3692E4AcD9541D',
	'0x27AC1C615ee9102D7847BC611436945c8260D1BC',
	'0x909f741CfE1eBcc84a1DF973A4B2E01011f79792', // The sample address from remix
];

// 3. Create a new array of `leafNodes` by hashing all indexes of the `whitelistAddresses`
// using `keccak256`. Then creates a Merkle Tree object using keccak256 as the algorithm.
//
// The leaves, merkleTree, and rootHas are all PRE-DETERMINED prior to whitelist claim
const leafNodes = whitelistAddresses.map((addr) => keccak256(addr));
// console.log(leafNodes)
// console.log(
// 		Buffer.from(
// 			keccak256(
// 				Buffer.from(
// 					'0xE83af0De0111eB65ea0C67244333b851e781065f',
// 					'hex'
// 				).toString('hex')
// 			),
// 			'hex'
// 		).toString('hex')
// );
// To get the real keccak hash we should use this but this isn't working for merkle root.
// for the matching of different libraries we can use this and compare
//const leafNodes = whitelistAddresses.map((addr) =>
//	keccak256(Buffer.from(addr))
//);
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
// const claimingAddress = leafNodes[1];
// ❌ Change this address to get a `false` verification
// const claimingAddress = keccak256("0X5B38DA6A701C568545DCFCB03FCB875F56BEDDD6");

// `getHexProof` returns the neighbour leaf and all parent nodes hashes that will
// be required to derive the Merkle Trees root hash.
// const hexProof = merkleTree.getHexProof(claimingAddress);
// console.log(JSON.stringify(hexProof));
console.log('----------------For Dart-----------------');
// console.log(Buffer.from(leafNodes[0], 'hex').toString('hex'));
let proofs = [];
leafNodes.forEach((element) => {
	let hexProof =
		'[hex.decode("' +
		merkleTree
			.getHexProof(element)
			.map((hex) => hex.substring(2))
			.join('"), hex.decode("') +
		'")]';
	proofs.push(hexProof);
});
console.log(proofs);

console.log('-------------------Solidity/javascript-----------------------');
let proofs2 = [];
leafNodes.forEach((element) => {
	let hexProof = merkleTree.getHexProof(element);
	proofs2.push(JSON.stringify(hexProof));
});
console.log(proofs2);

// ✅ - ❌: Verify is claiming address is in the merkle tree or not.
// This would be implemented in your Solidity Smart Contract
// console.log(merkleTree.verify(hexProof, claimingAddress, rootHash));
