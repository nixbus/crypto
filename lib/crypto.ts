import type { Passphrase } from 'src/domain/NixBusPassphrases'
import { NixBusCiphers } from 'src/domain/NixBusCiphers'
import { NixBusCrypto } from 'src/domain/NixBusCrypto'
import { NixBusInMemoryPassphrases } from 'src/infrastructure/NixInMemoryPassphrases'

let nixBusCrypto: NixBusCrypto | null = null
export const getNixBusCrypto = async ({
  defaultPassphraseVersion,
  passphrases,
}: {
  defaultPassphraseVersion: string
  passphrases: Passphrase[]
}): Promise<NixBusCrypto> => {
  if (nixBusCrypto) {
    return nixBusCrypto
  }

  nixBusCrypto = await createNixBusCrypto({
    defaultPassphraseVersion,
    passphrases,
  })

  return nixBusCrypto
}

export const createNixBusCrypto = async ({
  defaultPassphraseVersion,
  passphrases,
}: {
  defaultPassphraseVersion: string
  passphrases: Passphrase[]
}): Promise<NixBusCrypto> => {
  try {
    if (!crypto) {
      throw new Error(
        `crypto is not available in your Node.js/Browser environment. Please use Node.js v20.9.0 or greater, or an up-to-date browser.`,
      )
    }
  } catch (err) {
    throw new Error(
      `crypto is not available in your Node.js/Browser environment. Please use Node.js v20.9.0 or greater, or an up-to-date browser.`,
    )
  }

  const nixBusPassphrases = new NixBusInMemoryPassphrases({
    defaultVersion: defaultPassphraseVersion,
  })

  await Promise.all(passphrases.map((p) => nixBusPassphrases.put(p)))

  const ciphers = new NixBusCiphers()
  nixBusCrypto = new NixBusCrypto({ passphrases: nixBusPassphrases, ciphers })

  return nixBusCrypto
}
