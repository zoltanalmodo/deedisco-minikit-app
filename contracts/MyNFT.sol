// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyNFT
 * @dev Simple ERC721 NFT contract for minting on Base Sepolia
 * 
 * Deploy this contract to Base Sepolia testnet using Remix or Hardhat
 * Network Details:
 * - Chain ID: 84532
 * - RPC: https://sepolia.base.org
 * - Explorer: https://sepolia.basescan.org
 * 
 * Get testnet ETH from: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
 */
contract MyNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    event NFTMinted(address indexed to, uint256 indexed tokenId, string uri);

    constructor() ERC721("MiniKit NFT", "MNFT") Ownable(msg.sender) {}

    /**
     * @dev Mint NFT without metadata URI
     * @param to Address to mint NFT to
     */
    function safeMint(address to) public {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(to, tokenId);
        
        emit NFTMinted(to, tokenId, "");
    }

    /**
     * @dev Mint NFT with metadata URI
     * @param to Address to mint NFT to
     * @param uri Metadata URI for the NFT
     * @return tokenId The ID of the minted token
     */
    function mint(address to, string memory uri) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        emit NFTMinted(to, tokenId, uri);
        return tokenId;
    }

    /**
     * @dev Batch mint multiple NFTs with metadata
     * @param to Address to mint NFTs to
     * @param uris Array of metadata URIs
     */
    function batchMint(address to, string[] memory uris) public {
        for (uint256 i = 0; i < uris.length; i++) {
            mint(to, uris[i]);
        }
    }

    /**
     * @dev Get total number of minted tokens
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

    // The following functions are overrides required by Solidity.
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
