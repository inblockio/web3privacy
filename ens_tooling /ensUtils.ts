import {createPublicClient, custom} from "viem";
import {mainnet} from "viem/chains";
import {ethers} from "ethers";

async function updateDomainField(fieldName: string, fieldValue: string, domainName: string, chain = mainnet, registrarAddress: string = "0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63"): Promise<string> {

    if (!domainName.endsWith(".eth")) {
        domainName = domainName + ".eth"
    }

    const publicClient = createPublicClient({
        chain: chain,
        transport: custom(window.ethereum),
    });

    const resolverAddress = await publicClient.getEnsAddress({name: domainName});
    console.log(resolverAddress)

    const abi = [
        "function setText(bytes32 node, string key, string value)"
    ];

    const iface = new ethers.Interface(abi);

    const node = ethers.namehash(domainName);

    const data = iface.encodeFunctionData("setText", [node, fieldName, fieldValue]);

    console.log(data);

    const txParams = {
        from: resolverAddress,
        to: registrarAddress,
        data: data,
    };

    const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
    });

    console.log('Transaction sent. Hash:', txHash);
    return txHash;
}

const _ = {
    updateDomainField
}

export default _;