import ethers  from "ethers"
import starknet   from "starknet"
const BN = require( 'bn.js');
const { keccak256 } = require('ethereum-cryptography/keccak');
const ONE = toBN(1);
const TWO = toBN(2);
const MASK_250 = TWO.pow(toBN(250)).sub(ONE); // 2 ** 250 - 1
function isHex(hex:any) {
    return /^0x[0-9a-f]*$/i.test(hex);
  }

function removeHexPrefix(hex:any) {
    return hex.toString().replace(/^0x/, '');
  }
function utf8ToArray(str:any) {
    return new TextEncoder().encode(str);
  }

function buf2hex(buffer:any) {
    return [...buffer].map((x) => x.toString(16).padStart(2, '0')).join('');
  }

function addHexPrefix(hex:any) {
    return `0x${removeHexPrefix(hex)}`;
  }
function toBN(number:any, base='hex') {
    console.log("---------------------number ",number)
    if (typeof number === 'string') {
      // eslint-disable-next-line no-param-reassign
      number = number.toLowerCase();
    }
    if (typeof number === 'string' && isHex(number) && !base)
      return new BN(removeHexPrefix(number), 'hex');
    return new BN(removeHexPrefix(number), base);
  }

function toHex(number:any) {
    return addHexPrefix(number.toString('hex'));
  }

function keccakHex(value:any ) {
    return addHexPrefix(buf2hex(keccak256(utf8ToArray(value))));
  }
  
  /**
   * Function to get the starknet keccak hash from a 
   *
   * [Reference](https://github.com/starkware-libs/cairo-lang/blob/master/src/starkware/starknet/public/abi.py#L17-L22)
   * @param value -  you want to get the starknetKeccak hash from
   * @returns starknet keccak hash as BigNumber
   */
   function starknetKeccak(value:any){
    return toBN(keccakHex(value)).and(MASK_250);
  }
  
  /**
   * Function to get the hex selector from a given function name
   *
   * [Reference](https://github.com/starkware-libs/cairo-lang/blob/master/src/starkware/starknet/public/abi.py#L25-L26)
   * @param funcName - selectors abi function name
   * @returns hex selector of given abi function name
   */
   function getSelectorFromName(funcName:any ) {
    // sometimes BigInteger pads the hex  with zeros, which isnt allowed in the starknet api
    return toHex(starknetKeccak(funcName));
  }

const main = async () => {
    let config_polygon_testnet = {
        "provider_url" : "https://starknet-goerli.infura.io/v3/5c5b4e33ada6462daeb9cc359be7c5e9",
        "contractAddress" : "0x06be6be4e99cffd1e39867d8fa895fb3195fca412fb74bd5a6f4b78db76974d5",
    }
    const config = config_polygon_testnet
    // const provider = new starknet.Provider()
    const provider = new starknet.Provider({
        sequencer: {
          network: 'goerli-alpha'// 'mainnet-alpha' // or 'goerli-alpha'
        }
      })

    let key = "0x206f38f7e4f15e87567361213c28f235cccdaa1d7fd34c9db1dfe9489c6a091"
    let val = await provider.getStorageAt(config.contractAddress,key)
    // console.log(val);
    console.log(key);

      console.log(getSelectorFromName("name()"));



}

main()