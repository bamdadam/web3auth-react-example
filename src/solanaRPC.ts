import * as anchor from "@project-serum/anchor";
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { CustomChainConfig, SafeEventEmitterProvider } from "@web3auth/base";
import { SolanaWallet } from "@web3auth/solana-provider";
import { Program } from "@project-serum/anchor";
import idl from "./idl.json"
import {IDL} from "./increment_pda";
// import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
class swallet extends SolanaWallet {
  publicKey:PublicKey;
  constructor(publicKey:PublicKey, provider: SafeEventEmitterProvider) {
    super(provider);
    this.publicKey = publicKey;
}
}
let counter1Pda: PublicKey;
let counter1Bump: number;
export default class SolanaRpc {
  
  private provider: SafeEventEmitterProvider;
  private programID = new PublicKey(idl.metadata.address);
  private wallet:any;
  private isWalletInit = false;
  private program:any;
  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }

  incrementCounter = async (): Promise<string[]> => {
    if (!this.isWalletInit) {
      console.log("making anchor program");
      
      await this.initWallet();
    }
    try {
      // const solanaWallet = new SolanaWallet(this.provider);
      // const acc = await solanaWallet.requestAccounts();
      [counter1Pda, counter1Bump] = await anchor.web3.PublicKey.findProgramAddress(
        [
          this.program.provider.wallet.publicKey.toBuffer()
        ],
        this.program.programId,
      );      
      let sig = await this.program.methods.increment()
                                          .accounts({
                                            counter:counter1Pda,
                                            authority:this.program.provider.wallet.publicKey
                                          })
                                          .signers([])
                                          .rpc();
      // console.log((await this.program.account.counter.fetch(counter1Pda)).count.toNumber());
      console.log(await this.showCounter());
      return sig;
    } catch (error) {
      return error as string[];
    }
  };

  showCounter = async ():Promise<string> => {
    if (!this.isWalletInit) {
      console.log("making anchor program");
      await this.initWallet();
    }
    try {
      [counter1Pda, counter1Bump] = await anchor.web3.PublicKey.findProgramAddress(
        [
          this.program.provider.wallet.publicKey.toBuffer()
        ],
        this.program.programId,
      );  
      return (await this.program.account.counter.fetch(counter1Pda)).count.toNumber();
    } catch (error) {
      return error as string;
    }
  }

  Airdrop = async(): Promise<string> => {
    if (!this.isWalletInit) {
      console.log("making anchor program");
      
      await this.initWallet();
    }
    try {
      const airdropSignature = await this.program.provider.connection.requestAirdrop(
        this.program.provider.wallet.publicKey,
        1 * LAMPORTS_PER_SOL
      );
      const latestBlockHash = await this.program.provider.connection.getLatestBlockhash();
      await this.program.provider.connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: airdropSignature
      });
      return await this.program.provider.connection.getBalance(this.program.provider.wallet.publicKey)
      // throw new Error("Method not implemented.");
    } catch (error) {
      return error as string;
    }
    
  }

  initWallet = async (): Promise<string> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const userAcc = await solanaWallet.requestAccounts();
      const connectionConfig = await solanaWallet.request<CustomChainConfig>({ method: "solana_provider_config", params: [] });
      const conn = new Connection(connectionConfig.rpcTarget);
      const seed = new PublicKey(userAcc[0]);
      const wallet = new swallet(seed, this.provider);
      const provider = new anchor.AnchorProvider(conn, wallet, anchor.AnchorProvider.defaultOptions());
      anchor.setProvider(provider);
      this.program = new Program(IDL, this.programID,provider);
      console.log("init wallet done");
      return "done";
    } catch (error) {
      return error as string;
    }
  };

  initCounter = async (): Promise<string> => {
    if (!this.isWalletInit) {
      console.log("making anchor program");
      
      await this.initWallet();
    }
    const solanaWallet = new SolanaWallet(this.provider);
    const userAcc = await solanaWallet.requestAccounts();
    const seed = new PublicKey(userAcc[0]);
    try {
      [counter1Pda, counter1Bump] = await anchor.web3.PublicKey.findProgramAddress(
        [
          seed.toBuffer()
        ],
        this.program.programId,
      );      
      let sig = await this.program.methods.initialize(
        counter1Bump,
      ).accounts({
        payer:new PublicKey(userAcc[0]),
        counter: counter1Pda,
        systemProgram:anchor.web3.SystemProgram.programId,
        authority: new PublicKey(userAcc[0])
      }).rpc();
      return sig;
    //   const latestblockhash = await conn.getLatestBlockhash()
    // const trx = new Transaction({
    //   feePayer:wallet.publicKey,
    //   blockhash:latestblockhash.blockhash,
    //   lastValidBlockHeight:latestblockhash.lastValidBlockHeight
    // }).add(tri);
    // const { blockhash } = await conn.getRecentBlockhash("finalized");
    // const transaction = new Transaction({ recentBlockhash: blockhash, feePayer: new PublicKey(seed) }).add(tri).sign(wallet);
    // const { signature } = await solanaWallet.signAndSendTransaction(transaction);
    // const {signature} = await solanaWallet.signAndSendTransaction(trx);
    // const  signature  = await this.provider.request({
    //     method: "signAndSendTransaction",
    //     params: {
    //     message: bs58.encode(trx.serializeMessage()),
    //   },
    // });
    // let sig = await conn.getSignatureStatus(signature as string);
    // console.log(sig);
    // const signedTx = await solanaWallet.signTransaction(trx);
    // return signedTx.signature?.toString() || "";
    // await program.rpc
    // return signature;
    
    } catch (error) {
      return error as string;
    }
  };



  getAccounts = async (): Promise<string[]> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const acc = await solanaWallet.requestAccounts();
      return acc;
    } catch (error) {
      return error as string[];
    }
  };

  getBalance = async (): Promise<string> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const connectionConfig = await solanaWallet.request<CustomChainConfig>({ method: "solana_provider_config", params: [] });
      const conn = new Connection(connectionConfig.rpcTarget);

      const accounts = await solanaWallet.requestAccounts();
      const balance = await conn.getBalance(new PublicKey(accounts[0]));
      return balance.toString();
    } catch (error) {
      return error as string;
    }
  };

  signMessage = async (): Promise<string> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const msg = Buffer.from("Test Signing Message ", "utf8");
      const res = await solanaWallet.signMessage(msg);
      return res.toString();
    } catch (error) {
      return error as string;
    }
  };

  sendTransaction = async (): Promise<string> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const connectionConfig = await solanaWallet.request<CustomChainConfig>({ method: "solana_provider_config", params: [] });
      const conn = new Connection(connectionConfig.rpcTarget);

      const pubKey = await solanaWallet.requestAccounts();
      const { blockhash } = await conn.getRecentBlockhash("finalized");
      const TransactionInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.01 * LAMPORTS_PER_SOL,
      });
      const transaction = new Transaction({ recentBlockhash: blockhash, feePayer: new PublicKey(pubKey[0]) }).add(TransactionInstruction);
      const { signature } = await solanaWallet.signAndSendTransaction(transaction);
      return signature;
    } catch (error) {
      return error as string;
    }
  };

  signTransaction = async (): Promise<string> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const connectionConfig = await solanaWallet.request<CustomChainConfig>({ method: "solana_provider_config", params: [] });
      const conn = new Connection(connectionConfig.rpcTarget);

      const pubKey = await solanaWallet.requestAccounts();
      const { blockhash } = await conn.getRecentBlockhash("finalized");
      const TransactionInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.01 * LAMPORTS_PER_SOL,
      });
      const transaction = new Transaction({ recentBlockhash: blockhash, feePayer: new PublicKey(pubKey[0]) }).add(TransactionInstruction);
      const signedTx = await solanaWallet.signTransaction(transaction);
      return signedTx.signature?.toString() || "";
    } catch (error) {
      return error as string;
    }
  };

  getPrivateKey = async (): Promise<string> => {
    const privateKey = await this.provider.request({
      method: "solanaPrivateKey",
    });

    return privateKey as string;
  };
}