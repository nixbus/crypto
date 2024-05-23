import type { Passphrase } from 'src/domain/NixBusPassphrases'
import { NixBusCiphers } from 'src/domain/NixBusCiphers'
import { NixBusCrypto } from 'src/domain/NixBusCrypto'
import { NixBusInMemoryPassphrases } from 'src/infrastructure/NixInMemoryPassphrases'

export type { NixBusCrypto } from 'src/domain/NixBusCrypto'

let nixBusCrypto: NixBusCrypto | null = null
export const getNixBusCrypto = ({
  defaultPassphraseVersion,
  passphrases,
}: {
  defaultPassphraseVersion: string
  passphrases: Passphrase[]
}): NixBusCrypto => {
  if (nixBusCrypto) {
    return nixBusCrypto
  }

  nixBusCrypto = createNixBusCrypto({
    defaultPassphraseVersion,
    passphrases,
  })

  return nixBusCrypto
}

export const createNixBusCrypto = ({
  defaultPassphraseVersion,
  passphrases,
}: {
  defaultPassphraseVersion: string
  passphrases: Passphrase[]
}): NixBusCrypto => {
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

  passphrases.forEach((p) => nixBusPassphrases.put(p))

  const ciphers = new NixBusCiphers()
  nixBusCrypto = new NixBusCrypto({ passphrases: nixBusPassphrases, ciphers })

  return nixBusCrypto
}
