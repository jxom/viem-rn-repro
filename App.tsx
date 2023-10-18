import 'fastestsmallesttextencoderdecoder';
import 'react-native-get-random-values';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { createPublicClient, createWalletClient, http } from 'viem'
import { goerli } from 'viem/chains'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { useEffect, useState } from 'react';
import { abi } from './abi';

const privateKey = generatePrivateKey()

const publicClient = createPublicClient({
  chain: goerli,
  transport: http()
})
const walletClient = createWalletClient({
  account: privateKeyToAccount(privateKey),
  chain: goerli,
  transport: http()
})

export default function App() {
  const [totalSupply, setTotalSupply] = useState(0n)

  useEffect(() => {
    (async () => {
      const totalSupply = await publicClient.readContract({
        address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
        abi,
        functionName: 'totalSupply',
      })
      setTotalSupply(totalSupply)
    })()
  }, [])

  const mint = async () => {
    await walletClient.writeContract({
      address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
      abi,
      functionName: 'mint',
      args: [69420n]
    })
  }

  return (
    <View style={styles.container}>
      <Text>Total supply: {totalSupply.toString()}</Text>
      <Button onPress={() => mint()} title="mint" />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
