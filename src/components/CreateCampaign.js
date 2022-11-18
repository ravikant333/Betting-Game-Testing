import React, { useState } from 'react'
import { loadBlockchain } from './loadBlockchain'
import {
	web3,
	utils,
	BN,
} from "@project-serum/anchor";
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey'
import { Buffer } from "buffer";
window.Buffer = Buffer;
const { SystemProgram } = web3;




const CreateCampaign = () => {
  const[cmp,setcmp]=useState([])
  
  const{program,provider,connection}=loadBlockchain()
 
  const createcampaign=async()=>{
  const [campaign] = await findProgramAddressSync(
    [
        utils.bytes.utf8.encode("CAMPAIGN_DEMO"),provider.wallet.publicKey.toBuffer(),
    ],
    program.programId
);
await program.rpc.create("campaign name2", "campaign description", {
    accounts: {
        campaign,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
    },
});
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
			
			await program.rpc.donate(new BN(0.2 * web3.LAMPORTS_PER_SOL), {
				accounts: {
					campaign: publicKey,
					user: provider.wallet.publicKey,
					systemProgram: SystemProgram.programId,
				},
			});
			console.log("Donated some money to:", publicKey.toString());
			
		} catch (error) {
			console.error("Error donating:", error);
		}
	};



  return (
    <div>
     
      <button onClick={createcampaign}> Create</button>
      <button onClick={getcampaign}> Get</button>
      {cmp.map((campaign) => (
				<>
					<p>Campaign ID: {campaign.pubkey.toString()}</p>
					<p>
						Balance:{" "}
						{(
							campaign.amountDonated / web3.LAMPORTS_PER_SOL
						).toString()}
					</p>
					<p>{campaign.name}</p>
					<p>{campaign.description}</p>
          <button onClick={() => donate(campaign.pubkey)}>
						Click to donate!
					</button>
					<button onClick={() => withdraw(campaign.pubkey)}>
						Click to withdraw!
					</button>
					<br />
				</>
			))}
    </div>
  )
}

export default CreateCampaign