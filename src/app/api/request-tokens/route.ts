import { ethers } from "ethers";

const FAUCET_CONTRACT_ADDRESS = "0xe524B7EeE466cebBD1F9A55aEE8D488FA15E60E9";
const FAUCET_ABI = ["function mint(address to, uint256 amount) external"];

// Replace with your Lens Sepolia RPC URL
const RPC_URL = "https://rpc.testnet.lens.dev";
// Replace with your faucet wallet private key (without 0x prefix)
const PRIVATE_KEY = process.env.SIGNING_KEY!;

export async function POST(req: Request) {
  // Verify origin
  const origin = req.headers.get("origin");
  if (origin !== "http://localhost:3000") {
    return new Response(JSON.stringify({ message: "Forbidden" }), {
      status: 403,
    });
  }

  try {
    const { address } = await req.json();

    const _wallet = new ethers.Wallet(PRIVATE_KEY);

    const rpcConnection = {
      url: RPC_URL,
      headers: {
        "Content-Type": "application/json",
      },
      user: _wallet.address,
      password: "",
      allowInsecureAuthentication: true,
      allowGzip: true,
      throttleLimit: 10,
      throttleSlotInterval: 1000,
      // throttleCallback: async (attempt: number, url: string) => true,
      skipFetchSetup: true,
      fetchOptions: {},
      errorPassThrough: true,
      timeout: 10000,
    };

    const provider = new ethers.providers.JsonRpcProvider(rpcConnection);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const faucetContract = new ethers.Contract(
      FAUCET_CONTRACT_ADDRESS,
      FAUCET_ABI,
      wallet
    );
    const amount = ethers.utils.parseEther("5000");

    const tx = await faucetContract.mint(address, amount);
    await tx.wait();

    return new Response(JSON.stringify({ transactionHash: tx.hash }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: (error as Error).message }), {
      status: 500,
    });
  }
}
