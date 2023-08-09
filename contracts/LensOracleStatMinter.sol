// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./PhatRollupAnchor.sol";
import { ITokenERC721 } from "./interfaces/ITokenERC721.sol";

contract LensOracleStatMinter is PhatRollupAnchor, Ownable {
    // The Token Contract for NFT Mints. Ensure the Contract ID is set as Minter in NFT Contract.
    ITokenERC721 public lensNft;
    event ResponseReceived(uint reqId, string pair, uint256 value);
    event MintSucceeded(uint256 nftId);
    event ErrorReceived(uint reqId, string pair, uint256 errno);
    event ErrorMintFail(string err);

    uint constant TYPE_RESPONSE = 0;
    uint constant TYPE_ERROR = 2;

    mapping(uint => string) requests;
    uint nextRequest = 1;

    constructor(address phatAttestor, ITokenERC721 _lensNftAddress) {
        _grantRole(PhatRollupAnchor.ATTESTOR_ROLE, phatAttestor);
        lensNft = _lensNftAddress;
    }

    function setAttestor(address phatAttestor) public {
        _grantRole(PhatRollupAnchor.ATTESTOR_ROLE, phatAttestor);
    }

    function setNftAddress(ITokenERC721 _lensNft) public onlyOwner {
        lensNft = _lensNft;
    }

    function request(string calldata profileId) public {
        // assemble the request
        uint id = nextRequest;
        requests[id] = profileId;
        _pushMessage(abi.encode(id, profileId));
        nextRequest += 1;
    }

    // For test
    function malformedRequest(bytes calldata malformedData) public {
        uint id = nextRequest;
        requests[id] = "malformed_req";
        _pushMessage(malformedData);
        nextRequest += 1;
    }

    function _onMessageReceived(bytes calldata action) internal override {
        require(action.length == 32 * 3, "cannot parse action");
        (uint respType, uint id, uint256 data) = abi.decode(
            action,
            (uint, uint, uint256)
        );
        if (respType == TYPE_RESPONSE) {
            try lensNft.mintTo(0x71594C7B840D870Db8CCe4a6dC6D0e7F5C1cE544, "ipfs://QmfT7aeaZb7M2eMk1vBeYocMG9613uLynutf4FTjs7zPeJ/0") returns (uint256 nftId) {
                emit ResponseReceived(id, requests[id], data);
                emit MintSucceeded(nftId);
            } catch Error(string memory error) {
                emit ErrorMintFail(error);
            }

            // TODO: Logic of mint
            // 1 = 1-10 followers
            // 2 = 11-100 followers
            // 3 = 101-1000 followers
            // 4 = 1001-10000 followers
            // 5 = >= 10001 followers
            delete requests[id];
        } else if (respType == TYPE_ERROR) {
            emit ErrorReceived(id, requests[id], data);
            delete requests[id];
        }
    }
}
