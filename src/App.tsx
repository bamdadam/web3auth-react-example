import { useEffect, useState } from "react";
import { Web3AuthCore } from "@web3auth/core";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider, WALLET_ADAPTERS} from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import RPC from "./solanaRPC";
import "./App.css";
// import { Web3Auth } from "@web3auth/web3auth";


const clientId = "BOGCsjTvqsl_3CnYyb9Q9lmKwQmmiji9useH660p1GC5cRU_B3MqnsRdL3u36rM6IxOYsVjKmu-Pck0dhZ_0Gq4"; // get from https://dashboard.web3auth.io

function App() {
  const [web3auth, setWeb3auth] = useState<Web3AuthCore | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);

  useEffect(() => {
    const init = async () => {
      try {

      // const web3auth = new Web3Auth({
      //   clientId,
      //   chainConfig: {
      //     chainNamespace: CHAIN_NAMESPACES.SOLANA,
      //     chainId: "0x3", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3  for Devnet
      //     rpcTarget: "https://api.devnet.solana.com", // This is the public RPC we have added, please pass on your own endpoint while creating an app
      //   },
      // });
      const web3auth = new Web3AuthCore({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.SOLANA,
            chainId: "0x3", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3  for Devnet
            rpcTarget: "https://api.devnet.solana.com", // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
      });

      setWeb3auth(web3auth);

      const openloginAdapter = new OpenloginAdapter({
        adapterSettings: {
          network: "testnet",
          clientId: "Your clientId from Plug n play section",
          uxMode: "popup",
          loginConfig: {
            google: {
              name: "any name",
              verifier: "testHoney-google-test",
              typeOfLogin: "google",
              clientId: "781899976983-isp8edmm0u93n9lekbq172hfaolgukso.apps.googleusercontent.com",
        
            },
          },
        }
      });
      web3auth.configureAdapter(openloginAdapter);

      await web3auth.init();
      if (web3auth.provider) {
        setProvider(web3auth.provider);
      }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(
      WALLET_ADAPTERS.OPENLOGIN,
      {
        loginProvider: 'google',
      },
    );
    // const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log(user);
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    console.log(address);
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    console.log(balance);
  };

  const initCounter = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.initCounter();
    console.log(receipt);
  };

  const Airdrop = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.Airdrop();
    console.log(signedMessage);
  };

  const showCounter = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.showCounter();
    console.log(signedMessage);
  };

  const incrementCounter = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.incrementCounter();
    console.log(signedMessage);
  };

  const getPrivateKey = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    console.log(privateKey);
  };
  const loggedInView = (
    <>
      <button onClick={getUserInfo} className="card">
        Get User Info
      </button>
      <button onClick={getAccounts} className="card">
        Get Accounts
      </button>
      <button onClick={getBalance} className="card">
        Get Balance
      </button>
      <button onClick={Airdrop} className="card">
        Airdrop 1 Sol
      </button>
      <button onClick={initCounter} className="card">
        initCounter
      </button>
      <button onClick={incrementCounter} className="card">
        incrementCounter
      </button>
      <button onClick={showCounter} className="card">
        Show Counter
      </button>
      <button onClick={getPrivateKey} className="card">
        Get Private Key
      </button>
      <button onClick={logout} className="card">
        Log Out
      </button>

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
          Web3Auth
        </a>
        & ReactJS Example
      </h1>

      <div className="grid">{provider ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a href="https://github.com/Web3Auth/Web3Auth/tree/master/examples/react-app" target="_blank" rel="noopener noreferrer">
          Source code
        </a>
      </footer>
    </div>
  );
}

export default App;