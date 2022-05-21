// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
////////////////////////////////////////////////////////
// hardhat test accounts
// admin 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// supplier 1 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
// supplier 2 0x90F79bf6EB2c4f870365E785982E1f101E93b906
// supplier 3 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
//////////////////////////////////////////////////////////
//import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
/*is Ownable*/
contract SupplyChainTracking is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _productId;
    Counters.Counter private _tokenIds;
  /*
    A step describes if there is or not a start or a end of a process.
    We track per each step 
    who is the supplier which is processing the product
    the time when we started the step
    if the step is transferred to another
    if the step was reprocessed
    and lists of parameters that we want to track
    */
  struct Step {
    address supplier;
    uint256 timetracked;
    bool transferred;
    uint256 reprocessedCounter;
    /*
        string [] parametersNames;
        string [] parametersValues
        */
  }
  /*
    A product is the object that is moving in the process.
    Per each product is assigned a batch and the list of in what steps the procut was processed.
    */
  struct Product {
    uint256 id;
    string batch;
    uint256 howmanysteps;
    uint8[] whatqueues;
    mapping(uint8 => Step) steps;
  }
  /*
    We save information about the supplier .
    This info can be encrypted and accessible by the admin.
    The supplier can decide what information are accessible.
    */
  struct Supplier {
    string ragsoc;
    string piva;
    string location;
  }
   constructor() ERC721("Decentralized Supply Chain Tracking","DSCT")  {
    }

  /*
    Only a certain list of suppliers can use the functions of the contract
    */
  address[] private whitelist;
  /*
    Mapping of supplier address to their information
    */
  mapping(address => Supplier) public supplierInfo;
  /*
    boolen mapping  to give a address the access to decrypt supplier information
    */
  mapping(address => bool) public canDecryptSupplierInfo;
  /*
  if the supplier can mint
  */
  mapping(address => bool) public canMint;
  /*
  if a queue is starting queue
  */
  mapping (uint8 => bool) public isStart;
  /*
  if a queue is ending queue
  */
  mapping (uint8 => bool) public isEnd;

  /*
    List of the products processed
    */
  mapping(uint256 => Product) public productsProcessed;
  /*
    Queue of who has the push access to another queue
    */
  mapping(address => uint8[]) public queuePushAccess;
  /*
    Queue of who has the pull access from a queue
    */
  mapping(address => uint8[]) public queuePullAccess;
  /*
    What batch is processed in queue
    */
  mapping(uint8 => uint256[]) public batchInQueue;

/*
product id and token id 
*/

mapping (uint256 => uint256 ) public tokenIdFromProductId;
mapping (uint256 => uint256 ) public productIdFromTokenId;
/*
minting credit
*/
  mapping (address => uint256) public mintingCredit;

  /*
    give access to an address to push to a certain queue
    */
  function givePushAccessToAddressIntoQueue(address _supplier, uint8 _queueId) public /*onlyOwner */
  {
    queuePushAccess[_supplier].push(_queueId);
  }
  /*
    Give access to an address to pull to a certain queue
    */
  function givePullAccessToAddressIntoQueue(
    address _supplier,
    uint8 _queueId /*onlyOwner*/
  ) public {
    queuePullAccess[_supplier].push(_queueId);
  }

  /*
  set if a queue is a start
  */
  function setStart ( uint8 _queueId) public {
    isStart[_queueId] = true;
  }

  function removeStart ( uint8 _queueId) public {
    isStart[_queueId] = false;
  }


  /*
    set if a queue is a start
  */
  function setEnd ( uint8 _queueId) public {
    isEnd[_queueId] = true;
  }

  function removeEnd ( uint8 _queueId) public {
    isEnd[_queueId] = false;
  }

  /*
    msg sender if authorized push a batch into a queue
    */
  function pushBatchInQueue(uint8 _queueId) public {

    require(isStart[_queueId] == true,"error|009|The queue is not set as start queue, so you can no push here.");

    bool isAuthorized = isSupplierInWhiteList(msg.sender);
    require(isAuthorized == true, "error|001|The msg.sender is not in whitelist");
    
    bool check = false;
    for (uint256 i = 0; i < queuePushAccess[msg.sender].length; i++) {
     
      if(queuePushAccess[msg.sender][i] == _queueId){
          check = true;
          break;
      }
      
    }
    require ( check == true,"error|002|msg sender has to be autorized to push");

     _productId.increment();
     uint256 _id = _productId.current();

    Product storage product = productsProcessed[_id];
    product.id = _id;
    product.batch = Strings.toString(block.timestamp);
    product.howmanysteps++;
    product.whatqueues.push(_queueId);
    product.steps[_queueId].supplier = msg.sender;
    product.steps[_queueId].timetracked = block.timestamp;
    product.steps[_queueId].transferred = false;
    product.steps[_queueId].reprocessedCounter = 0;
    batchInQueue[_queueId].push(_id);
  }
  /*
    msg sender if authorized transfare a batch from a queue to anoter queue
    */
  function transferBatchFromTo(
    uint8 _queueIdA,
    uint8 _queueIdB,
    uint256 _id
  ) public {
    bool isAuthorized = isSupplierInWhiteList(msg.sender);
    require(isAuthorized == true, "error|003|The msg.sender is notin whitelist");
    bool check = false;
    for (uint256 i = 0; i < queuePushAccess[msg.sender].length; i++) {
      if (queuePushAccess[msg.sender][i] == _queueIdB) {
        check = true;
      }
    }
    require(check == true, "error|004|The msg.sender is not autorized to push");
    check = false;
    for (uint256 i = 0; i < queuePullAccess[msg.sender].length; i++) {
      if (queuePullAccess[msg.sender][i] == _queueIdA) {
        check = true;
      }
    }
    require(check == true, "error|005|The msg.sender is not autorized to pull");
    productsProcessed[_id].howmanysteps =  productsProcessed[_id].howmanysteps +1;
    productsProcessed[_id].steps[_queueIdB].supplier = msg.sender;
    productsProcessed[_id].steps[_queueIdB].timetracked = block.timestamp;
    productsProcessed[_id].steps[_queueIdB].transferred = false;
    if (_queueIdA == _queueIdB) {
      productsProcessed[_id].steps[_queueIdB].reprocessedCounter++;
    } else {
      productsProcessed[_id].whatqueues.push(_queueIdB);
      productsProcessed[_id].batch = string(abi.encodePacked(productsProcessed[_id].batch, '|', Strings.toString(block.timestamp)));
    }
    batchInQueue[_queueIdB].push(_id);
    productsProcessed[_id].steps[_queueIdA].transferred = true;
    for (uint256 i; i < batchInQueue[_queueIdA].length; i++) {
      if (batchInQueue[_queueIdA][i] == _id) {
        batchInQueue[_queueIdA][i] = batchInQueue[_queueIdA][batchInQueue[_queueIdA].length - 1];
        batchInQueue[_queueIdA].pop();
        break;
      }
    }

    if ( isEnd[_queueIdB]==true ){
        mintingCredit[msg.sender] ++;
    }

  }
  /*
    get the step of a product given a product and queue
    */
  function getProductsProcessedStep(uint256 _id, uint8 _queueId) public view returns (Step memory) {
    return productsProcessed[_id].steps[_queueId];
  }
    /*
    get the list of queues that processed  a product id
    */
  function getProductsProcessedWhatQueues(uint256 _id) public view returns (uint8[] memory) {
    return productsProcessed[_id].whatqueues;
  }
    /*
    get the lenght of step array 
    */
  function getProductsProcessedStepArrayLenght(uint256 _id) public view returns (uint256) {
    return productsProcessed[_id].howmanysteps; 
  }
  /*
    get the batch of productprocessed
    */
  function getProductsProcessedBatch(uint256 _id) public view returns (string memory) {
    return productsProcessed[_id].batch;
  }
  /*
    get the list of batches given a queue
    */
  function getProductsInQueue(uint8 _queueId) public view returns (uint256[] memory) {
    return batchInQueue[_queueId];
  }
  /*
    check if a supplier is in whitelist
    */
  function isSupplierInWhiteList(address _supplier) public view returns (bool) {
    for (uint256 i; i < whitelist.length; i++) {
      if (_supplier == whitelist[i]) {
        return true;
      }
    }
    return false;
  }
  /*
    add supplier into the whitelist
    */
  function addSupplierInWhiteList(address _supplier) public {
    whitelist.push(_supplier);
  }

  function removeSupplierInWhiteList(address _supplier) public {
   for (uint256 i; i <   whitelist.length; i++) {
      if (  whitelist[i] == _supplier) {
          whitelist[i] =   whitelist[  whitelist.length - 1];
          whitelist.pop();
        break;
      }
    }
  }


  function addSupplierInMintAccessList(address _supplier) public {
    
    canMint[_supplier]=true;
  }
  function removeSupplierInMintAccessList(address _supplier) public {
    
    canMint[_supplier]=false;
  }



  function mint( string memory tokenURI, uint256 _productId) public returns (uint256) {
      bool isAuthorized = isSupplierInWhiteList(msg.sender);
      require(isAuthorized == true, "error|001|The msg.sender is not in whitelist");

      require ( canMint[msg.sender]==true,"error|009|The msg.sender is not authorized because not found true in  minting list");

      require (    mintingCredit[msg.sender] >0,"error|010|The msg.sender does not have enough credit");
      _tokenIds.increment();

      uint256 newItemId = _tokenIds.current();
      _mint(msg.sender, newItemId);
      _setTokenURI(newItemId, tokenURI);

     

      productIdFromTokenId[newItemId] = _productId;
      tokenIdFromProductId[_productId] = newItemId;
     _transfer(msg.sender, address(this), newItemId);
      return newItemId;
  }

  /*
    remove supplier from the whitelist
  */
    /*
  setsupplier information
    */
  /*
  set if the supplier can mint
  */
  /*
  create a function to reinit the batchcounter
  */



}
