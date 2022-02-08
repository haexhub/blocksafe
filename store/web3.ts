import { make } from "vuex-pathify";
import { ethers } from "ethers";
import ipfs from "ipfs" 

export const state = () => ({
  availableNetworks: [
    { name: "Polygon", class: "", rpc: "", id: "", icon: "IconPolygon" },
    { name: "BSC", class: "", rpc: "", id: "", icon: "IconPolygon" },
    { name: "Avalanche", class: "", rpc: "", id: "", icon: "IconPolygon" },
  ],

  node: null,

  web3: {
    network: {
      id: 0,
      name: "",
    },

    gasPrice: null,
    balance: 0,
    feeData: {},
  },

});

export const getters = {
  ...make.getters(state),

  checkWeb3IsAvailable(): boolean {
    //@ts-ignore
    console.log("checkWeb3IsAvailable", window.ethereum);
    //@ts-ignore
    if (typeof window?.ethereum !== "undefined") {
      return true;
    } else {
      return false;
    }
  },

  createContract:
    (_: any, getters: IKeyValue) =>
    (
      contractAddress: string,
      abi: ethers.ContractInterface,
      providerOrSigner: ethers.providers.Provider | ethers.Signer
    ): ethers.Contract | null => {
      try {
        const provider = getters.web3Provider;

        console.log("createContract provider", provider);
        console.log("createContract abi", abi);
        if (!provider || !abi || !providerOrSigner) return null;

        const contract = new ethers.Contract(
          contractAddress,
          abi,
          providerOrSigner
        );
        return contract;
      } catch (error) {
        console.log(error);
        return null;
      }
    },

  extractFunctionsFromAbi:
    () =>
    (abi: ethers.ContractInterface): IKeyValue[] => {
      try {
        /* abi.filter((item) => {
          item.type === "function" ? true : false
        }) */
        return [];
      } catch (error) {
        console.log(error);
        return [];
      }
    },

  web3Provider(
    _: ReturnType<typeof state>,
    getters: IKeyValue
  ): ethers.providers.Provider | undefined {
    try {
      if (getters.checkWeb3IsAvailable)
        return new ethers.providers.Web3Provider(
          //@ts-ignore
          window.ethereum
        );
      else return undefined;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  },
};

export const mutations = {
  ...make.mutations(state),
};

export const actions = {

  async addFile (context: IKeyValue, content: string) {
    try { 
      const node = await ipfs.create({ silent: true})
      const { cid } = await node.add('Hello world')
console.info(cid)
    } catch (error) {
      console.log(error)
    }
  },

  async addToken(
    context: IKeyValue,
    {
      tokenAddress,
      tokenDecimals,
      tokenSymbol,
      tokenImage,
    }: {
      tokenAddress: string;
      tokenDecimals: number;
      tokenSymbol: string;
      tokenImage: string;
    }
  ) {
    try {
      const provider = context.getters("web3Provider");
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await provider.send({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  },

  async callContract(
    context: IKeyValue,
    {
      contractAddress,
      abi,
      signerOrProvider,
      functionName,
      parameter = [],
    }: {
      contractAddress: string;
      abi: IKeyValue[];
      signerOrProvider: IKeyValue;
      functionName: string;
      parameter: IKeyValue[];
    }
  ) {
    try {
      console.log("functionName", functionName);
      console.log("parameter", parameter);
      console.log("signerOrProvider", signerOrProvider);

      const contract = context.rootGetters["web3/createContract"](
        contractAddress,
        abi,
        signerOrProvider
      );

      console.log("contract", contract);
      let result;
      if (parameter.length) result = await contract[functionName](...parameter);
      else result = await contract[functionName]();

      console.log(functionName, result);
      return result;
    } catch (error) {
      console.log(error);
    }
  },

  async createNode (context: IKeyValue) {
    try {
      const node = await ipfs.create()
      context.commit("SET_NODE", node)
      console.log(context)
    } catch (error) {
      console.log(error)
    }
    
  },

  async getAccountPermission(context: IKeyValue): Promise<string[]> {
    try {
      const provider = context.getters.web3Provider;
      if (!provider) return [];

      const permittedAccounts = await provider.send("eth_requestAccounts", []);
      return permittedAccounts;
    } catch (error) {
      return [];
    }
  },

  async syncProvider(context: IKeyValue) {
    console.log("syncProvider");

    const provider = context.getters.web3Provider;

    if (!provider) return false;

    const network = await provider.getNetwork();

    console.log("context", context);
    context.commit("SET_WEB3", network);
    return true;
  },
};
