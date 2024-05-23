import type { NixBusPassphrases, Passphrase, PassphraseVersion } from 'src/domain/NixBusPassphrases'
import { PassphraseNotFound } from 'src/domain/errors'

export class NixBusInMemoryPassphrases implements NixBusPassphrases {
  private readonly passphrases: Record<PassphraseVersion, Passphrase>

  constructor(private options: { defaultVersion: string }) {
    this.passphrases = {}
  }

  public async getByVersion(version: PassphraseVersion): Promise<Passphrase> {
    const passphrase = this.passphrases[version]
    if (!passphrase) {
      throw new PassphraseNotFound()
    }
    return passphrase
  }

  public async getDefault(): Promise<Passphrase> {
    return this.getByVersion(this.options.defaultVersion)
  }

  public async put(passphrase: Passphrase): Promise<void> {
    this.passphrases[passphrase.version] = passphrase
  }
}
