import React, { useState } from 'react'
import { loadBlockchain } from './loadBlockchain'
import {
	web3,
	utils,
	BN,
} from "@project-serum/anchor";
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey'
import { Buffer } from "buffer";
import { PublicKey } from '@solana/web3.js';
window.Buffer = Buffer;
const { SystemProgram } = web3;





const CreateCampaign = () => {
  const[cmp,setcmp]=useState([])
  
  const{program,provider,connection}=loadBlockchain()

 
  const createcampaign=async()=>{
  const [campaign] = await findProgramAddressSync(
    [
        utils.bytes.utf8.encode("DEMO"),provider.wallet.publicKey.toBuffer(),
    ],
    program.programId
);


await program.methods.create("campaign name2", "campaign description",new BN(0.2 * web3.LAMPORTS_PER_SOL)).accounts({
	      campaign,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
}).rpc();

console.log(
    "Created a new campaign w/ address:",
    campaign.toString()
);
  }
  

  const getcampaign=async()=>{

    Promise.all(
			(await connection.getProgramAccounts(program.programId)).map(
				async (campaign) => ({
					...(await program.account.campaign.fetch(campaign.pubkey)),
					pubkey: campaign.pubkey,
				})
			)
		).then((campaigns) => setcmp(campaigns));
	
  }



  const withdraw = async (publicKey) => {
		try {
			
			await program.rpc.withdraw(new BN(0.2 * web3.LAMPORTS_PER_SOL), {
				accounts: {
					campaign: publicKey,
					user: provider.wallet.publicKey,
				},
			});
			console.log("Withdrew some money from:", publicKey.toString());
		} catch (error) {
			console.error("Error withdrawing:", error);
		}
	};

  const donate = async (publicKey) => {
		try {
		
		await program.methods.pay().accounts({
			campaign: publicKey,
			user: provider.wallet.publicKey,
			systemProgram: SystemProgram.programId,
		}).rpc();
			console.log("Donated some money to:", publicKey.toString());
			
		} catch (error) {
			console.error("Error donating:", error);
		}
	};
//new BN(0.2 * web3.LAMPORTS_PER_SOL)


  return (
    <div>
     
      <button onClick={createcampaign}> Create</button>
      <button onClick={getcampaign}> Get</button>
	  
      {cmp.map((campaign,index) => (
				<div key={index}>
					<p>Game ID: {campaign.pubkey.toString()}</p>
					<p>
						Total Game Balance:
						{(
							campaign.amountGiven / web3.LAMPORTS_PER_SOL
						).toString()}
					</p>
					<p>Name :{campaign.name}</p>
					<p>Discription : {campaign.description}</p>
					<p>Admin : {campaign.admin.toString()}</p>
					<p>Start Time : { JSON.stringify(campaign.creationTime) }</p>
					<p>Game Status: {campaign.isCampaign?'Live':'End'}</p>
					<p>Betting Amount :{campaign.bettingAmount/web3.LAMPORTS_PER_SOL} SOL</p>
					<p>players : </p>
                    {  
						campaign.players.map((player,index)=>{
							return <p key={index}>{player.toString()}</p>
						})
					}
          <button onClick={() => donate(campaign.pubkey)}>
						Click to Bet!
					</button>
					<button onClick={() => withdraw(campaign.pubkey)}>
						Click to End Game/Withdraw
					</button>
					<br />
				</div>
			))}
    </div>
  )
}

export default CreateCampaign