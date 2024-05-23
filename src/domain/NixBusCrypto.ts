import type { NixBusCiphers } from 'src/domain/NixBusCiphers'
import type { NixBusPassphrases } from 'src/domain/NixBusPassphrases'

type Deps = {
  passphrases: NixBusPassphrases
  ciphers: NixBusCiphers
}
export class NixBusCrypto {
  constructor(private deps: Deps) {}

  public async encrypt(text: string) {
    const cipher = this.deps.ciphers.getDefault()
    const passphrase = await this.deps.passphrases.getDefault()
    return await cipher.encrypt(text, passphrase)
  }

  public async decrypt(text: string) {
    const cipherVersion = this.getCipherVersion(text)
    const cipher = this.deps.ciphers.getByVersion(cipherVersion)
    const passphraseVersion = this.getPassphraseVersion(text)
    const passphrase = await this.deps.passphrases.getByVersion(passphraseVersion)
    return await cipher.decrypt(text, passphrase)
  }

  private getPassphraseVersion(text: string) {
    return text.split(':')[0]
  }

  private getCipherVersion(text: string) {
    return text.split(':')[1]
  }
}
