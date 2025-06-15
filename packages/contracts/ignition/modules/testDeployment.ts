import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const YourContractModule = buildModule("YourContractModule", (m) => {
  const contract = m.contract("RSAPublicKeyStorage");
  return { contract };
});

export default YourContractModule;
