import idl from "./idl.json";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
	Program,
	Provider,
} from "@project-serum/anchor";

import React from "react";



export const loadBlockchain=()=> {

const programID = new PublicKey('5fgGihdCEzp9Cqzc2HryoxM65kcpkHctrsvuT9ZwWAKN');
const opts = {
	preflightCommitment: "processed",
};

const network = clusterApiUrl("devnet");
const connection = new Connection(network, opts.preflightCommitment);
		const provider = new Provider(
			connection,
			window.solana,
			opts.preflightCommitment
		);

const program = new Program(idl, programID, provider);

return {program,provider,connection}
}
