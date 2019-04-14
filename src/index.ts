console.log("worked!");

import * as CRYPTOJS from "crypto-js";

class Block {
  //블록 넘버, 이전 블록의 해시, 타임스탬프, 정보값을 통해 해시값 출력한다.

  static calculateBlockHash = (
    index: number,
    previousHash: string,
    timestamp: number,
    data: string
  ): string => {
    return CRYPTOJS.SHA256(index + previousHash + timestamp + data).toString();
  };
  //static인 경우 클래스 외부에서도 사용할 수 있음.
  //해당 함수를 통해 해당 블록이 정의된 형태와 같은지 확인 가능
  static validateStructure = (toValidateBlock: Block): boolean => {
    if (
      typeof toValidateBlock.index === "number" &&
      typeof toValidateBlock.hash === "string" &&
      typeof toValidateBlock.previousHash === "string" &&
      typeof toValidateBlock.timestamp === "number" &&
      typeof toValidateBlock.data === "string"
    ) {
      return true;
    }
    return false;
  };

  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  constructor(
    index: number,
    hash: string,
    previousHash: string,
    data: string,
    timestamp: number
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

const genesisBlock_index = 0;

//최초의 블록을 제네시스 블록이라고 부른다.
const genesisBlock: Block = new Block(
  genesisBlock_index,
  "0xabc",
  "",
  "it's genesisBlock !",
  0
);
// 메인넷 cosmos에 제네시스 블록을 삽입했다.
// 합의 알고리즘 && 컨센서스 과정을 걸쳐 해당 cosmos에 이어나갈 블록이 결정된다.

let cosmos: Block[] = [genesisBlock];

const getCosmosNetwork = (index): Block[] => {
  // Main net
  if (index == 0) {
    return cosmos;
  }
  // Test net
  else {
    return cosmos;
  }
};

const getLatestBlock = (): Block => cosmos[cosmos.length - 1];

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
  const previousBlock: Block = getLatestBlock();
  const newIndex: number = previousBlock.index + 1;
  const newTimeStamp: number = getNewTimeStamp();

  // 최신 블록 + 1의 인덱스, 이전 블록의 해시, 현재 시간, 입력한 데이터 정보값으로 새로운 해시 값을 생성한다.
  const newHash: string = Block.calculateBlockHash(
    newIndex,
    previousBlock.hash,
    newTimeStamp,
    data
  );

  //새로운 블록을 만들때 위 정보와 더불어 새롭게 만들어진 해시값이 블록 생성에 필요하다.
  const newBlock: Block = new Block(
    newIndex,
    newHash,
    previousBlock.hash,
    data,
    newTimeStamp
  );

  addBlock(newBlock);

  return newBlock;
};

const addBlock = (candidateBlock: Block): void => {
  if (isBlockValid(candidateBlock, getLatestBlock())) {
    cosmos.push(candidateBlock);
  }
};

//추가할 블록의 해시 값을 가져온다.
const getHashForBlock = (toValidateBlock: Block): string => {
  let block_hash: string = Block.calculateBlockHash(
    toValidateBlock.index,
    toValidateBlock.previousHash,
    toValidateBlock.timestamp,
    toValidateBlock.data
  );

  return block_hash;
};

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
  //구조체 검사
  if (!Block.validateStructure(candidateBlock)) {
    return false;
  }
  //인덱스 요소 검사
  else if (previousBlock.index + 1 !== candidateBlock.index) {
    return false;
    //이전 블록과 바로 맞닿아 있는지 확인
  } else if (previousBlock.hash !== candidateBlock.previousHash) {
    return false;
  } else if (getHashForBlock(candidateBlock) !== candidateBlock.hash) {
    return false;
  } else {
    return true;
  }
};

createNewBlock("second");

console.log(cosmos);

createNewBlock("third");

console.log(cosmos);

createNewBlock("fourth");

console.log(cosmos);
