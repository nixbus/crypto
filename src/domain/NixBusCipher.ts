import type { Passphrase } from 'src/domain/NixBusPassphrases'

export interface NixBusCipher {
  decrypt(text: string, passphrase: Passphrase): Promise<string>

  encrypt(text: string, passphrase: Passphrase): Promise<string>

  getVersion(): string
}
