import { ethers } from "ethers";
import styled from '@emotion/styled'
import { useState } from "react";


const Container = styled.div`
  padding-top: 200px;
  text-align: center;
`

const FormWrapper = styled.div`
  padding: 50px;
  width: 80%;

  div {
    width: 100%;
    display: flex;
    justify-content: space-between; 

    margin: 10px;

    input { 
      width: 70%;
    }

  }

`

const IERC1155 = [
  "function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data)"
]

const getFee = async (provider) => {
  const { maxFeePerGas, maxPriorityFeePerGas } = await provider.getFeeData();
  return { 
    maxFeePerGas: maxFeePerGas.mul(2), 
    maxPriorityFeePerGas, //: maxPriorityFeePerGas.mul(2)
  }
}

const SendToken = () => {
  // const defContractAddress = "0x6702E7F46D778291bd71344d5F9C4D6CBb8774b6";
  // const tokenId = 1;
  const [contractAddress, setContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");

  // const accounts = [
  //   "0x11382C88E24E650DbBeF5632eA75464c15bfd66b",
  //   "0x5Be399328A4CC9C7fF0a377028ba5aF7e0f743d6"
  // ]


  const handleSend = async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    // const recipientAddress = signer.getAddress() === accounts[0] ? accounts[1] : accounts[0];

    console.log(`signer address: ${await signer.getAddress()}`)

    const txOptions = await getFee(provider);
    const contract = new ethers.Contract(contractAddress, IERC1155, signer);

    const from = await signer.getAddress();
    const to = recipientAddress;
    console.log("safeBatchTransferFrom", {
      contractAddress,
      from,
      to,
      txOptions
    })
    const tx = await contract.safeBatchTransferFrom(from, to, [tokenId], [1], "0x", txOptions)
    console.log({ tx })
  }

  return (
    <FormWrapper>
      <div>
        <label>contract address</label>
        <input placeholder="contract address" 
          value={contractAddress}
          onChange={e => setContractAddress(e.target.value)} />
      </div>
      <div>
        token id
        <input placeholder="token id" 
          value={tokenId}
          onChange={e => setTokenId(e.target.value)}
        />
      </div>
      <div>
        recipient
        <input placeholder="recipient" 
          value={recipientAddress} 
          onChange={e => setRecipientAddress(e.target.value)}
        />
      </div>
      <button onClick={handleSend}>Send</button>
    </FormWrapper>
  )

}

function App() {
  return (
    <Container>
      <header className="App-header">
        <h1>ERC1155 transfer token</h1>
        <div>
          use metamask to sign the transaction
        </div>
      </header>

      <SendToken />
    </Container>
  );
}

export default App;
