import idl from "../idl.json";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
	Program,
	Provider,
} from "@project-serum/anchor";


const RPC_NETWORK='https://solana-devnet.g.alchemy.com/v2/enjNv7sVQITOkGi9dEOCqrP1JyFFdn3n'


export const loadBlockchain=()=> {

const programID = new PublicKey('9PyH3wLrcfjjCFqMRq5mMapnqs6qb38Vx5XTTRgM3C9Y');
const opts = {
	preflightCommitment: "processed",
};

const network = clusterApiUrl("devnet");
const connection = new Connection(RPC_NETWORK, opts.preflightCommitment);
		const provider = new Provider(
			connection,
			window.solana,
			opts.preflightCommitment
		);

const program = new Program(idl, programID, provider);

return {program,provider,connection}

}
